interface Base {
  id: string;
  name: string;
  code: string;
  iconCss: string;
}

export interface GetAppDto {
  auditStat: number;
  companyId: string;
  createDateTime: string;
  createUserId: string;
  description: string;
  updateDateTime: string;
  updateUserId: string;
  id: string;
  name: string;
  iconCss: string;
}

export interface AppListItem extends Base {}

export type AppList = AppListItem[];
export interface FormTplListItem extends Base {
  code: string;
}

export type FormTplList = Base[];

export interface CreateAppPayload extends Base {
  companyId: string;
  currentUserId: string;
}

export interface UpdateAppPayload {
  name: string;
  iconCss: string;
  currentUserId: string;
}
