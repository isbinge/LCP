import httpRequest from '@/utils/http-request';
import { API } from '@/config';
import ListDesignData from './data';

export async function getFormRecordSettings(payload: ListDesignData.GetFormRecordSettingsPayload) {
  return httpRequest<ListDesignData.GetListSettingDto>({
    api: API.formTemplate.GET_RECORD_LIST_SETTINGS,
    pathParams: {
      formTplId: payload.formTplId,
    },
  });
}

export async function updateFormRecordSettings(payload: {
  formTplId: string;
  data: Partial<ListDesignData.UpdateListSettingDto>;
}) {
  return httpRequest({
    api: API.formTemplate.UPDATE_RECORD_LIST_SETTINGS,
    pathParams: {
      formTplId: payload.formTplId,
    },
    data: payload.data,
  });
}
