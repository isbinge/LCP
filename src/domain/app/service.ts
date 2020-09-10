import httpRequest from '@/utils/http-request';
import { API } from '@/config/api';
import { CreateAppPayload, UpdateAppPayload, GetAppDto } from './data.d';

export async function getApp(payload: { appId: string }) {
  return httpRequest<GetAppDto>({
    api: API.app.GET,
    pathParams: {
      appId: payload.appId,
    },
  });
}

export async function getAppList(payload: { orgId: string }) {
  return httpRequest({
    api: API.organization.APP_LIST,
    pathParams: {
      orgId: payload.orgId,
    },
    ttl: 3000,
  });
}

export async function createApp(payload: CreateAppPayload) {
  return httpRequest({
    api: API.app.CREATE,
    data: payload,
  });
}

export async function getFormTplList(payload: { appId: string }) {
  return httpRequest({
    api: API.app.GET_FORMTPL_LIST,
    pathParams: {
      appId: payload.appId,
    },
  });
}

export async function updateApp(payload: { data: UpdateAppPayload; appId: string }) {
  return httpRequest({
    api: API.app.UPDATE,
    data: payload.data,
    pathParams: {
      appId: payload.appId,
    },
  });
}

export async function deleteApp(payload: { appId: string }) {
  return httpRequest({
    api: API.app.DELETE,
    pathParams: {
      appId: payload.appId,
    },
  });
}
