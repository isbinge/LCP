import { effects } from 'dva/saga';
import FormInstanceModel from '../model';

import {
  getFormToUpdate,
  getColHeaders,
  getSelectSource,
  getDataLinkSource,
  getAssocFormDataList,
  getAssocProperty,
  submitForm,
  getFormToFillin,
  getFormToExamine,
  updateFormRecord,
  deleteFormRecord,
  saveFormAsDraft,
  updateFormDraft,
  getFormList,
  getQueryItems,
  massDeleteFormRecord,
} from '../service';
import FormRecordData from '../data';

const { namespace, effects: modelEffects } = FormInstanceModel;
const { call, put, all } = effects;

const dummyFormTplDto = {
  objectId: null,
  formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
  code: '8467risK5hf14fTUavqu',
  appId: '7de851c0-88ef-11ea-baf2-57befffa2225',
  name: '未命名的表单',
  dataTitle: 'F0000001',
  subFormTemplates: [],
  singleLineInputControls: [
    {
      subFormTemplateId: null,
      displayRule: '',
      defaultValueRuleType: 1,
      computationRule: '',
      dataLinkSchemaCode: '',
      isChildSchema: false,
      dataLinkCondition: '',
      dataLinkResult: '',
      mode: 1,
      inputByScan: false,
      scanUpdateEnable: false,
      noRepeat: false,
      placeHolder: '',
      description: '',
      value: null,
      editable: true,
      id: 'a805f2a0-9010-11ea-b893-053fb79aed37',
      name: '单行文本',
      code: 'F0000001',
      formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
      dataType: 1,
      controlGroupType: 1,
      controlType: 1,
      sequenceNumber: 0,
      createUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      updateUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      createDateTime: '05/07/2020 03:13:07',
      updateDateTime: '05/07/2020 03:13:07',
      auditStat: 1,
    },
  ],
  textAreaInputControls: [],
  dateTimeControls: [],
  numberInputControls: [],
  checkboxControls: [],
  checkboxGroupControls: [],
  selectControls: [],
  switchControls: [],
  attachmentControls: [],
  pictureControls: [],
  addressControls: [],
  locationControl: null,
  groupTitleControls: [],
  oneLineTwoColumnsControls: [],
  descriptionControls: [],
  serialNumberControl: null,
  creatorControl: {
    displayRule: null,
    value: 'xiaoming',
    editable: false,
    id: 'accc2d41-9010-11ea-b893-053fb79aed37',
    name: 'Creator',
    code: 'CreateUserId',
    formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
    dataType: 2,
    controlGroupType: 3,
    controlType: 18,
    sequenceNumber: -3,
    createUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
    updateUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
    createDateTime: '05/07/2020 03:13:07',
    updateDateTime: '05/07/2020 03:13:07',
    auditStat: 1,
  },
  createDateTimeControl: {
    displayRule: null,
    value: '2020-05-07 03:14:48',
    editable: false,
    id: 'accc2d40-9010-11ea-b893-053fb79aed37',
    name: 'Created Time',
    code: 'CreateDateTime',
    formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
    dataType: 5,
    controlGroupType: 3,
    controlType: 19,
    sequenceNumber: -1,
    createUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
    updateUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
    createDateTime: '05/07/2020 03:13:07',
    updateDateTime: '05/07/2020 03:13:07',
    auditStat: 1,
  },
  updateDateTimeControl: {
    displayRule: null,
    value: null,
    editable: false,
    id: 'accc2d42-9010-11ea-b893-053fb79aed37',
    name: 'Updated Time',
    code: 'UpdateDateTime',
    formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
    dataType: 5,
    controlGroupType: 3,
    controlType: 20,
    sequenceNumber: -2,
    createUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
    updateUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
    createDateTime: '05/07/2020 03:13:07',
    updateDateTime: '05/07/2020 03:13:07',
    auditStat: 1,
  },
  associatedWithFormControls: [],
  associatedWithAttributeControls: [],
  associatedWithFormMultiSelectControls: [],
};

const dummyFormReturn = {
  raw: dummyFormTplDto,
  parsed: [
    {
      subFormTemplateId: null,
      displayRule: '',
      defaultValueRuleType: 1,
      computationRule: '',
      dataLinkSchemaCode: '',
      isChildSchema: false,
      dataLinkCondition: '',
      dataLinkResult: '',
      mode: 1,
      inputByScan: false,
      scanUpdateEnable: false,
      noRepeat: false,
      placeHolder: '',
      description: '',
      value: null,
      editable: true,
      id: 'a805f2a0-9010-11ea-b893-053fb79aed37',
      name: '单行文本',
      code: 'F0000001',
      formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
      dataType: 1,
      controlGroupType: 1,
      controlType: 1,
      sequenceNumber: 0,
      createUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      updateUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      createDateTime: '05/07/2020 03:13:07',
      updateDateTime: '05/07/2020 03:13:07',
      auditStat: 1,
    },
    null,
    {
      displayRule: null,
      value: 'xiaoming',
      editable: false,
      id: 'accc2d41-9010-11ea-b893-053fb79aed37',
      name: 'Creator',
      code: 'CreateUserId',
      formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
      dataType: 2,
      controlGroupType: 3,
      controlType: 18,
      sequenceNumber: -3,
      createUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      updateUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      createDateTime: '05/07/2020 03:13:07',
      updateDateTime: '05/07/2020 03:13:07',
      auditStat: 1,
    },
    {
      displayRule: null,
      value: '2020-05-07 03:14:48',
      editable: false,
      id: 'accc2d40-9010-11ea-b893-053fb79aed37',
      name: 'Created Time',
      code: 'CreateDateTime',
      formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
      dataType: 5,
      controlGroupType: 3,
      controlType: 19,
      sequenceNumber: -1,
      createUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      updateUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      createDateTime: '05/07/2020 03:13:07',
      updateDateTime: '05/07/2020 03:13:07',
      auditStat: 1,
    },
    {
      displayRule: null,
      value: null,
      editable: false,
      id: 'accc2d42-9010-11ea-b893-053fb79aed37',
      name: 'Updated Time',
      code: 'UpdateDateTime',
      formTemplateId: 'a4f8d9b0-9010-11ea-b893-053fb79aed37',
      dataType: 5,
      controlGroupType: 3,
      controlType: 20,
      sequenceNumber: -2,
      createUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      updateUserId: '8a72779b-064b-401e-a0ea-84f7f2c2135d',
      createDateTime: '05/07/2020 03:13:07',
      updateDateTime: '05/07/2020 03:13:07',
      auditStat: 1,
    },
  ],
};

const dummyListDto = {
  rows: [
    {
      cells: [
        {
          code: 'SerialNumber',
          value: '',
          valueType: 'string',
        },
        { code: 'Id', value: '', valueType: 'string' },
      ],
    },
  ],
  totalCount: 1,
};
const dummyListReturn = [
  {
    AuditStat: { value: '', valueType: '' },
    Name: { value: '', valueType: '' },
    Id: { value: '', valueType: 'string' },
    SerialNumber: { value: '', valueType: 'string' },
    key: '',
  },
];

describe('Model/Form-Instance', () => {
  it('has right namespace', () => {
    expect(namespace).toBe('formInstance');
  });
  describe('sagas', () => {
    it('should getFormToCreate work', () => {
      const generator = modelEffects.getFormToCreate(
        { type: 'formInstance/getFormToCreate', payload: null },
        { call },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getFormToFillin, null));
      next = generator.next(dummyFormTplDto);
      expect(next.value).toEqual(dummyFormReturn);
    });

    it('should createForm work', () => {
      const generator = modelEffects.createForm(
        { type: 'formInstance/createForm', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(submitForm, null));
    });
    it('should getFormInfo work', () => {
      const generator = modelEffects.getFormInfo(
        { type: 'formInstance/getFormInfo', payload: null },
        { call },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getFormToExamine, null));
      next = generator.next(dummyFormTplDto);
      expect(next.value).toEqual(dummyFormReturn);
    });
    it('should getFormToUpdate work', () => {
      const generator = modelEffects.getFormToUpdate(
        { type: 'formInstance/getFormToUpdate', payload: null },
        { call },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getFormToUpdate, null));
      next = generator.next(dummyFormTplDto);
      expect(next.value).toEqual(dummyFormReturn);
    });

    it('should updateForm work', () => {
      const generator = modelEffects.updateForm(
        { type: 'formInstance/updateForm', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(updateFormRecord, null));
    });
    it('should deleteForm work', () => {
      const generator = modelEffects.deleteForm(
        { type: 'formInstance/deleteForm', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(deleteFormRecord, null));
    });
    it('should saveForm work', () => {
      const generator = modelEffects.saveForm(
        { type: 'formInstance/saveForm', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(saveFormAsDraft, null));
    });
    it('should updateTemporaryForm work', () => {
      const generator = modelEffects.updateTemporaryForm(
        { type: 'formInstance/updateTemporaryForm', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(updateFormDraft, null));
    });
    it('should getColHeaders work', () => {
      const generator = modelEffects.getColHeaders(
        { type: 'formInstance/getColHeaders', payload: null },
        { call, put },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getColHeaders, null));
    });

    it('should getFormDataList work ', () => {
      const generator = modelEffects.getFormDataList(
        { type: 'formInstance/getFormDataList', payload: null },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getFormList, null));
      next = generator.next(dummyListDto);
      expect(next.value).toEqual({
        dataList: dummyListReturn,
        totalCount: dummyListDto.totalCount,
      });
    });

    it('should getSelectSource work', () => {
      const generator = modelEffects.getSelectSource(
        { type: 'formInstance/getSelectSource', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getSelectSource, null));
    });

    it('should getDataLinkSource work', () => {
      const generator = modelEffects.getDataLinkSource(
        { type: 'formInstance/getDataLinkSource', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getDataLinkSource, null));
    });

    it('should getAssocFormDataList work', () => {
      const generator = modelEffects.getAssocFormDataList(
        { type: 'formInstance/getAssocFormDataList', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getAssocFormDataList, null));
    });

    it('should getAssocProperty work', () => {
      const payload = { mappingControls: 'test', formCode: 'test', code: 'test', id: 'test' };
      const generator = modelEffects.getAssocProperty(
        {
          type: 'formInstance/getAssocProperty',
          payload,
        },
        { call, put, all },
      );
      const next = generator.next();
      expect(next.value).toEqual(
        call(getAssocProperty, { formCode: payload.formCode, id: payload.id }),
      );
    });

    it('should getQueryItems work', () => {
      const generator = modelEffects.getQueryItems(
        { type: 'formInstance/getQueryItems', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getQueryItems, null));
    });

    it('should massDeleteFormRecord work', () => {
      const generator = modelEffects.massDeleteFormRecord(
        { type: 'formInstance/massDeleteFormRecord', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(massDeleteFormRecord, null));
    });

    it('should getTableConfig work', () => {
      const dummyPayload = { formTemplateId: 'testId' };
      const dummyColHeaderDto: FormRecordData.FormRecordTableDto = {
        allowBatchOperation: false,
        columnHeaders: [],
        formTemplateId: 'testId',
        optionalDisplayModel: '1;',
        orderByDirection: 2,
        orderByFieldCode: 'testFieldCode',
        pcDefaultDisplayModel: 1,
      };
      const dummyQueryItemDto: FormRecordData.QueryItemDto = {
        formTemplateId: 'testId',
        items: [],
      };
      const generator = modelEffects.getTableConfig(
        { type: 'formInstance/getTableConfig', payload: dummyPayload },
        { call },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getColHeaders, dummyPayload));
      next = generator.next(dummyColHeaderDto);
      expect(next.value).toEqual(call(getQueryItems, dummyPayload));
      next = generator.next(dummyQueryItemDto);

      expect(next.value).toEqual({
        colHeaders: [],
        tableSetting: {
          allowBatchOperation: false,
          optionalDisplayModel: '1;',
          orderByDirection: 2,
          orderByFieldCode: 'testFieldCode',
          pcDefaultDisplayModel: 1,
        },
        query: [],
        initMainQuery: [],
        initSubTable: [],
      });
    });
  });
});
