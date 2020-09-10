import httpRequest from '@/utils/http-request';
import { API } from '@/config';
import FormRecordData from './data';

export async function getFormToFillin(payload: { templateId: string; formCode: string }) {
  return httpRequest({
    api: API.formRecord.GET_FORM_TO_FILLIN,
    pathParams: {
      formTemplateCode: payload.formCode,
    },
    params: {
      formTemplateId: payload.templateId,
    },
  });
}

export async function submitForm(payload: { data: unknown }) {
  return httpRequest({
    api: API.formRecord.SUBMIT_FORM,
    data: payload.data,
  });
}

export async function getFormToExamine(payload: {
  templateId: string;
  formCode: string;
  objectId: string;
}) {
  return httpRequest({
    api: API.formRecord.GET_FORM_TO_EXAMINE,
    pathParams: {
      formTemplateCode: payload.formCode,
      objectId: payload.objectId,
    },
    params: {
      formTemplateId: payload.templateId,
    },
  });
}

export async function getFormToUpdate(payload: {
  templateId: string;
  formCode: string;
  objectId: string;
}) {
  return httpRequest({
    api: API.formRecord.GET_FORM_TO_UPDATE,
    pathParams: {
      formTemplateCode: payload.formCode,
      objectId: payload.objectId,
    },
    params: {
      formTemplateId: payload.templateId,
    },
  });
}
export async function updateFormRecord(payload: { data: unknown; objectId: string }) {
  return httpRequest({
    api: API.formRecord.UPDATE_FORM_RECORD,
    pathParams: {
      objectId: payload.objectId,
    },
    data: payload.data,
  });
}

export async function deleteFormRecord(payload: { objectId: string }) {
  return httpRequest({
    api: API.formRecord.DELETE_FORM_RECORD,
    pathParams: {
      objectId: payload.objectId,
    },
  });
}
// 临时保存
export async function saveFormAsDraft(payload: { data: unknown }) {
  return httpRequest({
    api: API.formRecord.SAVE_FORM_AS_DRAFT,
    data: payload.data,
  });
}
// 更新临时保存表单
export async function updateFormDraft(payload: { data: unknown; objectId: string }) {
  return httpRequest({
    api: API.formRecord.UPDATE_FORM_DRAFT,
    pathParams: {
      objectId: payload.objectId,
    },
    data: payload.data,
  });
}
export async function getColHeaders(payload: { formTemplateId: string }) {
  return httpRequest({
    api: API.formRecord.GET_HEADERS,
    params: payload,
  });
}

export async function getFormList(payload: { data: FormRecordData.GetFormDataListPayload }) {
  return httpRequest({
    api: API.formRecord.GET_LIST,
    data: payload.data,
  });
}

/**
 *  获取下拉框数据源
 * @param formCode formTeplateCode 模板名
 * @param fieldName 字段 F00001
 * @param currentPage 当前页
 * @param pageSize 一页几条
 * @param filterValue 过滤值
 */
export async function getSelectSource(payload: {
  formCode: string;
  fieldName: string;
  currentPage: number;
  pageSize: number;
  filterValue: string;
}) {
  return httpRequest({
    api: API.formRecord.GET_SELECT_SOURCE,
    pathParams: {
      formTemplateCode: payload.formCode,
    },
    params: {
      propertyName: payload.fieldName,
      currentPage: payload.currentPage,
      pageSize: payload.pageSize,
      filterValue: payload.filterValue,
    },
  });
}

// 获取数据联动-默认值
export async function getDataLinkSource(payload: FormRecordData.GetDataLinkSourcePayload) {
  return httpRequest({
    api: API.formRecord.GET_DATALINK_SOURCE,
    pathParams: {
      formTemplateCode: payload.formCode,
    },
    data: payload.filter,
  });
}

// 获取关联表单数据列表
export async function getAssocFormDataList(payload: {
  formCode: string;
  currentPage: number;
  pageSize: number;
}) {
  return httpRequest({
    api: API.formRecord.GET_ASSOC_FORM_DATA,
    pathParams: {
      formTemplateCode: payload.formCode,
    },
    params: {
      currentPage: payload.currentPage,
      pageSize: payload.pageSize,
    },
  });
}

// 获取关联属性
export async function getAssocProperty(payload: { formCode: string; id: string }) {
  return httpRequest({
    api: API.formRecord.GET_ASSOC_PROPERTY,
    pathParams: {
      formTemplateCode: payload.formCode,
      objectId: payload.id,
    },
  });
}

/**
 * FormRecords 筛选条件
 * @param payload {id 模板id}
 */
export async function getQueryItems(payload: { formTemplateId: string }) {
  return httpRequest({
    api: API.formRecord.GET_QUERY_ITEMS,
    params: payload,
  });
}

/**
 * 批量删除
 *
 * @param {{ ids: string[] }} payload
 * @returns
 */
export async function massDeleteFormRecord(payload: { ids: string[] }) {
  return httpRequest({
    api: API.formRecord.DELETE_FORM_RECORD_BULK,
    data: payload.ids,
  });
}
