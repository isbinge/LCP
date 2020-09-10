import { effects } from 'dva/saga';
import { routerReduxR } from '@/utils/lib/react-router-dom';
import { accountSelector, userIdSelector } from '@/domain/account/model';
import FormTemplateModel, {
  INITIAL_STATE,
  currentIdSelector,
  formItemSpecsSelector,
  formTemplateSelector,
} from '../model';

import {
  createFormTpl,
  updateFormTpl,
  deleteFormTpl,
  getControlCode,
  getAssocForms,
  getDbFields,
  getFormTpl,
  getLinkForms,
  updateFormTplName,
} from '../service';
import { formTplsSelector } from '../../../app/model';
import * as adapter from '../adapter';

const { namespace, reducers, effects: modelEffects } = FormTemplateModel;
const { put, call, select } = effects;

const dummyFormSpec = {
  id: 'testId',
  name: 'testName',
  code: 'testCode',
  iconCss: 'testIcon',
  dataTitle: ['F0000001'],
  openFormDynamic: true,
  openTaskNotification: false,
  displayToMobile: true,
  displayToPc: true,
  currentUserId: 'testUserId',
};

const dummyFormItemSpecs = [
  {
    id: 'testId',
    code: 'testCode',
    displayable: true,
    compType: 'testType',
    data: undefined,
  },
];

const dummyGetCtrlCodeMainFormItemSpecs = [
  {
    code: 'testCode',
    compType: 'input',
    displayable: true,
    id: 'testId',
    fromRaw: true,
    parentType: 'input',
    renderOptions: {
      hideTitle: false,
    },
    subFormId: null,
    title: 'testTitle',
    data: {
      name: 'Input',
      inputType: 'input',
      hideRule: { label: false, value: '' },
      defaultValue: {
        calcFormula: 'calcFormula',
        calcSelect: {
          label: true,
          value: '',
        },
        dataLink: {
          dataLinkSchemaCode: '',
          isChildSchema: false,
          dataLinkCondition: [],
          dataLinkResult: '',
        },
      },
      format: 'text',
      verify: [0],
      tip: '',
      description: '',
      dataType: 1,
      //
      inputByScan: false,
      scanUpdateEnable: false,
    },
  },
];

const dummyGetCtrlCodeSubFormItemSpecs = [
  {
    id: 'testSubFormTemplateId',
    extraData: [
      {
        code: 'testCode',
        compType: 'input',
        displayable: true,
        id: 'testId',
        fromRaw: true,
        parentType: 'input',
        renderOptions: {
          hideTitle: false,
        },
        subFormId: 'testSubFormTemplateId',
        title: 'testTitle',
        data: {
          name: 'Input',
          inputType: 'input',
          hideRule: { label: false, value: '' },
          defaultValue: {
            calcFormula: 'calcFormula',
            calcSelect: {
              label: true,
              value: '',
            },
            dataLink: {
              dataLinkSchemaCode: '',
              isChildSchema: false,
              dataLinkCondition: [],
              dataLinkResult: '',
            },
          },
          format: 'text',
          verify: [0],
          tip: '',
          description: '',
          dataType: 1,
          //
          inputByScan: false,
          scanUpdateEnable: false,
        },
      },
    ],
  },
];

const dummyCurrentCtrl = {
  id: 'ef7ce180-9000-11ea-8ae0-e1c37c604cd2',
  displayable: true,
  parentType: 'BASIC_COMPS',
  title: '单行文本',
  fromRaw: true,
  subFormId: null,
  renderOptions: { hideTitle: false },
  compType: 'input',
  code: 'F0000001',
  data: {
    name: '单行文本',
    inputType: 'input',
    hideRule: { label: false, value: '' },
    defaultValue: {
      calcFormula: 'calcFormula',
      calcSelect: { label: true, value: '' },
      dataLink: {
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: [],
        dataLinkResult: '',
      },
    },
    format: 'text',
    verify: [0],
    tip: '',
    description: '',
    dataType: 1,
    inputByScan: false,
    scanUpdateEnable: false,
  },
};
const dummyCurrentCtrlUnderSubForm = {
  ...dummyCurrentCtrl,
  subFormId: 'b7560463-9007-11ea-997b-3f085f405b19',
};
const dummySelectedValueWithNameChange = {
  name: 'namechange',
  inputType: 'input',
  hideRule: { label: false, value: '' },
  defaultValue: {
    calcFormula: 'calcFormula',
    calcSelect: { label: true, value: '' },
    dataLink: {
      dataLinkSchemaCode: '',
      isChildSchema: false,
      dataLinkCondition: [],
      dataLinkResult: '',
    },
  },
  format: 'text',
  verify: [0],
  tip: '',
  description: '',
  dataType: 1,
  inputByScan: false,
  scanUpdateEnable: false,
};
const dummySelectedValueWithTypeChange = {
  name: '单行文本',
  inputType: 'select',
  hideRule: { label: false, value: '' },
  defaultValue: {
    calcFormula: 'calcFormula',
    calcSelect: { label: true, value: '' },
    dataLink: {
      dataLinkSchemaCode: '',
      isChildSchema: false,
      dataLinkCondition: [],
      dataLinkResult: '',
    },
  },
  format: 'text',
  verify: [0],
  tip: '',
  description: '',
  dataType: 1,
  inputByScan: false,
  scanUpdateEnable: false,
};
const dummyAdapterCtrlWithNameChange = {
  id: 'ef7ce180-9000-11ea-8ae0-e1c37c604cd2',
  displayable: true,
  parentType: 'BASIC_COMPS',
  title: '单行文本',
  fromRaw: true,
  subFormId: null,
  renderOptions: { hideTitle: false },
  compType: 'input',
  code: 'F0000001',
  data: {
    name: 'namechange',
    inputType: 'input',
    hideRule: { label: false, value: '' },
    defaultValue: {
      calcFormula: 'calcFormula',
      calcSelect: { label: true, value: '' },
      dataLink: {
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: [],
        dataLinkResult: '',
      },
    },
    format: 'text',
    verify: [0],
    tip: '',
    description: '',
    dataType: 1,
    inputByScan: false,
    scanUpdateEnable: false,
  },
};

const dummyAdapterCtrlUnderSubForm = {
  ...dummyAdapterCtrlWithNameChange,
  subFormId: 'b7560463-9007-11ea-997b-3f085f405b19',
};

const dummyAdapterCtrlWithTypeChange = {
  id: 'ef7ce180-9000-11ea-8ae0-e1c37c604cd2',
  displayable: true,
  parentType: 'BASIC_COMPS',
  title: '单行文本',
  fromRaw: true,
  subFormId: null,
  renderOptions: { hideTitle: false },
  compType: 'select',
  code: 'F0000001',
  data: {
    name: '单行文本',
    inputType: 'select',
    hideRule: { label: false, value: '' },
    sourceFrom: 'custom',
    options: { optionsValue: ['option1', 'option2', 'option3'], selectValue: '' },
    associateForm: { schemaCode: '', schemaId: '' },
    dataLimit: '',
    description: '',
    mobileSelectShowMode: 'sideSlip',
    mappingField: '',
    dataType: 1,
  },
};
const dummyFormItemSpecsWithSubForm = [
  {
    code: 'Fb9e9cea0900711ea997b3f085f405b19',
    compType: 'subform',
    data: {
      dataTitle: [],
      hideRule: { label: false, value: '' },
      name: '子表',
    },
    displayable: true,
    fromRaw: true,
    id: 'b7560463-9007-11ea-997b-3f085f405b19',
    parentType: 'LAYOUT_COMPS',
    extraData: [dummyCurrentCtrlUnderSubForm],
  },
];

const dummyFormItemSpecsWithSubFormChange = [
  {
    ...dummyFormItemSpecsWithSubForm[0],
    extraData: [dummyAdapterCtrlUnderSubForm],
  },
];

const dummyUpdateFormNamePayload = {
  name: 'second name',
  formTplId: 'testTplId',
};

const dunmmyFormTplList = [
  {
    id: 'testTplId',
    code: 'testTplCode',
    name: 'first name',
    iconCss: '',
  },
];

describe('Model/Form-Template', () => {
  it('has right namespace', () => {
    expect(namespace).toBe('formTemplate');
  });

  describe('reducers', () => {
    const testState = INITIAL_STATE;
    it('should reset work', () => {
      expect(reducers.reset()).toEqual({
        ...testState,
        formSpec: { ...testState.formSpec, id: 'mockUuid' },
      });
    });

    it('should updateTplName work', () => {
      expect(
        reducers.updateTplName(testState, {
          payload: {
            newName: 'testNewName',
          },
        }),
      ).toEqual({
        ...testState,
        formSpec: {
          ...testState.formSpec,
          name: 'testNewName',
        },
      });
    });

    it('should updateCursor work', () => {
      expect(
        reducers.updateCursor(testState, {
          payload: {
            currentId: 'testId',
          },
        }),
      ).toEqual({
        ...testState,
        currentId: 'testId',
      });
    });

    it('should updateFormSpec work', () => {
      expect(
        reducers.updateFormSpec(testState, {
          payload: {
            formSpec: dummyFormSpec,
          },
        }),
      ).toEqual({
        ...testState,
        formSpec: dummyFormSpec,
      });
    });

    it('should updateFormItemSpecs work', () => {
      expect(
        reducers.updateFormItemSpecs(testState, {
          payload: {
            formItemSpecs: dummyFormItemSpecs,
          },
        }),
      ).toEqual({
        ...testState,
        formItemSpecs: dummyFormItemSpecs,
      });
    });
  });

  describe('sagas', () => {
    it('should createFormTpl work', () => {
      const generator = modelEffects.createFormTpl(
        { type: 'formTemplate/createFormTpl', payload: { appId: 'qux' } },
        { call, select, put },
      );
      jest.spyOn(adapter, 'adaptFormData').mockReturnValue(null);
      let next = generator.next();
      expect(next.value).toEqual(select(accountSelector));
      next = generator.next({ userId: 'foo' });
      expect(next.value).toEqual(select(formTemplateSelector));
      next = generator.next([null, null]);
      expect(next.value).toEqual(call(createFormTpl, { data: null }));
      next = generator.next('foo');
      expect(next.value).toEqual(put({ type: 'app/getFormTplList', payload: { appId: 'qux' } }));
      next = generator.next();
      expect(next.value).toEqual(
        put(
          routerReduxR.replace('/app/:appId/form-designer/:templateId/form-design', {
            appId: 'qux',
            templateId: 'foo',
          }),
        ),
      );
    });

    it('should updateFormTpl work', () => {
      const generator = modelEffects.updateFormTpl(
        {
          type: 'formTemplate/updateFormTpl',
          payload: { appId: 'qux', templateId: 'foo' },
        },
        { call, select, put },
      );
      jest.spyOn(adapter, 'adaptFormData').mockReturnValue(null);
      let next = generator.next();
      expect(next.value).toEqual(select(accountSelector));
      next = generator.next({ userId: 'foo' });
      expect(next.value).toEqual(select(formTemplateSelector));
      next = generator.next([null, null]);
      expect(next.value).toEqual(call(updateFormTpl, { data: null, templateId: 'foo' }));
      next = generator.next();
      expect(next.value).toEqual(put({ type: 'getFormTpl', payload: { templateId: 'foo' } }));
      next = generator.next();
      expect(next.value).toEqual(put({ type: 'app/getFormTplList', payload: { appId: 'qux' } }));
      next = generator.next();
      expect(next.value).toEqual(put({ type: 'setEdited', payload: { edited: false } }));
    });

    it('should deleteFormTpl work', () => {
      const generator = modelEffects.deleteFormTpl(
        { type: 'formTemplate/deleteFormTpl', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(deleteFormTpl, null));
    });

    it('should getFormTpl work', () => {
      jest.spyOn(adapter, 'parseFormData').mockReturnValue({ formItemSpecs: null, formSpec: null });
      const generator = modelEffects.getFormTpl(
        { type: 'formTemplate/getFormTpl', payload: null },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getFormTpl, null));
      next = generator.next();
      expect(next.value).toEqual(
        put({
          type: 'saveFormTpl',
          payload: {
            formItemSpecs: null,
            formSpec: null,
          },
        }),
      );
      next = generator.next();
      expect(next.value).toEqual(put({ type: 'subscribeFormTplChange' }));
    });

    it('should getControlCode work without subFormTemplateId', () => {
      const testCode = 'testCode';
      const dummyGetCtrlCodeMainFormPayload = {
        formTemplateId: 'testFormTemplateId',
        subFormTemplateId: null,
        item: {
          type: 'input',
          payload: {
            id: 'testId',
            title: 'testTitle',
            compType: 'input',
            renderOptions: {},
            fromRaw: true,
          },
        },
        addIndex: 0,
      };
      const generator = modelEffects.getControlCode(
        { type: 'formTemplate/getControlCode', payload: dummyGetCtrlCodeMainFormPayload },
        { call, put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(
        call(getControlCode, {
          formTemplateId: dummyGetCtrlCodeMainFormPayload.formTemplateId,
          subFormTemplateId: dummyGetCtrlCodeMainFormPayload.subFormTemplateId,
        }),
      );
      next = generator.next(testCode);
      expect(next.value).toEqual(select(formItemSpecsSelector));
      next = generator.next([]);
      expect(next.value).toEqual(
        put({
          type: 'updateFormItemSpecs',
          payload: {
            formItemSpecs: dummyGetCtrlCodeMainFormItemSpecs,
          },
        }),
      );
    });

    it('should getControlCode work with subFormTemplateId', () => {
      const testCode = 'testCode';
      const dummyData = {
        formTemplateId: 'testFormTemplateId',
        subFormTemplateId: 'testSubFormTemplateId',
        item: {
          type: 'input',
          payload: {
            id: 'testId',
            title: 'testTitle',
            compType: 'input',
            renderOptions: {},
            fromRaw: true,
          },
        },
        addIndex: 0,
      };
      const generator = modelEffects.getControlCode(
        { type: 'formTemplate/getControlCode', payload: dummyData },
        { call, put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(
        call(getControlCode, {
          formTemplateId: dummyData.formTemplateId,
          subFormTemplateId: dummyData.subFormTemplateId,
        }),
      );
      next = generator.next(testCode);
      expect(next.value).toEqual(select(formItemSpecsSelector));
      next = generator.next([
        {
          id: 'testSubFormTemplateId',
          extraData: [],
        },
      ]);
      expect(next.value).toEqual(
        put({
          type: 'updateFormItemSpecs',
          payload: {
            formItemSpecs: dummyGetCtrlCodeSubFormItemSpecs,
          },
        }),
      );
    });

    it('should getAssociationForms work', () => {
      const generator = modelEffects.getAssociationForms(
        { type: 'formTemplate/getAssociationForms', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getAssocForms, null));
    });

    it('should getDbFields work when isChildSchema', () => {
      const dummyPayload = {
        formCode: 'foo',
        isChildSchema: true,
      };
      const generator = modelEffects.getDbFields(
        { type: 'formTemplate/getDbFields', payload: dummyPayload },
        { call },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getDbFields, { formCode: dummyPayload.formCode }));
      next = generator.next([]);
      expect(next.value).toEqual([]);
    });

    it('should getLinkForms work', () => {
      const generator = modelEffects.getLinkForms(
        { type: 'formTemplate/getLinkForms', payload: null },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(getLinkForms, null));
    });

    it('should adapterSelectedCtrl work when type is not change', () => {
      const payload = {
        currentCtrl: dummyCurrentCtrl,
        value: dummySelectedValueWithNameChange,
      };
      const currentId = 'ef7ce180-9000-11ea-8ae0-e1c37c604cd2';
      const generator = modelEffects.adapterSelectedCtrl(
        {
          type: 'formTemplate/adapterSelectedCtrl',
          payload,
        },
        { put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(select(currentIdSelector));
      next = generator.next(currentId);
      expect(next.value).toEqual(
        put({
          type: 'updateCtrl',
          payload: {
            selectedCtrl: dummyCurrentCtrl,
            updateSelectedCtrl: dummyAdapterCtrlWithNameChange,
            id: currentId,
          },
        }),
      );
    });

    it('should adapterSelectedCtrl work when type is changing', () => {
      const payload = {
        currentCtrl: dummyCurrentCtrl,
        value: dummySelectedValueWithTypeChange,
      };
      const currentId = 'ef7ce180-9000-11ea-8ae0-e1c37c604cd2';
      const generator = modelEffects.adapterSelectedCtrl(
        {
          type: 'formTemplate/adapterSelectedCtrl',
          payload,
        },
        { put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(select(currentIdSelector));
      next = generator.next(currentId);
      expect(next.value).toEqual(
        put({
          type: 'updateCtrl',
          payload: {
            selectedCtrl: dummyCurrentCtrl,
            updateSelectedCtrl: dummyAdapterCtrlWithTypeChange,
            id: currentId,
          },
        }),
      );
    });

    it('should updateCtrl work when selectedCtrl is subForm', () => {
      const payload = {
        selectedCtrl: dummyCurrentCtrlUnderSubForm,
        updateSelectedCtrl: dummyAdapterCtrlUnderSubForm,
        id: 'ef7ce180-9000-11ea-8ae0-e1c37c604cd2',
      };
      const generator = modelEffects.updateCtrl(
        {
          type: 'formTemplate/updateCtrl',
          payload,
        },
        { put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(select(formItemSpecsSelector));
      next = generator.next(dummyFormItemSpecsWithSubForm);
      expect(next.value).toEqual(
        put({
          type: 'updateFormItemSpecs',
          payload: { formItemSpecs: dummyFormItemSpecsWithSubFormChange },
        }),
      );
    });

    it('should updateCtrl work when selectedCtrl is not subForm', () => {
      const payload = {
        selectedCtrl: dummyCurrentCtrl,
        updateSelectedCtrl: dummyAdapterCtrlWithNameChange,
        id: 'ef7ce180-9000-11ea-8ae0-e1c37c604cd2',
      };
      const generator = modelEffects.updateCtrl(
        {
          type: 'formTemplate/updateCtrl',
          payload,
        },
        { put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(select(formItemSpecsSelector));
      next = generator.next([dummyCurrentCtrl]);
      expect(next.value).toEqual(
        put({
          type: 'updateFormItemSpecs',
          payload: { formItemSpecs: [dummyAdapterCtrlWithNameChange] },
        }),
      );
    });

    it('should updateFormTplName work', () => {
      const generator = modelEffects.updateFormTplName(
        {
          type: 'formTemplate/updateFormTplName',
          payload: dummyUpdateFormNamePayload,
        },
        { call, put, select },
      );
      let next = generator.next();
      expect(next.value).toEqual(select(userIdSelector));
      next = generator.next('testUserId');
      expect(next.value).toEqual(select(formTplsSelector));
      next = generator.next(dunmmyFormTplList);
      expect(next.value).toEqual(
        call(updateFormTplName, {
          ...dummyUpdateFormNamePayload,
          iconCss: '',
          currentUserId: 'testUserId',
        }),
      );
      next = generator.next();
      expect(next.value).toEqual(
        put({
          type: 'app/saveFormTplList',
          payload: {
            formTpls: [
              {
                ...dunmmyFormTplList[0],
                name: 'second name',
              },
            ],
          },
        }),
      );
    });
  });
});
