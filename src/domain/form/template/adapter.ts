import sortBy from 'lodash/sortBy';
import zipObject from 'lodash/zipObject';
import flatten from 'lodash/flatten';

import { DndItemType } from '@/constants';
import { formItemControlTypeMap, FormItemControlType } from '@/constants/form/common';
import { controlGroupTypes } from '@/constants/form/comp-defs';
import { adaptBasicControlData, parseBasicControlData } from './basic/adapter';
import { adaptSystemControlData, parseSystemControlData } from './system/adapter';
import { adaptLayoutControlData, parseLayoutControlData } from './layout/adapter';
import { adaptAdvanceControlData, parseAdvanceControlData } from './advanced/adapter';
import { FormItemSpec } from './model';
import { systemDefaultSequenceNumberMap } from './common';
import {
  FormProperties,
  AdvancedCtrlType,
  BasicCtrlType,
  SystemCtrlType,
  LayoutCtrlType,
  CommonCtrlProperties,
} from './adapter-type.d';

const mapToCompType = (definition: { controlType: FormItemControlType }) =>
  formItemControlTypeMap[definition.controlType];
const mapToControlType = (definition: { controlType: FormItemControlType }) =>
  definition.controlType;

export function isSystemCompType(compType: Lcp.FormItem.System) {
  return controlGroupTypes[DndItemType.form.SYSTEM_COMPS].map(mapToCompType).includes(compType);
}
export function isSystemControlType(controlType: FormItemControlType) {
  return controlGroupTypes[DndItemType.form.SYSTEM_COMPS]
    .map(mapToControlType)
    .includes(controlType);
}
export function isLayoutCompType(compType: Lcp.FormItem.Layout) {
  return controlGroupTypes[DndItemType.form.LAYOUT_COMPS].map(mapToCompType).includes(compType);
}
export function isLayoutControlType(controlType: FormItemControlType) {
  return controlGroupTypes[DndItemType.form.LAYOUT_COMPS]
    .map(mapToControlType)
    .includes(controlType);
}

export function isBasicCompType(compType: Lcp.FormItem.Basic) {
  return controlGroupTypes[DndItemType.form.BASIC_COMPS].map(mapToCompType).includes(compType);
}
export function isBasicControlType(controlType: FormItemControlType) {
  return controlGroupTypes[DndItemType.form.BASIC_COMPS]
    .map(mapToControlType)
    .includes(controlType);
}

export function isAdvanceCompType(compType: Lcp.FormItem.Advanced) {
  return controlGroupTypes[DndItemType.form.ADVANCED_COMPS].map(mapToCompType).includes(compType);
}
export function isAdvanceControlType(controlType: FormItemControlType) {
  return controlGroupTypes[DndItemType.form.ADVANCED_COMPS]
    .map(mapToControlType)
    .includes(controlType);
}
export function getDragTypeFromFormSpec(compType: Lcp.FormItem.All) {
  if (isBasicCompType(compType as Lcp.FormItem.Basic)) {
    return DndItemType.form.BASIC_COMPS;
  }
  if (isSystemCompType(compType as Lcp.FormItem.System)) {
    return DndItemType.form.SYSTEM_COMPS;
  }
  if (isLayoutCompType(compType as Lcp.FormItem.Layout)) {
    return DndItemType.form.LAYOUT_COMPS;
  }
  if (isAdvanceCompType(compType as Lcp.FormItem.Advanced)) {
    return DndItemType.form.ADVANCED_COMPS;
  }
  return '';
}

/**
 * any: 适配各种类型的数据对象
 * @deprecated 应改用详细的类型定义
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommonRecord = Record<string, any>;

export const injectFormDataFor = (controlData: FormItemSpec[], formId: string) => {
  const injectedControlData: Array<FormItemSpec> = [];
  injectedControlData.push(
    ...controlData
      .filter((controlItem) => controlItem.displayable)
      .map((controlItem, sequenceNumber) => ({
        ...controlItem,
        data: {
          ...controlItem.data,
          sequenceNumber,
          formId,
        },
      })),
  );
  injectedControlData.push(
    ...controlData
      .filter((controlItem) => !controlItem.displayable)
      .map((controlItem) => ({
        ...controlItem,
        data: {
          ...controlItem.data,
          sequenceNumber: systemDefaultSequenceNumberMap[controlItem.compType],
          formId,
        },
      })),
  );

  return injectedControlData;
};

/**
 * 将本地表单数据转换为json对象
 * @param formConfigData
 * @param controlData
 * @param extraParams
 */
export function adaptFormData(
  formConfigData: Lcp.FormDataType.Form,
  controlData: Array<FormItemSpec>,
  extraParams: { appId: string; currentUserId: string },
) {
  const {
    id,
    name,
    iconCss,
    dataTitle,
    openFormDynamic,
    openTaskNotification,
    displayToMobile,
    displayToPc,
  } = formConfigData;
  const injectedControlData = injectFormDataFor(controlData, formConfigData.id);
  const basicControlData = adaptBasicControlData(
    injectedControlData.filter((controlItem) =>
      isBasicCompType(controlItem.compType as Lcp.FormItem.Basic),
    ),
  );
  const layoutControlData = adaptLayoutControlData(
    injectedControlData.filter((controlItem) =>
      isLayoutCompType(controlItem.compType as Lcp.FormItem.Layout),
    ),
  );
  const systemControlData = adaptSystemControlData(
    injectedControlData.filter((controlItem) =>
      isSystemCompType(controlItem.compType as Lcp.FormItem.System),
    ),
    {
      formId: formConfigData.id,
    },
  );
  const advanceControlData = adaptAdvanceControlData(
    injectedControlData.filter((controlItem) =>
      isAdvanceCompType(controlItem.compType as Lcp.FormItem.Advanced),
    ),
  );
  return {
    id,
    appId: extraParams.appId,
    name,
    code: formConfigData.code || null,
    groupId: formConfigData.groupId || null,
    iconCss,
    dataTitle: dataTitle.join(';'),
    openFormDynamic,
    openTaskNotification,
    displayToMobile,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    displayToPC: displayToPc,
    currentUserId: extraParams.currentUserId,
    createUserId: formConfigData.createUserId || null,
    updateUserId: formConfigData.updateUserId || null,
    createDateTime: formConfigData.createDateTime || null,
    updateDateTime: formConfigData.updateDateTime || null,
    auditStat: formConfigData.auditStat,
    ...basicControlData,
    ...layoutControlData,
    ...systemControlData,
    ...advanceControlData,
  };
}

/* -----------------------------------将json格式数据转化为本地表单数据---------------------------------------- */
interface CtrlNameCategory {
  rawBasicCtrlNames: Array<keyof BasicCtrlType>;
  rawSystemCtrlNames?: Array<keyof SystemCtrlType>;
  rawLayoutCtrlNames?: Array<keyof LayoutCtrlType>;
  rawAdvanceCtrlNames: Array<keyof AdvancedCtrlType>;
}
const ctrlNameCategory: CtrlNameCategory = {
  rawBasicCtrlNames: [
    'singleLineInputControls',
    'checkboxGroupControls',
    'dateTimeControls',
    'numberInputControls',
    'checkboxControls',
    'selectControls',
    'switchControls',
    'textAreaInputControls',
    'staffSingleSelectControls',
    'staffMultiSelectControls',
    'deptSingleSelectControls',
    'deptMultiSelectControls',
  ],
  rawSystemCtrlNames: [
    'creatorControl',
    'updateDateTimeControl',
    'serialNumberControl',
    'createDateTimeControl',
    'ownerControl',
    'ownerDeptControl',
  ],
  rawLayoutCtrlNames: ['descriptionControls', 'groupTitleControls', 'subFormTemplates'],
  rawAdvanceCtrlNames: [
    'associatedWithAttributeControls',
    'associatedWithFormControls',
    'associatedWithFormMultiSelectControls',
  ],
};
export function parseFormData(serverFormData: FormProperties) {
  const formSpec = {
    id: serverFormData.id,
    name: serverFormData.name,
    code: serverFormData.code,
    groupId: serverFormData.groupId,
    iconCss: serverFormData.iconCss,
    dataTitle: serverFormData.dataTitle.split(';'),
    openFormDynamic: serverFormData.openFormDynamic,
    openTaskNotification: serverFormData.openTaskNotification,
    displayToMobile: serverFormData.displayToMobile,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    displayToPC: serverFormData.displayToPc,
    createUserId: serverFormData.createUserId,
    updateUserId: serverFormData.updateUserId,
    createDateTime: serverFormData.createDateTime,
    updateDateTime: serverFormData.updateDateTime,
    auditStat: serverFormData.auditStat,
  };

  return {
    formSpec,
    formItemSpecs: sortFormItemSpecs(serverFormData, ctrlNameCategory),
  };
}

export function sortFormItemSpecs(
  serverFormData: CommonRecord,
  rawCtrlNameCategory: CtrlNameCategory,
) {
  const getIdSequenceNoPairs = (
    ctrlProperties: CommonCtrlProperties,
  ): { id: string; sequenceNumber: number } => ({
    id: ctrlProperties.id,
    sequenceNumber: ctrlProperties.sequenceNumber,
  });

  const basicControlData = zipObject(
    rawCtrlNameCategory.rawBasicCtrlNames,
    rawCtrlNameCategory.rawBasicCtrlNames.map((ctrlName) => serverFormData[ctrlName]),
  ) as BasicCtrlType;

  const advanceControlData = zipObject(
    rawCtrlNameCategory.rawAdvanceCtrlNames,
    rawCtrlNameCategory.rawAdvanceCtrlNames.map((ctrlName) => serverFormData[ctrlName]),
  ) as AdvancedCtrlType;

  const pendingFormItemSpecs = flatten(
    [parseBasicControlData(basicControlData), parseAdvanceControlData(advanceControlData)]
      .concat(
        rawCtrlNameCategory.rawSystemCtrlNames
          ? parseSystemControlData(
              zipObject(
                rawCtrlNameCategory.rawSystemCtrlNames,
                rawCtrlNameCategory.rawSystemCtrlNames.map((ctrlName) => serverFormData[ctrlName]),
              ) as SystemCtrlType,
            )
          : [],
      )
      .concat(
        rawCtrlNameCategory.rawLayoutCtrlNames
          ? parseLayoutControlData(
              zipObject(
                rawCtrlNameCategory.rawLayoutCtrlNames,
                rawCtrlNameCategory.rawLayoutCtrlNames.map((ctrlName) => serverFormData[ctrlName]),
              ) as LayoutCtrlType,
            )
          : [],
      ),
  );

  const systemCategories = [];

  if (serverFormData.serialNumberControl) {
    systemCategories.push(getIdSequenceNoPairs(serverFormData.serialNumberControl));
  }
  if (serverFormData.creatorControl) {
    systemCategories.push(getIdSequenceNoPairs(serverFormData.creatorControl));
  }
  if (serverFormData.updateDateTimeControl) {
    systemCategories.push(getIdSequenceNoPairs(serverFormData.updateDateTimeControl));
  }
  if (serverFormData.createDateTimeControl) {
    systemCategories.push(getIdSequenceNoPairs(serverFormData.createDateTimeControl));
  }
  if (serverFormData.ownerControl) {
    systemCategories.push(getIdSequenceNoPairs(serverFormData.ownerControl));
  }
  if (serverFormData.ownerDeptControl) {
    systemCategories.push(getIdSequenceNoPairs(serverFormData.ownerDeptControl));
  }
  const pendingToSortCtrl = flatten(
    [
      serverFormData.singleLineInputControls.map(getIdSequenceNoPairs),
      serverFormData.checkboxGroupControls.map(getIdSequenceNoPairs),
      serverFormData.dateTimeControls.map(getIdSequenceNoPairs),
      serverFormData.numberInputControls.map(getIdSequenceNoPairs),
      serverFormData.checkboxControls.map(getIdSequenceNoPairs),
      serverFormData.selectControls.map(getIdSequenceNoPairs),
      serverFormData.switchControls.map(getIdSequenceNoPairs),
      serverFormData.textAreaInputControls.map(getIdSequenceNoPairs),
      serverFormData.staffSingleSelectControls.map(getIdSequenceNoPairs),
      serverFormData.staffMultiSelectControls.map(getIdSequenceNoPairs),
      serverFormData.deptSingleSelectControls.map(getIdSequenceNoPairs),
      serverFormData.deptMultiSelectControls.map(getIdSequenceNoPairs),

      serverFormData.associatedWithAttributeControls.map(getIdSequenceNoPairs),
      serverFormData.associatedWithFormControls.map(getIdSequenceNoPairs),
      serverFormData.associatedWithFormMultiSelectControls.map(getIdSequenceNoPairs),
    ]
      .concat(
        rawCtrlNameCategory.rawLayoutCtrlNames
          ? [
              ...serverFormData.descriptionControls.map(getIdSequenceNoPairs),
              ...serverFormData.groupTitleControls.map(getIdSequenceNoPairs),
              ...serverFormData.subFormTemplates.map(getIdSequenceNoPairs),
            ]
          : [],
      )
      .concat(rawCtrlNameCategory.rawSystemCtrlNames ? systemCategories : []),
  );

  const sortedFormItemSpecs: FormItemSpec[] = [];
  sortBy(
    pendingToSortCtrl.filter((item) => item.sequenceNumber >= 0),
    ['sequenceNumber'],
  ).forEach(({ id }) => {
    sortedFormItemSpecs.push(pendingFormItemSpecs.find((item) => item.id === id) as FormItemSpec);
  });
  // 追加系统控件
  pendingToSortCtrl
    .filter((item) => item.sequenceNumber < 0)
    .forEach(({ id }) => {
      sortedFormItemSpecs.push(pendingFormItemSpecs.find((item) => item.id === id) as FormItemSpec);
    });

  return sortedFormItemSpecs;
}
