import { adaptAdvanceControlData, parseAdvanceControlData } from '../advanced/adapter/index';

const advancedControlData = [
  {
    id: '7a9ebb00-2173-11ea-a4dd-633ad73e1807',
    compType: 'associationForm',
    parentType: 'ADVANCED_COMPS',
    title: '关联表单',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '关联表单',

      hideRule: {
        label: false,
        value: '',
      },
      associateForm: { schemaCode: '', schemaId: '', isChildSchema: false },
      mappingProperties: [],
      dataLimit: '',
      dataFillRule: [{ currentFormField: 'F000001', assocFormField: 'F000002' }],
      description: '',
      inputByScan: false,
      scanUpdateEnable: false,
    },
  },
  {
    id: '9c21fc11-2173-11ea-a4dd-633ad73e1807',
    compType: 'associationAttribute',
    parentType: 'ADVANCED_COMPS',
    title: '关联属性',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '关联属性',

      hideRule: {
        label: false,
        value: '',
      },
      assocAttrConfig: {
        associateForm: '',
        associateField: '',
        setting: false,
      },
    },
  },
  {
    id: '9ccdcc71-2173-11ea-a4dd-633ad73e1807',
    compType: 'associationFormMultiSelect',
    parentType: 'ADVANCED_COMPS',
    title: '关联表单多选',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '关联表单多选',

      hideRule: {
        label: false,
        value: '',
      },
      associateForm: { schemaCode: '', schemaId: '', isChildSchema: false },
      dataLimit: '',
      description: '',
    },
  },
];

const injectedSystemControlData = advancedControlData.map((basicItem, i) => ({
  ...basicItem,
  data: {
    ...basicItem.data,
    sequenceNumber: i,
    formId: '111',
  },
}));
const initBasicServeData = {
  associatedWithAttributeControls: [],
  associatedWithFormControls: [],
  associatedWithFormMultiSelectControls: [],
};
let basicServeData = initBasicServeData;
afterEach(() => {
  basicServeData = {
    associatedWithAttributeControls: [],
    associatedWithFormControls: [],
    associatedWithFormMultiSelectControls: [],
  };
});

describe('adapt advance control data', () => {
  const adaptedAdvanceData = adaptAdvanceControlData(injectedSystemControlData);
  it('adapt assocForm control data', () => {
    const expectedAssocFormData = [
      {
        id: '7a9ebb00-2173-11ea-a4dd-633ad73e1807',
        displayRule: '',
        schemaCode: '',
        schemaId: '',
        isChildSchema: false,
        associationFilter: '',
        inputByScan: false,
        scanUpdateEnable: false,
        mappingControls: 'F000001:F000002',
        mappingProperties: '',
        description: '',

        sequenceNumber: 0,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '关联表单',
        code: null,
        controlType: 21,
        controlGroupType: 4,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedAdvanceData.associatedWithFormControlDtos).toMatchObject(expectedAssocFormData);
    // parse
    basicServeData.associatedWithFormControls = expectedAssocFormData;
    const parsedBasicData = parseAdvanceControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(advancedControlData[0]);
  });

  it('adapt assocAttr control data', () => {
    const expectedAssocAttrData = [
      {
        id: '9c21fc11-2173-11ea-a4dd-633ad73e1807',
        displayRule: '',
        mappingField: '',
        schemaCode: '',
        asFilter: false,

        sequenceNumber: 1,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '关联属性',
        code: null,
        controlType: 22,
        controlGroupType: 4,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedAdvanceData.associatedWithAttributeControlDtos[0]).toMatchObject(
      expectedAssocAttrData[0],
    );

    // parse
    basicServeData.associatedWithAttributeControls = expectedAssocAttrData;
    const parsedBasicData = parseAdvanceControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(advancedControlData[1]);
  });
  it('adapt assocMultForm control data', () => {
    const expectedAssocMultFormData = [
      {
        id: '9ccdcc71-2173-11ea-a4dd-633ad73e1807',
        displayRule: '',
        schemaCode: '',
        schemaId: '',
        isChildSchema: false,
        associationFilter: '',
        description: '',

        sequenceNumber: 2,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '关联表单多选',
        code: null,
        controlType: 23,
        controlGroupType: 4,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedAdvanceData.associatedWithFormMultiSelectControlDtos[0]).toMatchObject(
      expectedAssocMultFormData[0],
    );

    // parse
    basicServeData.associatedWithFormMultiSelectControls = expectedAssocMultFormData;
    const parsedBasicData = parseAdvanceControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(advancedControlData[2]);
  });
});
