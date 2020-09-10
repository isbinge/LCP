import { adaptBasicControlData, parseBasicControlData } from '../basic/adapter/index';

const basicControlData = [
  {
    id: '3314f980-2159-11ea-a535-e164c9468524',
    compType: 'input',
    parentType: 'BASIC_COMPS',
    title: '单行文本0',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '单行文本0',
      dataType: 1,
      inputType: 'input',
      hideRule: {
        label: false,
        value: '',
      },
      defaultValue: {
        calcFormula: 'calcFormula',
        calcSelect: {
          label: '计算公式',
          value: '',
        },
        dataLink: {
          dataLinkSchemaCode: '',
          isChildSchema: false,
          dataLinkCondition: [{ currentForm: 'CreateUserId', dataLinkForm: 'CreateUserId' }],
          dataLinkResult: '',
        },
      },
      format: 'phone',
      verify: [0],
      tip: 'sdffdf',
      description: 'dgdsa',

      inputByScan: false,
      scanUpdateEnable: false,
    },
  },
  {
    id: 'f11b8521-2159-11ea-a535-e164c9468524',
    compType: 'textarea',
    parentType: 'BASIC_COMPS',
    title: '多行文本0',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '多行文本0',
      visibleRows: 4,
      dataType: 4,
      hideRule: {
        label: false,
        value: '',
      },
      defaultValue: {
        calcFormula: 'calcFormula',
        calcSelect: {
          label: '计算公式',
          value: '',
        },
        dataLink: {
          dataLinkSchemaCode: '',
          isChildSchema: false,
          dataLinkCondition: [{ currentForm: 'CreateUserId', dataLinkForm: 'CreateUserId' }],
          dataLinkResult: '',
        },
      },
      tip: '324',
      description: '3435235',
    },
  },
  {
    id: '67ae05e2-215b-11ea-a535-e164c9468524',
    compType: 'date',
    parentType: 'BASIC_COMPS',
    title: '日期',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '日期',
      dataType: 5,
      hideRule: {
        label: false,
        value: '',
      },
      defaultValue: {
        calcFormula: 'calcFormula',
        calcSelect: {
          label: '计算公式',
          value: '',
        },
        dataLink: {
          dataLinkSchemaCode: '',
          isChildSchema: false,
          dataLinkCondition: [{ currentForm: 'CreateUserId', dataLinkForm: 'CreateUserId' }],
          dataLinkResult: '',
        },
      },
      format: 'YMDHM',
      description: 'date',
    },
  },
  {
    id: '69f02db3-215b-11ea-a535-e164c9468524',
    compType: 'number',
    parentType: 'BASIC_COMPS',
    title: '数字',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '数字',
      dataType: 6,
      hideRule: {
        label: false,
        value: '',
      },
      defaultValue: {
        calcFormula: 'calcFormula',
        calcSelect: {
          label: '计算公式',
          value: '',
        },
        dataLink: {
          dataLinkSchemaCode: '',
          isChildSchema: false,
          dataLinkCondition: [{ currentForm: 'CreateUserId', dataLinkForm: 'CreateUserId' }],
          dataLinkResult: '',
        },
      },
      format: {
        showDecimal: [true],
        placesNumber: 2,
        showThousandSep: [true],
      },
      description: 'number',
    },
  },
  {
    id: '6a8f05c0-215b-11ea-a535-e164c9468524',
    compType: 'radio',
    parentType: 'BASIC_COMPS',
    title: '单选框0',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '单选框0',
      dataType: 1,
      inputType: 'radio',
      hideRule: {
        label: false,
        value: '',
      },
      options: {
        selectValue: '选项2',
        optionsValue: ['选项1', '选项2', '选项3'],
      },
      description: 'radio',
      mobileSelectShowMode: 'sideSlip',
    },
  },
  {
    id: '6b86ac32-215b-11ea-a535-e164c9468524',
    compType: 'checkbox',
    parentType: 'BASIC_COMPS',
    title: '复选框',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '复选框',
      dataType: 1,
      inputType: 'checkbox',
      hideRule: {
        label: false,
        value: '',
      },
      options: {
        selectValue: ['选项1', '选项2'],
        optionsValue: ['选项1', '选项2', '选项3'],
      },
      description: 'checkbox',
      mobileSelectShowMode: 'sideSlip',
    },
  },
  {
    id: '6ca0a7b4-215b-11ea-a535-e164c9468524',
    compType: 'select',
    parentType: 'BASIC_COMPS',
    title: '下拉框0',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '下拉框0',
      dataType: 1,
      inputType: 'select',
      hideRule: {
        label: false,
        value: '',
      },
      associateForm: { schemaCode: '', schemaId: undefined },
      sourceFrom: 'custom',
      options: {
        selectValue: '选项2',
        optionsValue: ['选项1', '选项2', '选项3'],
      },
      description: 'select',
      mobileSelectShowMode: 'sideSlip',
      mappingField: '',
      dataLimit: '',
    },
  },
  {
    id: '701bc4b7-215b-11ea-a535-e164c9468524',
    compType: 'switch',
    parentType: 'BASIC_COMPS',
    title: 'yes/no',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      dataType: 7,
      hideRule: {
        label: false,
        value: '',
      },
      content: 'yes/no',
      switch: true,
    },
  },
  {
    id: '72d47c10-215b-11ea-a535-e164c9468524',
    compType: 'input',
    parentType: 'BASIC_COMPS',
    title: '单行文本1',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: '单行文本1',
      dataType: 1,
      inputType: 'input',
      hideRule: {
        label: false,
        value: '',
      },

      defaultValue: {
        calcFormula: 'calcFormula',
        calcSelect: {
          label: '计算公式',
          value: '',
        },
        dataLink: {
          dataLinkSchemaCode: '',
          isChildSchema: false,
          dataLinkCondition: [],
          dataLinkResult: '',
        },
      },
      format: 'idcard',
      verify: [1],
      tip: 'sdf',
      description: 'fdsf',
      inputByScan: false,
      scanUpdateEnable: false,
    },
  },
  {
    id: 'baz1',
    compType: 'staffSingleSelect',
    parentType: 'BASIC_COMPS',
    title: 'sta',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: 'sta',
      hideRule: { label: false, value: '' },
      isRelatedMember: true,
      unitSelectionRange: {
        dept: ['1'],
        role: ['2'],
        deptCtrl: ['3'],
        other: ['-1'],
      },
      allowSelectedUserViewData: false,
      personFilled: {
        deptMappingField: '0',
        genderMappingField: '0',
        emailMappingField: '0',
        mobileMappingField: '0',
      },
      dataType: 2,
    },
  },
  {
    id: 'baz2',
    compType: 'staffMultiSelect',
    parentType: 'BASIC_COMPS',
    title: 'stam',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: 'stam',
      hideRule: { label: false, value: '' },
      isRelatedMember: true,
      unitSelectionRange: {
        dept: ['1'],
        role: ['2'],
        deptCtrl: ['3'],
        other: ['-1'],
      },
      dataType: 14,
      allowSelectedUserViewData: false,
    },
  },
  {
    id: 'baz3',
    compType: 'deptSingleSelect',
    parentType: 'BASIC_COMPS',
    title: 'dep',
    fromRaw: false,
    displayable: true,
    subFormId: null,
    code: null,
    data: {
      name: 'dep',
      hideRule: { label: false, value: '' },
      unitSelectionRange: {
        dept: ['1'],
        role: ['2'],
        deptCtrl: ['3'],
        other: ['-1'],
      },
      description: '',
      dataType: 14,
    },
  },
];
const injectedBasicControlData = basicControlData.map((basicItem, i) => ({
  ...basicItem,
  data: {
    ...basicItem.data,
    sequenceNumber: i,
    formId: '111',
  },
}));
const initBasicServeData = {
  singleLineInputControls: [],
  checkboxGroupControls: [],
  dateTimeControls: [],
  numberInputControls: [],
  checkboxControls: [],
  selectControls: [],
  switchControls: [],
  textAreaInputControls: [],
  staffSingleSelectControls: [],
  staffMultiSelectControls: [],
  deptSingleSelectControls: [],
  deptMultiSelectControls: [],
};
let basicServeData = initBasicServeData;
afterEach(() => {
  basicServeData = {
    singleLineInputControls: [],
    checkboxGroupControls: [],
    dateTimeControls: [],
    numberInputControls: [],
    checkboxControls: [],
    selectControls: [],
    switchControls: [],
    textAreaInputControls: [],
    staffSingleSelectControls: [],
    staffMultiSelectControls: [],
    deptSingleSelectControls: [],
    deptMultiSelectControls: [],
  };
});
describe('basic control data adapt and parse', () => {
  const adaptedBasicData = adaptBasicControlData(injectedBasicControlData);
  it('adapt input control data', () => {
    const expectedInputData = [
      {
        id: '3314f980-2159-11ea-a535-e164c9468524',
        displayRule: '',
        defaultValueRuleType: 1,
        computationRule: '',
        dataLinkSchemaCode: '',
        // required field
        isChildSchema: false,
        dataLinkCondition: 'CreateUserId:CreateUserId',
        dataLinkResult: '',
        // required field
        mode: 4,
        // required field
        inputByScan: false,
        // required field
        scanUpdateEnable: false,
        // required field
        noRepeat: false,
        placeHolder: 'sdffdf',
        description: 'dgdsa',

        sequenceNumber: 0,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '单行文本0',
        code: null,
        controlType: 1,
        controlGroupType: 1,
        dataType: 1,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
      {
        id: '72d47c10-215b-11ea-a535-e164c9468524',
        displayRule: '',
        defaultValueRuleType: 1,
        computationRule: '',
        dataLinkSchemaCode: '',
        // required field
        isChildSchema: false,
        dataLinkCondition: '',
        dataLinkResult: '',
        // required field
        mode: 3,
        // required field
        inputByScan: false,
        // required field
        scanUpdateEnable: false,
        // required field
        noRepeat: true,
        placeHolder: 'sdf',
        description: 'fdsf',

        sequenceNumber: 8,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '单行文本1',
        code: null,
        controlType: 1,
        controlGroupType: 1,
        dataType: 1,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.singleLineInputControlDtos[0]).toMatchObject(expectedInputData[0]);
    expect(adaptedBasicData.singleLineInputControlDtos[1]).toMatchObject(expectedInputData[1]);

    // parse
    basicServeData.singleLineInputControls = expectedInputData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[0]);
    expect(parsedBasicData[1]).toMatchObject(basicControlData[8]);
  });

  it('adapt textarea control data', () => {
    const expectedTextareaData = [
      {
        id: 'f11b8521-2159-11ea-a535-e164c9468524',
        rows: 4,

        displayRule: '',
        defaultValueRuleType: 1,
        computationRule: '',
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: 'CreateUserId:CreateUserId',
        dataLinkResult: '',

        placeHolder: '324',
        description: '3435235',

        sequenceNumber: 1,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '多行文本0',
        code: null,
        controlType: 2,
        controlGroupType: 1,
        dataType: 4,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.textAreaInputControlDtos[0]).toMatchObject(expectedTextareaData[0]);

    // parse
    basicServeData.textAreaInputControls = expectedTextareaData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[1]);
  });

  it('adapt date control data', () => {
    const expectedDateData = [
      {
        id: '67ae05e2-215b-11ea-a535-e164c9468524',
        dateTimeMode: 'yyyy-mm-dd hh:mm',

        displayRule: '',
        defaultValueRuleType: 1,
        computationRule: '',
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: 'CreateUserId:CreateUserId',
        dataLinkResult: '',

        description: 'date',

        sequenceNumber: 2,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '日期',
        code: null,
        controlType: 3,
        controlGroupType: 1,
        dataType: 5,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.dateTimeControlDtos[0]).toMatchObject(expectedDateData[0]);

    // parse
    basicServeData.dateTimeControls = expectedDateData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[2]);
  });

  it('adapt number control data', () => {
    const expectedNumberData = [
      {
        id: '69f02db3-215b-11ea-a535-e164c9468524',
        isDecimals: true,
        decimalPlaces: 2,
        showThousandthSeparator: true,
        displayRule: '',
        defaultValueRuleType: 1,
        computationRule: '',
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: 'CreateUserId:CreateUserId',
        dataLinkResult: '',

        description: 'number',

        sequenceNumber: 3,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '数字',
        code: null,
        controlType: 4,
        controlGroupType: 1,
        dataType: 6,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.numberInputControlDtos[0]).toMatchObject(expectedNumberData[0]);

    // parse
    basicServeData.numberInputControls = expectedNumberData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[3]);
  });

  it('adapt radio control data', () => {
    const expectedRadioData = [
      {
        id: '6a8f05c0-215b-11ea-a535-e164c9468524',
        mobileSelectShowMode: 1,
        defaultItems: '选项1;选项2;选项3',
        defaultValue: '选项2',

        displayRule: '',

        description: 'radio',

        sequenceNumber: 4,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '单选框0',
        code: null,
        controlType: 5,
        controlGroupType: 1,
        dataType: 1,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.checkboxControlDtos[0]).toMatchObject(expectedRadioData[0]);

    // parse
    basicServeData.checkboxControls = expectedRadioData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[4]);
  });

  it('adapt checkbox control data', () => {
    const expectedCheckboxData = [
      {
        id: '6b86ac32-215b-11ea-a535-e164c9468524',
        mobileSelectShowMode: 1,
        defaultItems: '选项1;选项2;选项3',
        defaultValue: '选项1;选项2',

        displayRule: '',

        description: 'checkbox',

        sequenceNumber: 5,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '复选框',
        code: null,
        controlType: 6,
        controlGroupType: 1,
        dataType: 1,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.checkboxGroupControlDtos[0]).toMatchObject(expectedCheckboxData[0]);

    // parse
    basicServeData.checkboxGroupControls = expectedCheckboxData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[5]);
  });

  it('adapt select control data', () => {
    const expectedSelectData = [
      {
        id: '6ca0a7b4-215b-11ea-a535-e164c9468524',
        mobileSelectShowMode: 1,
        dataSource: 1,
        defaultItems: '选项1;选项2;选项3',
        defaultValue: '选项2',
        mappingField: '',
        schemaCode: '',

        associationFilter: '',
        displayRule: '',

        description: 'select',

        sequenceNumber: 6,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '下拉框0',
        code: null,
        controlType: 7,
        controlGroupType: 1,
        dataType: 1,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.selectControlDtos[0]).toMatchObject(expectedSelectData[0]);

    // parse
    basicServeData.selectControls = expectedSelectData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[6]);
  });

  it('adapt switch control data', () => {
    const expectedSwitchData = [
      {
        id: '701bc4b7-215b-11ea-a535-e164c9468524',
        defaultItems: 'yes/no',
        defaultValue: true,
        displayRule: '',

        sequenceNumber: 7,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: 'yes/no',
        code: null,
        controlType: 8,
        controlGroupType: 1,
        dataType: 7,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.switchControlDtos[0]).toMatchObject(expectedSwitchData[0]);

    // parse
    basicServeData.switchControls = expectedSwitchData;
    basicServeData.switchControls[0].defaultValue = 'true';
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[7]);
  });
  it('adapt staffSingleSelect control data', () => {
    const expectedStaffSelectData = [
      {
        id: 'baz1',
        displayRule: '',
        unitSelectionRange: 'Dept:1;Role:2;DeptControl:3;Other:-1;',
        isRelatedMember: true,
        allowSelectedUserViewData: false,
        deptMappingField: '0',
        genderMappingField: '0',
        emailMappingField: '0',
        mobileMappingField: '0',

        sequenceNumber: 9,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: 'sta',
        code: null,
        controlType: 25,
        controlGroupType: 1,
        dataType: 2,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.staffSingleSelectControlDtos[0]).toMatchObject(
      expectedStaffSelectData[0],
    );

    // parse
    basicServeData.staffSingleSelectControls = expectedStaffSelectData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[9]);
  });
  it('adapt staffMultiSelect control data', () => {
    const expectedStaffMultiSelectData = [
      {
        id: 'baz2',
        displayRule: '',
        unitSelectionRange: 'Dept:1;Role:2;DeptControl:3;Other:-1;',
        isRelatedMember: true,
        allowSelectedUserViewData: false,

        sequenceNumber: 10,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: 'stam',
        code: null,
        controlType: 26,
        controlGroupType: 1,
        dataType: 14,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.staffMultiSelectControlDtos[0]).toMatchObject(
      expectedStaffMultiSelectData[0],
    );

    // parse
    basicServeData.staffMultiSelectControls = expectedStaffMultiSelectData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[10]);
  });
  it('adapt deptSelect control data', () => {
    const expectedDeptSelectData = [
      {
        id: 'baz3',
        displayRule: '',
        unitSelectionRange: 'Dept:1;Role:2;DeptControl:3;Other:-1;',
        description: '',

        sequenceNumber: 11,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: 'dep',
        code: null,
        controlType: 27,
        controlGroupType: 1,
        dataType: 14,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedBasicData.deptSingleSelectControlDtos[0]).toMatchObject(
      expectedDeptSelectData[0],
    );

    // parse
    basicServeData.deptSingleSelectControls = expectedDeptSelectData;
    const parsedBasicData = parseBasicControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(basicControlData[11]);
  });
});
