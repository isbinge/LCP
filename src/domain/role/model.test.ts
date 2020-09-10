import { effects } from 'dva/saga';
import roleModel, { INITIAL_STATE, accountSelector, roleSelector } from './model';
import {
  getRoles,
  createRole,
  deleteRole,
  updateRole,
  getRoleMembers,
  getSubAdminRoles,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  updateRoleMembers,
  deleteRoleMember,
  getAppAccessControlList,
  updateFormAccessControlList,
  getFormAccessControlList,
} from './service';

const { namespace, reducers, effects: modelEffects } = roleModel;
const { call, put, select } = effects;

const dummyRoleGroup = [
  {
    groupName: 'group',
    groupId: 'group-id',
    children: [],
  },
];
describe('Model/Role', () => {
  it('has right namespace', () => {
    expect(namespace).toBe('role');
  });
  describe('reducer', () => {
    const testState = INITIAL_STATE;
    it('should updateRoleGroups work', () => {
      expect(
        reducers.updateRoleGroups(testState, { payload: { roleGroups: dummyRoleGroup } }),
      ).toEqual({
        ...testState,
        roleGroups: dummyRoleGroup,
      });
    });
    it('should updateAppAccessList work', () => {
      expect(
        reducers.updateAppAccessList(testState, {
          payload: { appAccessList: [] },
        }),
      ).toEqual({
        ...testState,
        appAccessList: [],
      });
    });
    it('should updateSelectedAppId work', () => {
      expect(reducers.updateSelectedAppId(testState, { payload: { selectedAppId: '1' } })).toEqual({
        ...testState,
        selectedAppId: '1',
      });
    });
    it('should updateAccessControlList work', () => {
      expect(
        reducers.updateAccessControlList(testState, {
          payload: { accessControlList: { appId: '1', aclChildren: [] } },
        }),
      ).toEqual({
        ...testState,
        accessControlList: { appId: '1', aclChildren: [] },
      });
    });
  });

  describe('sagas', () => {
    it('should getRoles work', () => {
      const generator = modelEffects.getRoles(
        { type: 'role/getRoles', payload: null },
        { call, put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(select(accountSelector));
      next = generator.next({ defaultOrgId: 'id1' });
      expect(next.value).toEqual(call(getRoles, { id: 'id1' }));

      next = generator.next(dummyRoleGroup);
      expect(next.value).toEqual(
        put({
          type: 'updateRoleGroups',
          payload: { roleGroups: dummyRoleGroup },
        }),
      );
    });

    it('should createRole work', () => {
      const generator = modelEffects.createRole(
        { type: 'role/createRole', payload: { companyId: null } },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(createRole, { companyId: null }));

      next = generator.next();
      expect(next.value).toEqual(
        put({
          type: 'getRoles',
          payload: { id: null },
        }),
      );
    });

    it('should deleteRole work', () => {
      const generator = modelEffects.deleteRole(
        { type: 'role/deleteRole', payload: { id: null, companyId: null } },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(deleteRole, { id: null }));

      next = generator.next();
      expect(next.value).toEqual(
        put({
          type: 'getRoles',
          payload: { id: null },
        }),
      );
    });

    it('should updateRole work', () => {
      const dummyData = {
        id: null,
        name: null,
        currentUserId: null,
        companyId: null,
      };
      const generator = modelEffects.updateRole(
        { type: 'role/updateRole', payload: dummyData },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(
        call(updateRole, {
          id: null,
          name: null,
          currentUserId: null,
        }),
      );
      next = generator.next();
      expect(next.value).toEqual(
        put({
          type: 'getRoles',
          payload: { id: null },
        }),
      );
    });

    it('should getRoleMembers work', () => {
      const generator = modelEffects.getRoleMembers(
        { type: 'role/getRoleMembers', payload: null },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getRoleMembers, null));
    });

    it('should updateRoleMembers work', () => {
      const generator = modelEffects.updateRoleMembers(
        { type: 'role/updateRoleMembers', payload: { id: 'testId' } },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(updateRoleMembers, { id: 'testId' }));
      next = generator.next();
      expect(next.value).toEqual(
        put({
          type: 'getRoleMembers',
          payload: {
            id: 'testId',
            start: 0,
            length: 0,
          },
        }),
      );
    });
    it('should delete role member work', () => {
      const generator = modelEffects.deleteRoleMember(
        { type: 'role/deleteRoleMember', payload: { id: 'id1' } },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(deleteRoleMember, { id: 'id1' }));
      next = generator.next();
      expect(next.value).toEqual(
        put({
          type: 'getRoleMembers',
          payload: { id: 'id1', start: 0, length: 0 },
        }),
      );
    });

    it('should getSubAdminRoles work', () => {
      const generator = modelEffects.getSubAdminRoles(
        { type: 'role/getSubAdminRoles', payload: null },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getSubAdminRoles, null));
    });

    it('should createSubAdmin work', () => {
      const generator = modelEffects.createSubAdmin(
        { type: 'role/createSubAdmin', payload: null },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(createSubAdmin, null));
    });

    it('should updateSubAdmin work', () => {
      const generator = modelEffects.updateSubAdmin(
        { type: 'role/updateSubAdmin', payload: null },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(updateSubAdmin, null));
    });

    it('should deleteSubAdmin work', () => {
      const generator = modelEffects.deleteSubAdmin(
        { type: 'role/deleteSubAdmin', payload: null },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(deleteSubAdmin, null));
    });

    it('should getAppAccessControlList work', () => {
      const generator = modelEffects.getAppAccessControlList(
        { type: 'role/getAppAccessControlList', payload: null },
        { call, put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(select(accountSelector));
      next = generator.next({ defaultOrgId: 'id1' });
      expect(next.value).toEqual(call(getAppAccessControlList, { orgId: 'id1' }));
      next = generator.next(null);
      expect(next.value).toEqual(
        put({ type: 'updateAppAccessList', payload: { appAccessList: null } }),
      );
    });
    it('should getFormAccessControlList work', () => {
      const generator = modelEffects.getFormAccessControlList(
        { type: 'role/getFormAccessControlList', payload: null },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getFormAccessControlList, null));
      next = generator.next(null);
      expect(next.value).toEqual(
        put({ type: 'updateAccessControlList', payload: { accessControlList: null } }),
      );
    });
    it('should updateFormAccessControlList work', () => {
      const generator = modelEffects.updateFormAccessControlList(
        { type: 'role/updateFormAccessControlList', payload: { roleId: 'id3' } },
        { call, put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(select(accountSelector));
      next = generator.next({ userId: 'id1' });
      expect(next.value).toEqual(select(roleSelector));
      next = generator.next({ accessControlList: { appId: 'id2', aclChildren: [] } });
      expect(next.value).toEqual(
        call(updateFormAccessControlList, {
          roleId: 'id3',
          accessConfigData: {
            currentUserId: 'id1',
            appId: 'id2',
            formAcls: [],
          },
        }),
      );
      next = generator.next(null);
      expect(next.value).toEqual(
        put({ type: 'getFormAccessControlList', payload: { appId: 'id2', roleId: 'id3' } }),
      );
    });
  });
});
