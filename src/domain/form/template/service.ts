import httpRequest from '@/utils/http-request';
import { API } from '@/config';

export async function createFormTpl(payload: { data: unknown }) {
  return httpRequest({
    api: API.formTemplate.CREATE,
    data: payload.data,
  });
}
export async function getFormTpl(payload: { templateId: string }) {
  return httpRequest({
    api: API.formTemplate.GET,
    pathParams: { formId: payload.templateId },
  });
}

export async function updateFormTpl(payload: { data: unknown; templateId: string }) {
  return httpRequest({
    api: API.formTemplate.UPDATE,
    data: payload.data,
    pathParams: { formId: payload.templateId },
  });
}

export async function deleteFormTpl(payload: { formId: string }) {
  return httpRequest({
    api: API.formTemplate.DELETE,
    pathParams: { formId: payload.formId },
  });
}

export async function getControlCode(payload: {
  formTemplateId: string;
  subFormTemplateId: Nullable<string>;
}) {
  return httpRequest({
    api: API.formTemplate.CONTROL_CODE,
    data: payload,
    timeout: 1000,
  });
}

export async function getAssocForms(payload: { companyId: string }) {
  return httpRequest({
    api: API.organization.ASSOC_FORMS,
    pathParams: {
      orgId: payload.companyId,
    },
  });
}

export async function getLinkForms(payload: { companyId: string }) {
  return httpRequest({
    api: API.organization.LINK_FORMS,
    pathParams: {
      orgId: payload.companyId,
    },
  });
}

export async function getDbFields(payload: { formCode: string }) {
  return httpRequest({
    api: API.formTemplate.DB_FIELDS,
    pathParams: {
      formCode: payload.formCode,
    },
  });
}

export async function updateFormTplName(payload: {
  formTplId: string;
  name: string;
  iconCss: string;
  currentUserId: string;
}) {
  return httpRequest({
    api: API.formTemplate.UPDATE_FORM_NAME,
    pathParams: {
      formTplId: payload.formTplId,
    },
    data: {
      name: payload.name,
      iconCss: payload.iconCss,
      currentUserId: payload.currentUserId,
    },
  });
}
