import { AppDataAccess } from './common';

/**
 * 0 系统管理员
 * 1 所有用户
 * 2 子管理员
 * 3 自定义角色
 */
export enum RoleType {
  SystemAdmin,
  Users,
  SubAdmin,
  Customize,
}
export interface RoleDto {
  roleName: string;
  roleId: string;
  groupName: string;
  roleType: RoleType;
}

export interface RoleGroupDto {
  groupName: string;
  groupId: string;
  children: RoleDto[];
}

export interface RoleMember {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  parentNames: string;
  email: string;
  profilePhotoUrl: string;
}

interface GetRoleMembersReturn {
  total: number;
  members: RoleMember[];
}

export interface GetSubAdminReturn {
  roleId: string;
  subAdminRoleId: string;
  remarks: string;
  memberNames: string;
  memberIds: string;
  appNames: string;
  appIds: string;
}

/**
 * 所有用户数据类型
 *
 */
export interface BasicAccessControlItem {
  code: string;
  name: string;
  hasAcl: boolean;
}

interface FormAccessControlItem {
  formActions: BasicAccessControlItem[];
  formActionsAllChecked: boolean;
}
interface ListAccessControlItem {
  listViewActions: BasicAccessControlItem[];
  listActionsAllChecked: boolean;
}
export interface AppAccessControlItem {
  name: string;
  hasAcl: boolean;
  code: string;
  formTemplateId: string;
  aclRoleNode: FormAccessControlItem & ListAccessControlItem & { scopeType: AppDataAccess };
}

export interface AppAccessDto {
  appId: string;
  name: string;
  hasAcl: boolean;
}

export interface AccessControlListDto {
  appId: string;
  aclChildren: AppAccessControlItem[];
}

export type FormTemplateAccessState = AccessControlListDto & { edited: boolean };
