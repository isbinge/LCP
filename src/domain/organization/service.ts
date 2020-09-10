import { v1 as uuidv1 } from 'uuid';

import httpRequest from '@/utils/http-request';
import { API } from '@/config';
import { CreateOrgPayload } from './data.d';

export async function createOrg(payload: CreateOrgPayload) {
  return httpRequest({
    api: API.organization.CREATE,
    data: payload,
  });
}
export async function deleteOrg(payload: { companyId: string }) {
  return httpRequest({
    api: API.organization.DELETE,
    pathParams: {
      orgId: payload.companyId,
    },
  });
}

export async function getOrg(payload: { orgId: string }) {
  return httpRequest({
    api: API.organization.GET,
    pathParams: {
      orgId: payload.orgId,
    },
  });
}

export async function getOrgs(payload: { userId: string }) {
  return httpRequest({
    api: API.account.GET_JOINED_ORGS,
    pathParams: {
      id: payload.userId,
    },
  });
}

export async function getDepts(payload: { orgId: string }) {
  return httpRequest({
    api: API.department.GET_DEPARTMENTS,
    pathParams: {
      id: payload.orgId,
    },
  });
}

export async function createDept(payload: {
  orgId: string;
  parentId: string;
  deptName: string;
  userId: string;
  id: string;
}) {
  return httpRequest({
    api: API.department.CREATE,
    data: {
      ParentId: payload.parentId,
      Name: payload.deptName,
      CompanyId: payload.orgId,
      CurrentUserId: payload.userId,
      Id: payload.id,
    },
  });
}

export async function updateDept(payload: { deptId: string; userId: string; deptName: string }) {
  return httpRequest({
    api: API.department.UPDATE,
    pathParams: {
      id: payload.deptId,
    },
    data: {
      UpdateUserId: payload.userId,
      Name: payload.deptName,
    },
  });
}

export async function deleteDept(payload: { deptId: string }) {
  return httpRequest({
    api: API.department.DELETE,
    pathParams: {
      id: payload.deptId,
    },
  });
}

export async function updateDeptManager(payload: {
  id: string;
  userId: string;
  members: [{ MemberId: string; isManager: boolean }];
}) {
  return httpRequest({
    api: API.department.UPDATE_MANAGER,
    pathParams: { id: payload.id },
    data: { Members: payload.members, CurrentUserId: payload.userId },
  });
}

export async function getOrgMembers(payload: { id: string; length: number; start: number }) {
  const { id, length, start } = { ...payload };
  return httpRequest({
    api: API.member.GET_ORG_MEMBERS,
    pathParams: { id },
    params: { length, start },
    ttl: 1,
  });
}

export async function getDeptMembers(payload: { id: string; length: number; start: number }) {
  const { id, length, start } = { ...payload };
  return httpRequest({
    api: API.member.GET_DEPT_MEMBERS,
    pathParams: { id },
    params: { length, start },
    ttl: 1,
  });
}

export async function getMemberInfo(payload: { id: string }) {
  return httpRequest({
    api: API.member.INFO,
    pathParams: { id: payload.id },
    ttl: 1,
  });
}

export async function inviteMemberAgain(payload: { memberIds: string[] }) {
  return httpRequest({
    api: API.member.INVITE_AGAIN,
    data: payload.memberIds,
  });
}
export async function inviteMember(payload: {
  orgId: string;
  // name: number;
  email: string;
  // mobile: string;
  deptIds?: string[];
  userId: string;
}) {
  const { orgId, email, deptIds, userId } = { ...payload };
  return httpRequest({
    api: API.member.INVITE,
    data: {
      id: uuidv1(),
      companyId: orgId,
      Email: email,
      // Mobile: mobile,
      UnitIds: deptIds,
      // Name: name,
      CurrentUserId: userId,
    },
  });
}
export async function acceptInvitation(payload: { token: string; email: string }) {
  return httpRequest({
    api: API.member.ACCEPT_INVITATION,
    params: payload,
  });
}

export async function updateMember(payload: {
  id: string;
  deptIds: string[];
  roleIds: string[];
  // mobile: string;
  email: string;
  // name: string;
  userId: string;
}) {
  const { id, deptIds, roleIds, email, userId } = { ...payload };
  return httpRequest({
    api: API.member.UPDATE,
    pathParams: { id },
    data: {
      Departments: deptIds,
      Roles: roleIds,
      // Mobile: mobile,
      Email: email,
      // Name: name,
      CurrentUserId: userId,
    },
    ttl: 1,
  });
}

export async function deleteMembers(payload: { ids: string[] }) {
  return httpRequest({
    api: API.member.DELETE,
    data: payload.ids,
  });
}

export async function adjustDept(payload: {
  memberIds: string[];
  deptIds: string[];
  userId: string;
}) {
  return httpRequest({
    api: API.member.ADJUST,
    data: { memberIds: payload.memberIds, UnitIds: payload.deptIds, CurrentUserId: payload.userId },
  });
}

export async function switchOrg(payload: { userId: string; companyId: string }) {
  return httpRequest({
    api: API.account.SWITCH_ORG,
    data: { companyId: payload.companyId },
    pathParams: {
      id: payload.userId,
    },
  });
}

export async function resetToNoOrg(payload: { userId: string }) {
  return httpRequest({
    api: API.account.RESET_TO_NO_ORG,
    pathParams: {
      id: payload.userId,
    },
  });
}

export async function submitDissolutionSurvey(payload: {
  remarks: string;
  dissolveReasonMessage: string;
  currentUserId: string;
}) {
  return httpRequest({
    api: API.organization.DISSOLVE_ORG_SURVEY,
    data: payload,
  });
}

export async function getDeptTree(payload: { memberIds: string[]; deptIds: string[] }) {
  return httpRequest({
    api: API.department.DEPTS_TREE,
    data: payload,
  });
}
