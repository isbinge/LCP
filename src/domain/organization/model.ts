import { message } from 'antd';
import { v1 as uuidv1 } from 'uuid';

import { setAuthV1ToLocal } from '@/utils/authentication';
import { routerRedux } from 'dva';
import LcpConst from '@/constants';
import { MEMBERS_DEFAULT_PAGE_STARTAT, MEMBERS_DEFAULT_PAGE_SIZE } from '@/constants/organization';

import {
  getDepts,
  getOrgMembers,
  createDept,
  updateDept,
  deleteDept,
  getDeptMembers,
  inviteMember,
  inviteMemberAgain,
  updateMember,
  deleteMembers,
  updateDeptManager,
  adjustDept,
  getMemberInfo,
  createOrg,
  getOrgs,
  deleteOrg,
  acceptInvitation,
  switchOrg,
  resetToNoOrg,
  getOrg,
  submitDissolutionSurvey,
  getDeptTree,
} from './service';
import { Department, Member, OrganizationDto, MemberInfoDto } from './data.d';
import { SelectState } from '../select.d';
import { LoginDto } from '../account/data.d';

export const accountSelector = (s: SelectState) => [s.account];

export interface OrganizationState {
  /**
   * 考虑使用 defaultOrgId 代替
   * 二者本质上相同
   */
  orgs: OrganizationDto[];
  orgName: string | null;
  depts: Department[];
  members: Member[];
}

const INITIAL_STATE: OrganizationState = {
  orgName: null,
  orgs: [],
  depts: [],
  members: [],
};

const model: Dva.ModelType<OrganizationState> = {
  namespace: 'organization',
  state: INITIAL_STATE,
  reducers: {
    updateOrgs(state, { payload: { orgs } }) {
      return {
        ...state,
        orgs,
      };
    },
    saveOrgId(state, { payload: { currentOrgId } }) {
      return {
        ...state,
        currentOrgId,
      };
    },
    saveOrg(state, { payload: { currentOrgId, companyName } }) {
      return {
        ...state,
        currentOrgId,
        orgName: companyName,
      };
    },
    updateDepts(state, { payload: depts }) {
      return {
        ...state,
        depts,
      };
    },
    updateMembers(state, { payload: members }) {
      return {
        ...state,
        members,
      };
    },
  },
  effects: {
    *getOrg({ payload }, { call, put, select }) {
      try {
        const orgId = yield payload?.orgId || select((state) => state.account.defaultOrgId);
        if (!orgId) {
          return false;
        }
        const res = yield call(getOrg, { orgId });
        yield put({ type: 'saveOrg', payload: { ...res, currentOrgId: orgId } });
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getOrgs(_, { call, put, select }) {
      try {
        const [{ userId }] = yield select(accountSelector);
        const orgs: OrganizationDto[] = yield call(getOrgs, { userId });
        yield put({ type: 'updateOrgs', payload: { orgs } });
        return orgs;
      } catch (e) {
        return message.error(e.data?.message || 'Failed to get orgs');
      }
    },
    *createOrg({ payload }, { call, put, select }) {
      try {
        const [{ userId }] = yield select(accountSelector);
        const id = uuidv1();
        yield call(createOrg, {
          ...payload,
          id,
          currentUserId: userId,
          address: 'example_address',
          email: 'example@example.com',
          tel: '00000000000',
        });
        yield put({
          type: 'switchOrg',
          payload: {
            nextOrgId: id,
            nextOrgName: payload.companyName,
          },
        });
        yield put({ type: 'getOrgs' });
        return Promise.resolve();
      } catch (e) {
        message.error(e.data?.message);
        return Promise.reject(e);
      }
    },
    *switchOrg({ payload: { nextOrgId, nextOrgName, quiet } }, { put, call, select }) {
      try {
        const { pathname } = yield select((state) => state.router.location);
        if (pathname !== '/home') {
          yield put(routerRedux.replace('/home', { shouldNotFetchApps: true }));
        }
        if (quiet !== true) {
          message.loading({
            content: nextOrgName ? `Switching to ${nextOrgName}...` : 'Switching organization...',
            key: LcpConst.antdMsgKey.SWITCH_ORGS,
          });
        }
        const [{ userId }] = yield select(accountSelector);
        const res: LoginDto = yield nextOrgId
          ? call(switchOrg, { companyId: nextOrgId, userId })
          : call(resetToNoOrg, { userId });
        setAuthV1ToLocal(res);
        yield put({ type: 'account/redeemToken' });
        if (nextOrgId) {
          yield put({
            type: 'getOrg',
            payload: {
              orgId: nextOrgId,
            },
          });
        } else {
          yield put({
            type: 'saveOrg',
            payload: {
              currentOrgId: null,
              companyName: null,
            },
          });
        }
        yield put({ type: 'app/getAppList', payload: { orgId: nextOrgId } });
        if (quiet !== true) {
          message.info({
            content: nextOrgName ? `Switched to ${nextOrgName}` : 'Switched',
            key: LcpConst.antdMsgKey.SWITCH_ORGS,
          });
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deleteOrg(_, { call, put, select }) {
      try {
        const [{ userId, defaultOrgId }] = yield select(accountSelector);
        yield call(deleteOrg, { companyId: defaultOrgId });
        const orgs: OrganizationDto[] = yield call(getOrgs, { userId });
        yield put({
          type: 'switchOrg',
          payload: {
            nextOrgId: orgs.length > 0 ? orgs[0].companyId : null,
            quiet: true,
          },
        });
        return orgs;
      } catch (e) {
        message.error(e.data?.message || 'Failed to delete organization');
        return Promise.reject(e);
      }
    },
    *requestDepts(payload, { call, put, select }) {
      try {
        const [{ defaultOrgId }] = yield select(accountSelector);
        const res = yield call(getDepts, { orgId: defaultOrgId } || payload);
        yield put({ type: 'updateDepts', payload: res });
        return res;
      } catch (e) {
        return message.error(e.data?.message || 'Failed to get departments');
      }
    },
    *createDept({ payload }, { call, put, select }) {
      try {
        const [{ defaultOrgId, userId }] = yield select(accountSelector);
        if (!defaultOrgId) {
          return Promise.reject('Please select company firstly');
        }
        yield call(createDept, {
          ...payload,
          orgId: defaultOrgId,
          userId,
        });
        return yield put({ type: 'requestDepts' });
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to create');
      }
    },
    *updateDept({ payload }, { call, put }) {
      try {
        yield call(updateDept, payload);
        return yield put({ type: 'requestDepts' });
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to update');
      }
    },
    *updateDeptManager({ payload }, { call }) {
      try {
        return yield call(updateDeptManager, payload);
      } catch (e) {
        return message.error(e.data?.message || 'Failed to update');
      }
    },
    *deleteDept({ payload }, { call, put, select }) {
      try {
        yield call(deleteDept, payload);
        const [{ defaultOrgId }] = yield select(accountSelector);
        if (!defaultOrgId) {
          return Promise.reject('Please select company firstly');
        }
        return yield put({
          type: 'requestDepts',
        });
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to delete');
      }
    },
    *requestMembers({ payload }, { call, put, select }) {
      try {
        const [{ defaultOrgId }] = yield select(accountSelector);
        let res;
        if (defaultOrgId === payload.deptId) {
          res = yield call(getOrgMembers, {
            id: defaultOrgId,
            start: MEMBERS_DEFAULT_PAGE_STARTAT,
            length: MEMBERS_DEFAULT_PAGE_SIZE,
            ...payload,
          });
        } else {
          res = yield call(getDeptMembers, {
            id: payload.deptId,
            start: MEMBERS_DEFAULT_PAGE_STARTAT,
            length: MEMBERS_DEFAULT_PAGE_SIZE,
            ...payload,
          });
        }
        yield put({ type: 'updateMembers', payload: res.members });
        return res;
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to get list');
      }
    },
    *getDeptMembers({ payload }, { call }) {
      try {
        return yield call(getDeptMembers, {
          start: MEMBERS_DEFAULT_PAGE_STARTAT,
          length: MEMBERS_DEFAULT_PAGE_SIZE,
          ...payload,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *requestMemberInfo({ payload }, { call }) {
      try {
        const memberInfo: MemberInfoDto = yield call(getMemberInfo, payload);
        return memberInfo;
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to get member info.');
      }
    },
    *inviteMember({ payload }, { call, select }) {
      try {
        const [{ defaultOrgId, userId }] = yield select(accountSelector);
        const res = yield call(inviteMember, {
          ...payload,
          userId,
          orgId: defaultOrgId,
        });
        return res;
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to invite member');
      }
    },
    *inviteMemberAgain({ payload }, { call }) {
      try {
        return yield call(inviteMemberAgain, payload);
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to invite member');
      }
    },
    *updateMember({ payload }, { call, select }) {
      try {
        const [{ userId }] = yield select(accountSelector);
        return yield call(updateMember, {
          ...payload,
          userId,
        });
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to update member');
      }
    },
    *deleteMembers({ payload }, { call, put }) {
      try {
        const res = yield call(deleteMembers, payload);
        yield put({
          type: 'requestMembers',
          payload: { deptId: payload.id },
        });
        return res;
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to delete member');
      }
    },
    *adjustDept({ payload }, { call, select }) {
      try {
        const [{ userId }] = yield select(accountSelector);
        return yield call(adjustDept, { ...payload, userId });
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to adjust department');
      }
    },
    *acceptInvitation({ payload }, { call }) {
      try {
        return yield call(acceptInvitation, payload);
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to accept invitation');
      }
    },
    *submitDissolutionSurvey({ payload }, { call, select }) {
      try {
        const [{ userId }] = yield select(accountSelector);
        yield call(submitDissolutionSurvey, {
          ...payload,
          currentUserId: userId,
        });
        return Promise.resolve();
      } catch (e) {
        message.error('Failed to submit the survey');
        return Promise.reject();
      }
    },
    *getDeptTree({ payload }, { call }) {
      try {
        return yield call(getDeptTree, payload);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
};

export default model;
