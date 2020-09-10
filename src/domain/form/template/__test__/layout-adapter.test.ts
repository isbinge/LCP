import { adaptLayoutControlData, parseLayoutControlData } from '../layout/adapter/index';

const layoutControlData = [
  {
    id: '59a0c8d0-216e-11ea-bb4d-b12663c620f2',
    compType: 'groupTitle',
    displayable: true,
    subFormId: null,
    parentType: 'LAYOUT_COMPS',
    title: '分组标题',
    fromRaw: false,
    data: {
      name: '分组标题',
      alignment: 'left',
    },
  },
  {
    id: '5d772532-216e-11ea-bb4d-b12663c620f2',
    compType: 'description',
    displayable: true,
    subFormId: null,
    parentType: 'LAYOUT_COMPS',
    title: '描述说明',
    fromRaw: false,
    data: {
      description: '描述',
      name: '描述说明',
    },
  },
];

const injectedLayoutControlData = layoutControlData.map((basicItem, i) => ({
  ...basicItem,
  data: {
    ...basicItem.data,
    sequenceNumber: i,
    formId: '111',
  },
}));
const initBasicServeData = {
  descriptionControls: [],
  groupTitleControls: [],
  subFormTemplates: [],
};
let basicServeData = initBasicServeData;
afterEach(() => {
  basicServeData = {
    descriptionControls: [],
    groupTitleControls: [],
    subFormTemplates: [],
  };
});

describe('adapt layout control data', () => {
  const adaptedLayoutData = adaptLayoutControlData(injectedLayoutControlData);
  it('adapt grouptitle control data', () => {
    const expectedGrouptileControlData = [
      {
        id: '59a0c8d0-216e-11ea-bb4d-b12663c620f2',
        alignment: 'left',

        sequenceNumber: 0,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '分组标题',
        code: undefined,
        controlType: 13,
        controlGroupType: 2,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedLayoutData.groupTitleControlDtos[0]).toMatchObject(
      expectedGrouptileControlData[0],
    );

    // parse
    basicServeData.groupTitleControls = expectedGrouptileControlData;
    const parsedBasicData = parseLayoutControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(layoutControlData[0]);
  });

  it('adapt description control data', () => {
    const expectedDescriptionData = [
      {
        id: '5d772532-216e-11ea-bb4d-b12663c620f2',
        content: '描述',

        sequenceNumber: 1,
        formTemplateId: '111',
        subFormTemplateId: null,
        name: '描述说明',
        code: undefined,
        controlType: 15,
        controlGroupType: 2,

        visible: false,
        createUserId: '',
        updateUserId: '',
        createDateTime: '',
        updateDateTime: '',
        auditStat: null,
      },
    ];
    expect(adaptedLayoutData.descriptionControlDtos[0]).toMatchObject(expectedDescriptionData[0]);

    // parse
    basicServeData.descriptionControls = expectedDescriptionData;
    const parsedBasicData = parseLayoutControlData(basicServeData);
    expect(parsedBasicData[0]).toMatchObject(layoutControlData[1]);
  });
});
