import { adaptSystemControlData, parseSystemControlData } from '../../system/adapter/index';

const systemControlData = [
  {
    id: 'acd363d0-2170-11ea-abbd-1fe4758f58d2',
    compType: 'creator',
    displayable: true,
    parentType: 'SYSTEM_COMPS',
    title: '创建人',
    subFormId: null,
    fromRaw: false,
    data: {
      name: '创建人',
      hideRule: {
        label: false,
        value: '',
      },
    },
  },
  {
    id: 'e3d2acb1-2170-11ea-abbd-1fe4758f58d2',
    compType: 'createTime',
    displayable: true,
    parentType: 'SYSTEM_COMPS',
    title: '创建时间',
    subFormId: null,

    fromRaw: false,
    data: {
      name: '创建时间',
      hideRule: {
        label: false,
        value: '',
      },
    },
  },
  {
    id: 'e45dd5b2-2170-11ea-abbd-1fe4758f58d2',
    compType: 'modifyTime',
    displayable: true,
    parentType: 'SYSTEM_COMPS',
    title: '修改时间',
    subFormId: null,

    fromRaw: false,
    data: {
      name: '修改时间',
      hideRule: {
        label: false,
        value: '',
      },
    },
  },
  {
    id: '13de5f90-2b75-11ea-8a33-d7f624102879',
    code: 'SerialNumber',
    displayable: true,
    compType: 'serialNo',
    parentType: 'SYSTEM_COMPS',
    title: '流水号',
    subFormId: null,

    fromRaw: false,
    data: {
      name: '流水号',
      seqNoStructure:
        'Type:1,Value:YYYY;Type:2,IncreNum:8,Value:1;Type:3,Value:f;Type:4,Value:F0000012,Label:课程',
    },
  },
  {
    id: '13de5f90-2b75-11ea-8a33-d7f624103879',
    code: 'OwnerId',
    displayable: true,
    compType: 'owner',
    parentType: 'SYSTEM_COMPS',
    title: 'Owner',
    subFormId: null,

    fromRaw: false,
    data: {
      name: 'Owner',
      hideRule: { label: false, value: '' },
      unitSelectionRange: {
        dept: ['1'],
        role: ['2'],
        deptCtrl: ['3'],
        other: ['-1'],
      },
      personFilled: {
        deptMappingField: '0',
        genderMappingField: '0',
        emailMappingField: '0',
        mobileMappingField: '0',
      },
    },
  },
  {
    id: '13de5f90-2b75-11ea-8a33-d7f624104879',
    code: 'OwnerDeptId',
    displayable: true,
    compType: 'ownerDept',
    parentType: 'SYSTEM_COMPS',
    title: 'Department',
    subFormId: null,

    fromRaw: false,
    data: {
      name: 'Department',
      hideRule: { label: false, value: '' },
      unitSelectionRange: {
        dept: ['1'],
        role: ['2'],
        deptCtrl: ['3'],
        other: ['-1'],
      },
    },
  },
];

const injectedSystemControlData = systemControlData.map((basicItem, i) => ({
  ...basicItem,
  data: {
    ...basicItem.data,
    sequenceNumber: i,
    formId: '111',
  },
}));
const initBasicServeData = {
  createDateTimeControl: null,
  creatorControl: null,
  updateDateTimeControl: null,
  serialNumberControl: null,
  ownerControl: null,
  ownerDeptControl: null,
};
let basicServeData = initBasicServeData;
afterEach(() => {
  basicServeData = {
    createDateTimeControl: null,
    creatorControl: null,
    updateDateTimeControl: null,
    serialNumberControl: null,
    ownerControl: null,
    ownerDeptControl: null,
  };
});

describe('adapt system control data', () => {
  const adaptedSystemData = adaptSystemControlData(injectedSystemControlData, { formId: '111' });
  it('adapt createTime control data', () => {
    const expectedCreateTimeData = {
      id: 'e3d2acb1-2170-11ea-abbd-1fe4758f58d2',
      displayRule: '',

      sequenceNumber: 1,
      formTemplateId: '111',
      subFormTemplateId: null,
      name: '创建时间',
      code: undefined,
      controlType: 19,
      controlGroupType: 3,

      visible: false,
      createUserId: '',
      updateUserId: '',
      createDateTime: '',
      updateDateTime: '',
      auditStat: null,
    };
    expect(adaptedSystemData.createDateTimeControlDto).toMatchObject(expectedCreateTimeData);

    // parse
    basicServeData.createDateTimeControl = expectedCreateTimeData;
    const parsedBasicData = parseSystemControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(systemControlData[1]);
  });

  it('adapt updateTime control data', () => {
    const expectedUpdateTimeData = {
      id: 'e45dd5b2-2170-11ea-abbd-1fe4758f58d2',
      displayRule: '',

      sequenceNumber: 2,
      formTemplateId: '111',
      subFormTemplateId: null,
      name: '修改时间',
      code: undefined,
      controlType: 20,
      controlGroupType: 3,

      visible: false,
      createUserId: '',
      updateUserId: '',
      createDateTime: '',
      updateDateTime: '',
      auditStat: null,
    };
    expect(adaptedSystemData.updateDateTimeControlDto).toMatchObject(expectedUpdateTimeData);

    // parse
    basicServeData.updateDateTimeControl = expectedUpdateTimeData;
    const parsedBasicData = parseSystemControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(systemControlData[2]);
  });
  it('adapt creator control data', () => {
    const expectedCreatorData = {
      id: 'acd363d0-2170-11ea-abbd-1fe4758f58d2',
      displayRule: '',

      sequenceNumber: 0,
      formTemplateId: '111',
      subFormTemplateId: null,
      name: '创建人',
      code: undefined,
      controlType: 18,
      controlGroupType: 3,

      visible: false,
      createUserId: '',
      updateUserId: '',
      createDateTime: '',
      updateDateTime: '',
      auditStat: null,
    };
    expect(adaptedSystemData.creatorControlDto).toMatchObject(expectedCreatorData);

    // parse
    basicServeData.creatorControl = expectedCreatorData;
    const parsedBasicData = parseSystemControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(systemControlData[0]);
  });
  it('adapt serialNo control data', () => {
    const expectedSerialNoData = {
      id: '13de5f90-2b75-11ea-8a33-d7f624102879',

      seqNoStructure:
        'Type:1,Value:YYYY;Type:2,IncreNum:8,Value:1;Type:3,Value:f;Type:4,Value:F0000012,Label:课程',

      sequenceNumber: 3,
      formTemplateId: '111',
      subFormTemplateId: null,

      name: '流水号',
      code: 'SerialNumber',
      controlType: 17,
      controlGroupType: 3,

      visible: false,
      createUserId: '',
      updateUserId: '',
      createDateTime: '',
      updateDateTime: '',
      auditStat: null,
    };
    expect(adaptedSystemData.serialNumberControlDto).toMatchObject(expectedSerialNoData);

    // parse
    basicServeData.serialNumberControl = expectedSerialNoData;
    const parsedBasicData = parseSystemControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(systemControlData[3]);
  });
  it('adapt owner control data', () => {
    const expectedOwnerData = {
      id: '13de5f90-2b75-11ea-8a33-d7f624103879',

      displayRule: '',

      unitSelectionRange: 'Dept:1;Role:2;DeptControl:3;Other:-1;',
      deptMappingField: '0',
      genderMappingField: '0',
      emailMappingField: '0',
      mobileMappingField: '0',

      sequenceNumber: 4,
      formTemplateId: '111',
      subFormTemplateId: null,

      name: 'Owner',
      code: 'OwnerId',
      controlType: 29,
      controlGroupType: 3,

      visible: false,
      createUserId: '',
      updateUserId: '',
      createDateTime: '',
      updateDateTime: '',
      auditStat: null,
    };
    expect(adaptedSystemData.ownerControlDto).toMatchObject(expectedOwnerData);

    // parse
    basicServeData.ownerControl = expectedOwnerData;
    const parsedBasicData = parseSystemControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(systemControlData[4]);
  });
  it('adapt ownerDept control data', () => {
    const expectedOwnerDeptData = {
      id: '13de5f90-2b75-11ea-8a33-d7f624104879',

      displayRule: '',

      unitSelectionRange: 'Dept:1;Role:2;DeptControl:3;Other:-1;',

      sequenceNumber: 5,
      formTemplateId: '111',
      subFormTemplateId: null,

      name: 'Department',
      code: 'OwnerDeptId',
      controlType: 30,
      controlGroupType: 3,

      visible: false,
      createUserId: '',
      updateUserId: '',
      createDateTime: '',
      updateDateTime: '',
      auditStat: null,
    };
    expect(adaptedSystemData.ownerDeptControlDto).toMatchObject(expectedOwnerDeptData);

    // parse
    basicServeData.ownerDeptControl = expectedOwnerDeptData;
    const parsedBasicData = parseSystemControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(systemControlData[5]);
  });
});
