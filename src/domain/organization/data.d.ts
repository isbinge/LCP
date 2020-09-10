export interface Department {
  id: string;
  parentId?: string;
  name: string;
  hasChild?: boolean;
  unitId?: string;
  childrens?: Department[];
}

export interface Member {
  id: string;
  userId?: string;
  mobile?: string;
  email?: string;
  name?: string;
  parentName?: string;
  parentId?: string;
  parentNames?: string;
  parentIds?: string;
  roleIds?: string[];
  roleNames?: string;
  isAcceptInvited?: boolean;
  isManager?: boolean;
}
export interface MemberInfoDto {
  id: string;
  name: string;
  userId: string;
  email: string;
  companyId: string;
  isAcceptInvited: boolean;
  departmentIds: string;
  departmentNames: string;
  roleIds: string;
  roleNames: string;
  //
  gender: unknown;
  mobile: string;
}
export interface OrganizationDto {
  companyId: string;
  companyName: string;
  memberId: string;
}

export interface GetOrgDto {
  companyName: string;
  address: string;
  tel: string;
  email: string;
}

export interface OrgCollection {
  id: string;
  name?: string;
  childrens?: OrgCollection[];
}

export interface CreateOrgPayload {
  id: string;
  address: string;
  companyName: string;
  email: string;
  tel: string;
  currentUserId: string;
}

export interface DeptTreeDto {
  fullDeptInfo: Department;
  deptIds: string[];
}
