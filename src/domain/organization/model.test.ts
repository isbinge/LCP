import { effects } from 'dva/saga';
import OrganizationModel, { accountSelector } from './model';
import {
  updateDept,
  getDeptMembers,
  getMemberInfo,
  acceptInvitation,
  getOrgs,
  getDepts,
  createDept,
  deleteDept,
  inviteMember,
  inviteMemberAgain,
  updateMember,
  deleteMembers,
  adjustDept,
  createOrg,
  deleteOrg,
  getOrg,
  getDeptTree,
} from './service';

const { namespace, reducers, effects: modelEffects, state } = OrganizationModel;
const { call, put, select } = effects;

let initialState = {};

beforeEach(() => {
  initialState = { ...state };
});

describe('Model/Org', () => {
  it('has right namespace', () => {
    expect(namespace).toBe('organization');
  });
  describe('reducers', () => {
    it('should save Organization work', () => {
      expect(
        reducers.saveOrg(initialState, {
          payload: {
            currentOrgId: null,
            companyName: '船运教育培训信息科技有限公司',
          },
        }),
      ).toEqual({
        ...initialState,
        currentOrgId: null,
        orgName: '船运教育培训信息科技有限公司',
      });
    });
    it('should update orgs work', () => {
      expect(
        reducers.updateOrgs(initialState, {
          payload: {
            orgs: [{ companyName: 'sss', companyId: 'id' }],
          },
        }),
      ).toEqual({
        ...initialState,
        orgs: [{ companyName: 'sss', companyId: 'id' }],
      });
    });
    it('should update depts work', () => {
      expect(
        reducers.updateDepts(initialState, {
          payload: [
            { id: 'id', parentId: '', name: 'ss', hasChild: false, unitId: '', childrens: [] },
          ],
        }),
      ).toEqual({
        ...initialState,
        depts: [{ id: 'id', parentId: '', name: 'ss', hasChild: false, unitId: '', childrens: [] }],
      });
    });
    it('should update members work', () => {
      expect(
        reducers.updateMembers(initialState, {
          payload: [
            {
              id: 'id',
              mobile: '187',
              email: '1036',
              name: 'hu',
              parentName: '',
              parentId: '',
              parentNames: '',
              parentIds: '',
              roleIds: [],
              roleNames: '',
              isAcceptInvited: false,
              isManager: false,
            },
          ],
        }),
      ).toEqual({
        ...initialState,
        members: [
          {
            id: 'id',
            mobile: '187',
            email: '1036',
            name: 'hu',
            parentName: '',
            parentId: '',
            parentNames: '',
            parentIds: '',
            roleIds: [],
            roleNames: '',
            isAcceptInvited: false,
            isManager: false,
          },
        ],
      });
    });
  });
  describe('sagas', () => {
    it('should update dept work', () => {
      const generator = modelEffects.updateDept(
        {
          type: 'organization/updateDept',
          payload: {
            deptId: null,
            userId: null,
            deptName: '',
          },
        },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(
        call(updateDept, {
          deptId: null,
          userId: null,
          deptName: '',
        }),
      );
    });
    it('should update deptManager work', () => {
      const generator = modelEffects.updateDept(
        {
          type: 'organization/updateDeptManager',
          payload: {
            id: '',
            userId: null,
            members: [{ MemberId: '', isManager: false }],
          },
        },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(
        call(updateDept, {
          id: '',
          userId: null,
          members: [{ MemberId: '', isManager: false }],
        }),
      );
    });
    it('should get members work', () => {
      const generator = modelEffects.getDeptMembers(
        {
          type: 'organization/getDeptMembers',
          payload: {
            id: '',
            length: 0,
            start: 0,
          },
        },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(
        call(getDeptMembers, {
          id: '',
          length: 0,
          start: 0,
        }),
      );
    });
    it('should request memberInfo work', () => {
      const generator = modelEffects.requestMemberInfo(
        {
          type: 'organization/requestMemberInfo',
          payload: {
            id: 'foo',
          },
        },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(
        call(getMemberInfo, {
          id: 'foo',
        }),
      );
      expect(generator.throw({ data: { message: 'error' } }).value).toEqual(
        Promise.reject('error'),
      );
    });
    it('should accept invitation work', () => {
      const generator = modelEffects.acceptInvitation(
        {
          type: 'organization/acceptInvitation',
          payload: {
            token: 'id',
            email: '',
          },
        },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(
        call(acceptInvitation, {
          token: 'id',
          email: '',
        }),
      );
    });
  });
  it('should get org work', () => {
    const generator = modelEffects.getOrg(
      {
        type: 'organization/getOrg',
        payload: { orgId: 'foo' },
      },
      { call, put },
    );
    let next = generator.next();
    expect(next.value).toEqual('foo');
    next = generator.next('foo');
    expect(next.value).toEqual(
      call(getOrg, {
        orgId: 'foo',
      }),
    );
    next = generator.next({ currentOrgId: 'foo' });
    expect(next.value).toEqual(put({ type: 'saveOrg', payload: { currentOrgId: 'foo' } }));
    expect(generator.throw('error').value).toEqual(Promise.reject('error'));
  });
  it('should get orgs work', () => {
    const generator = modelEffects.getOrgs(
      {
        type: 'organization/getOrgs',
      },
      { call, put, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ userId: null }]);
    expect(next.value).toEqual(
      call(getOrgs, {
        userId: null,
      }),
    );
    next = generator.next([]);
    expect(next.value).toEqual(put({ type: 'updateOrgs', payload: { orgs: [] } }));
  });
  it('should request depts work', () => {
    const generator = modelEffects.requestDepts(
      {
        type: 'organization/requestDepts',
      },
      { call, put, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ defaultOrgId: 'id1' }]);
    expect(next.value).toEqual(
      call(getDepts, {
        orgId: 'id1',
      }),
    );
    next = generator.next([]);
    expect(next.value).toEqual(put({ type: 'updateDepts', payload: [] }));
  });
  it('should create dept', () => {
    const generator = modelEffects.createDept(
      {
        type: 'organization/createDept',
        payload: {
          id: '1',
          deptName: 'ss',
          parentId: null,
        },
      },
      { call, put, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ defaultOrgId: 'id1', userId: 'id2' }]);
    expect(next.value).toEqual(
      call(createDept, {
        id: '1',
        deptName: 'ss',
        parentId: null,
        orgId: 'id1',
        userId: 'id2',
      }),
    );
    next = generator.next();
    expect(next.value).toEqual(put({ type: 'requestDepts' }));
  });
  it('should delete dept work', () => {
    const generator = modelEffects.deleteDept(
      {
        type: 'organization/deleteDept',
        payload: {
          deptId: 'ss',
        },
      },
      { call, put, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(
      call(deleteDept, {
        deptId: 'ss',
      }),
    );
    next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ defaultOrgId: 'id1' }]);

    expect(next.value).toEqual(put({ type: 'requestDepts' }));
  });
  it('should request members work', () => {
    const generator = modelEffects.requestMembers(
      {
        type: 'organization/requestMembers',
        payload: { id: 'id2' },
      },
      { call, put, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ defaultOrgId: 'id1' }]);
    expect(next.value).toEqual(
      call(getDeptMembers, {
        id: 'id2',
        start: 0,
        length: 0,
      }),
    );
    next = generator.next({ members: [] });
    expect(next.value).toEqual(put({ type: 'updateMembers', payload: [] }));
  });
  it('should invite member work', () => {
    const generator = modelEffects.inviteMember(
      {
        type: 'organization/inviteMember',
        payload: {},
      },
      { call, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ defaultOrgId: 'id1', userId: 'id2' }]);
    expect(next.value).toEqual(
      call(inviteMember, {
        orgId: 'id1',
        userId: 'id2',
      }),
    );
  });
  it('should invite member again work', () => {
    const generator = modelEffects.inviteMemberAgain(
      {
        type: 'organization/inviteMemberAgain',
        payload: {},
      },
      { call },
    );
    const next = generator.next();
    expect(next.value).toEqual(call(inviteMemberAgain, {}));
  });
  it('should update member work', () => {
    const generator = modelEffects.updateMember(
      {
        type: 'organization/updateMember',
        payload: {},
      },
      { call, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ userId: 'id1' }]);
    expect(next.value).toEqual(
      call(updateMember, {
        userId: 'id1',
      }),
    );
  });
  it('should delete member work', () => {
    const generator = modelEffects.deleteMembers(
      {
        type: 'organization/deleteMembers',
        payload: { id: 'id1' },
      },
      { call, put },
    );
    let next = generator.next();
    expect(next.value).toEqual(call(deleteMembers, { id: 'id1' }));
    next = generator.next();
    expect(next.value).toEqual(put({ type: 'requestMembers', payload: { deptId: 'id1' } }));
  });
  it('should adjust dept work', () => {
    const generator = modelEffects.adjustDept(
      {
        type: 'organization/adjustDept',
        payload: {},
      },
      { call, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ userId: 'id1' }]);
    expect(next.value).toEqual(call(adjustDept, { userId: 'id1' }));
  });
  it('should create org work', () => {
    const generator = modelEffects.createOrg(
      {
        type: 'organization/createOrg',
      },
      { call, put, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ userId: 'foo' }]);
    expect(next.value).toEqual(
      call(createOrg, {
        address: 'example_address',
        email: 'example@example.com',
        tel: '00000000000',
        currentUserId: 'foo',
        id: 'mockUuid',
      }),
    );
  });
  it('should delete org work', () => {
    const generator = modelEffects.deleteOrg(
      {
        type: 'organization/deleteOrg',
        payload: {},
      },
      { call, put, select },
    );
    let next = generator.next();
    expect(next.value).toEqual(select(accountSelector));
    next = generator.next([{ defaultOrgId: 'foo', userId: 'bar' }]);
    expect(next.value).toEqual(call(deleteOrg, { companyId: 'foo' }));
    next = generator.next();
    expect(next.value).toEqual(call(getOrgs, { userId: 'bar' }));
    next = generator.next([{ companyId: 'qux' }]);
    expect(next.value).toEqual(
      put({ type: 'switchOrg', payload: { nextOrgId: 'qux', quiet: true } }),
    );
  });
  it('should delete org error', async () => {
    const generator = modelEffects.deleteOrg(
      {
        type: 'organization/deleteOrg',
        payload: {},
      },
      { call, put, select },
    );
    try {
      generator.throw({
        error: 'delete error',
      });
    } catch (e) {
      expect(e.error).toBe('delete error');
    }
  });
  it('should getDept work', () => {
    const generator = modelEffects.getDeptTree(
      { type: 'organization/getDeptTree', payload: null },
      { call },
    );
    const next = generator.next();
    expect(next.value).toEqual(call(getDeptTree, null));
  });
});
