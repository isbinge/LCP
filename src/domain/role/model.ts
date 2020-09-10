import { message } from 'antd';
import {
  getRoles,
  createRole,
  deleteRole,
  updateRole,
  getRoleMembers,
  updateRoleMembers,
  getSubAdminRoles,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  deleteRoleMember,
  getAppAccessControlList,
  getFormAccessControlList,
  updateFormAccessControlList,
} from './service';
import {
  RoleGroupDto,
  AppAccessDto,
  FormTemplateAccessState,
  AppAccessControlItem,
} from './data.d';
import { SelectState } from '../select';

export const accountSelector = ({ account }: SelectState) => account;

export const roleSelector = ({ role }: SelectState) => role;
export interface RoleState {
  roleGroups: RoleGroupDto[];
  appAccessList: AppAccessDto[];
  accessControlList: Nullable<FormTemplateAccessState>;
  selectedAppId: Nullable<string>;
}

export const INITIAL_STATE: RoleState = {
  roleGroups: [],
  appAccessList: [],
  accessControlList: null,
  selectedAppId: null,
};

const model: Dva.ModelType<RoleState> = {
  namespace: 'role',
  state: INITIAL_STATE,
  reducers: {
    updateRoleGroups(state, { payload: { roleGroups } }) {
      return {
        ...state,
        roleGroups,
      };
    },
    updateAppAccessList(state, { payload: { appAccessList } }) {
      return {
        ...state,
        appAccessList,
      };
    },
    updateSelectedAppId(state, { payload: { selectedAppId } }) {
      return {
        ...state,
        selectedAppId,
      };
    },
    updateAccessControlList(state, { payload: { accessControlList } }) {
      return {
        ...state,
        accessControlList,
      };
    },
  },
  effects: {
    *getRoles(_, { call, put, select }) {
      try {
        const { defaultOrgId } = yield select(accountSelector);
        const res = yield call(getRoles, { id: defaultOrgId });
        yield put({
          type: 'updateRoleGroups',
          payload: { roleGroups: res },
        });
        return res;
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to get roles');
      }
    },
    *createRole({ payload }, { call, put }) {
      try {
        yield call(createRole, payload);
        yield put({
          type: 'getRoles',
          payload: { id: payload.companyId },
        });
      } catch (e) {
        message.error(e.data?.message || 'Failed to delete role');
        // Promise.reject(e.data?.message || 'Failed to create role');
      }
    },
    *deleteRole({ payload }, { call, put }) {
      try {
        yield call(deleteRole, { id: payload.id });
        return yield put({
          type: 'getRoles',
          payload: { id: payload.companyId },
        });
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to delete role');
      }
    },
    *updateRole({ payload }, { call, put }) {
      try {
        yield call(updateRole, {
          id: payload.id,
          name: payload.name,
          currentUserId: payload.currentUserId,
        });
        yield put({
          type: 'getRoles',
          payload: { id: payload.companyId },
        });
      } catch (e) {
        Promise.reject(e);
      }
    },
    *getRoleMembers({ payload }, { call }) {
      try {
        return yield call(getRoleMembers, payload);
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to get role members');
      }
    },
    *updateRoleMembers({ payload }, { call, put }) {
      try {
        yield call(updateRoleMembers, payload);
        return yield put({
          type: 'getRoleMembers',
          payload: { id: payload.id, start: 0, length: 0 },
        });
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to update role members');
      }
    },
    *deleteRoleMember({ payload }, { call, put }) {
      try {
        yield call(deleteRoleMember, payload);
        return yield put({
          type: 'getRoleMembers',
          payload: { id: payload.id, start: 0, length: 0 },
        });
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to delete role member');
      }
    },
    *getSubAdminRoles({ payload }, { call }) {
      try {
        return yield call(getSubAdminRoles, payload);
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to get subAdmin roles');
      }
    },
    *createSubAdmin({ payload }, { call }) {
      try {
        return yield call(createSubAdmin, payload);
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to create subAdmin');
      }
    },
    *updateSubAdmin({ payload }, { call }) {
      try {
        return yield call(updateSubAdmin, payload);
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to update subAdmin');
      }
    },
    *deleteSubAdmin({ payload }, { call }) {
      try {
        return yield call(deleteSubAdmin, payload);
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to delete subAdmin');
      }
    },
    // 所有用户
    *getAppAccessControlList({ payload }, { call, put, select }) {
      try {
        const { defaultOrgId } = yield select(accountSelector);
        const appAccessList = yield call(getAppAccessControlList, {
          ...payload,
          orgId: defaultOrgId,
        });
        yield put({ type: 'updateAppAccessList', payload: { appAccessList } });
        return appAccessList;
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to get app access control list');
      }
    },
    *getFormAccessControlList({ payload }, { call, put }) {
      try {
        const accessControlList = yield call(getFormAccessControlList, payload);
        yield put({ type: 'updateAccessControlList', payload: { accessControlList } });
        return accessControlList;
      } catch (e) {
        return Promise.reject(e.data?.message || 'Failed to get form access control list');
      }
    },
    *updateFormAccessControlList({ payload }, { call, put, select }) {
      try {
        const { userId } = yield select(accountSelector);
        const { accessControlList } = yield select(roleSelector);
        const accessConfigData = {
          currentUserId: userId,
          appId: accessControlList.appId,
          formAcls: accessControlList.aclChildren.map((aclItem: AppAccessControlItem) => ({
            formTemplateId: aclItem.formTemplateId,
            aclNode: aclItem.aclRoleNode,
          })),
        };
        const res = yield call(updateFormAccessControlList, { ...payload, accessConfigData });
        yield put({
          type: 'getFormAccessControlList',
          payload: { appId: accessControlList.appId, roleId: payload.roleId },
        });
        yield put({
          type: 'getAppAccessControlList',
          payload: { roleId: payload.roleId },
        });
        return res;
      } catch (e) {
        return message.error(e.data?.message || 'Failed to save form access control list');
      }
    },
  },
};

export default model;
