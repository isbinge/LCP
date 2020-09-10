import httpRequest from '@/utils/http-request';
import { API } from '@/config';

interface UpdateRolePayload {
  id: string;
  name: string;
  currentUserId: string;
}

interface CreateRolePayload extends UpdateRolePayload {
  companyId: string;
}

interface GetRoleMembersPayload {
  id: string;
  start: number;
  length: number;
}

interface UpdateRoleMembersPayload {
  id: string;
  currentUserId: string;
  memberIds: string[];
}

type SubAdminBase = {
  id: string;
  currentUserId: string;
  subAdminRoleId: string;
  remarks: string;
  userIds: string[];
  appIds: string[];
};
type CreateSubAdminPayload = SubAdminBase;

type UpdateSubAdminPayload = SubAdminBase;

// interface UpdateSubAdminPayload extends SubAdminBase {
//   subAdminRoleId: string;
// }
export async function getRoles(payload: { id: string }) {
  return httpRequest({
    api: API.role.GET_ROLES,
    pathParams: payload,
  });
}

export async function createRole(payload: CreateRolePayload) {
  return httpRequest({
    api: API.role.GREAT,
    data: payload,
  });
}

export async function deleteRole(payload: { id: string }) {
  return httpRequest({
    api: API.role.DELETE,
    pathParams: payload,
  });
}

export async function updateRole(payload: UpdateRolePayload) {
  return httpRequest({
    api: API.role.UPDATE,
    pathParams: { id: payload.id },
    data: {
      name: payload.name,
      currentUserId: payload.currentUserId,
    },
  });
}

/**
 *
 * @param payload start为0， length为0 查询全部
 *
 */
export async function getRoleMembers(payload: GetRoleMembersPayload) {
  return httpRequest({
    api: API.role.GET_ROLE_MEMBERS,
    pathParams: { id: payload.id },
    data: {
      start: payload.start,
      length: payload.length,
    },
    ttl: 1,
  });
}

export async function deleteRoleMember(payload: {
  id: string;
  currentUserId: string;
  memberId: string;
}) {
  return httpRequest({
    api: API.role.DELETE_ROLE_MEMBER,
    pathParams: { id: payload.id },
    data: {
      currentUserId: payload.currentUserId,
      memberId: payload.memberId,
    },
  });
}

export async function updateRoleMembers(payload: UpdateRoleMembersPayload) {
  return httpRequest({
    api: API.role.UPDATE_ROLE_MEMBERS,
    pathParams: { id: payload.id },
    data: {
      currentUserId: payload.currentUserId,
      memberIds: payload.memberIds,
    },
  });
}
/** 查询子管理员 */
export async function getSubAdminRoles(payload: { id: string }) {
  return httpRequest({
    api: API.role.GET_SUBADMIN,
    pathParams: payload,
  });
}

/** 新增子管理员 */

export async function createSubAdmin(payload: CreateSubAdminPayload) {
  return httpRequest({
    api: API.role.CREATE_SUBADMIN,
    pathParams: { id: payload.id },
    data: {
      id: payload.subAdminRoleId,
      currentUserId: payload.currentUserId,
      remarks: payload.remarks,
      userIds: payload.userIds,
      appIds: payload.appIds,
    },
  });
}

/** 更新子管理员 */

export async function updateSubAdmin(payload: UpdateSubAdminPayload) {
  return httpRequest({
    api: API.role.UPDATE_SUBADMIN,
    pathParams: { id: payload.id, subAdminRoleId: payload.subAdminRoleId },
    data: {
      currentUserId: payload.currentUserId,
      remarks: payload.remarks,
      userIds: payload.userIds,
      appIds: payload.appIds,
    },
  });
}

/** 删除子管理员 */
export async function deleteSubAdmin(payload: { id: string; subAdminRoleId: string }) {
  return httpRequest({
    api: API.role.DELETE_SUBADMIN,
    pathParams: payload,
  });
}

/** 获取app访问权限列表 */
export async function getAppAccessControlList(payload: { roleId: string; orgId: string }) {
  return httpRequest({
    api: API.role.GET_APP_ACLS,
    pathParams: payload,
  });
}

export async function getFormAccessControlList(payload: { roleId: string; appId: string }) {
  return httpRequest({
    api: API.role.GET_FORM_ACLS,
    pathParams: payload,
  });
}

export async function updateFormAccessControlList(payload: {
  roleId: string;
  accessConfigData: unknown;
}) {
  return httpRequest({
    api: API.role.SAVE_FORM_ACLS,
    pathParams: { id: payload.roleId },
    data: payload.accessConfigData,
  });
}
