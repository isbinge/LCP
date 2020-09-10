import React from 'react';
import dayjs from 'dayjs';
import { v1 as uuidv1 } from 'uuid';
import { flatMap, pick, omit } from 'lodash';
import { FormattedMessage as FM } from 'react-intl';

import {
  isLayoutControlType,
  isAdvanceControlType,
  isBasicControlType,
} from '@/domain/form/template/adapter';
import { FormItemControlType } from '@/constants/form/common';
import { dateFormatCompatMap } from '@/domain/form/template/common';
import LcpIntl from '@/utils/locale';

import FormRecordData from '@/domain/form/instance/data.d';
import type { CommonCtrlProperties } from '@/domain/form/template/adapter-type.d';
import type { GroupTitleMappings } from '@/domain/form/instance/schema-type';
import type { DescriptionControl } from '@/domain/form/template/layout/adapter/adapter-type.d';
import type {
  DateControl,
  NumberInputControl,
} from '@/domain/form/template/basic/adapter/adapter-type.d';
import type {
  SubFormServeDataType,
  FormSchemaData,
  SubFormRecord,
  SubFormState,
  SubFormFieldValueType,
  DataLinkageSchema,
} from '@/pages/form/record/collect/shared/form-schema.d';
import { AssocFormControl } from '@/domain/form/template/advanced/adapter/adapter-type';
import { OwnerControl, OwnerDeptControl } from '@/domain/form/template/system/adapter/adapter-type';

export const subFormControls = [
  'singleLineInputControls',
  'textAreaInputControls',
  'numberInputControls',
  'dateTimeControls',
  'checkboxControls',
  'checkboxGroupControls',
  'selectControls',
  'switchControls',
  'associatedWithFormControls',
  'associatedWithAttributeControls',
  'associatedWithFormMultiSelectControls',
];

export const Mode = {
  CENTER: 'center',
  FULLSCREEN: 'fullScreen',
};

export const getGroupTitleMappings = (formSchemaData: FormSchemaData[]) => {
  const groupTitleMappings: GroupTitleMappings = {};
  const fieldNames = formSchemaData.map((item) => item.code || item.id);
  const groupTitleIds = formSchemaData
    .filter((item) => item.controlType === FormItemControlType.GROUP_TITLE)
    .map((gt) => gt.id);

  groupTitleIds.forEach((groupTitleId, index) => {
    const nextGroupTitle = groupTitleIds[index + 1];
    const start = fieldNames.indexOf(groupTitleId) + 1;
    const end = nextGroupTitle ? fieldNames.indexOf(nextGroupTitle) : fieldNames.length;
    groupTitleMappings[groupTitleId] = fieldNames.slice(start, end);
  });
  return groupTitleMappings;
};

export const getDataLinkageMappings = (formSchemaData: FormSchemaData[]) => {
  const dataLinkageMappings = {};
  const createDataLinkageMappings = (item: DataLinkageSchema, subFormCode?: string) => {
    const conditions = item.dataLinkCondition.split(';').map((condition) => condition.split(':'));
    const conditionCode = conditions.map(([currentFieldCode, linkageFieldCode]) => ({
      currentFieldCode,
      linkageFieldCode,
    }));

    const keys: string[] = [];

    conditionCode.forEach((code) => {
      if (!keys.includes(code.currentFieldCode)) {
        keys.push(code.currentFieldCode);
      }
    });

    const info = {
      conditionCode,
      filledFieldCode: subFormCode ? `${subFormCode},${item.code}` : item.code,
      dataLinkageResult: item.dataLinkResult,
      dataLinkageSchemaCode: item.dataLinkSchemaCode,
    };

    keys.forEach((key) => {
      if (dataLinkageMappings[key]) {
        dataLinkageMappings[key].push(info);
      } else {
        dataLinkageMappings[key] = [info];
      }
    });
  };
  formSchemaData.forEach((item) => {
    // 主表
    if ((item as DataLinkageSchema).dataLinkSchemaCode) {
      createDataLinkageMappings(item as DataLinkageSchema);
    }
    // 子表
    if (item.subFormTemplateId) {
      const parsedSubFormData = flatMap(pick(item as SubFormServeDataType, subFormControls));
      parsedSubFormData.forEach((data) => {
        if (data?.dataLinkSchemaCode) {
          createDataLinkageMappings((data as unknown) as DataLinkageSchema, item.code);
        }
      });
    }
  });
  return dataLinkageMappings;
};

export const getAssocFormMappings = (formSchema: FormSchemaData[]) => {
  const assocFormMappings = {};
  const createAssocFormMapping = (item: AssocFormControl, subFormCode?: string) => {
    const code = subFormCode ? `${subFormCode},${item.code}` : item.code;
    if (item.mappingControls || item.mappingProperties) {
      assocFormMappings[code] = {
        schemaCode: item.schemaCode,
        schemaId: item.schemaId,
        subFormTemplateId: item.subFormTemplateId,
        mappingControls: item.mappingControls.split(';'),
        mappingProperties: item.mappingProperties.split(';'),
      };
    }
  };

  formSchema.forEach((item) => {
    if (item.controlType === FormItemControlType.ASSOC_FORM) {
      createAssocFormMapping(item as AssocFormControl);
    }
    if (item.subFormTemplateId) {
      const parsedSubFormData = (flatMap(
        pick(item as SubFormServeDataType, subFormControls),
      ) as unknown) as FormSchemaData[];
      parsedSubFormData.forEach((data) => {
        if (data.controlType === FormItemControlType.ASSOC_FORM) {
          createAssocFormMapping(data as AssocFormControl, item.code);
        }
      });
    }
  });

  return assocFormMappings;
};

type CtrlDataTypeForServer = {
  controlCode: string;
  controlType: number;
  value: unknown;
};
type ConvertedSubFormForServer = {
  subFormTemplateId: string;
  subFormTemplateCode: string;
  subFormDataItemDtoList: {
    objectId: string;
    dataList: CtrlDataTypeForServer[];
  }[];
};
interface ConvertedFormDataForServer {
  dataList: CtrlDataTypeForServer[];
  subFormDataDtoList: ConvertedSubFormForServer[];
}

export const convertFormStateToServer = (
  formState: FormRecordData.FormState,
  formSchemaData: FormSchemaData[],
) => {
  const { intl } = LcpIntl;
  const convertedFormData: ConvertedFormDataForServer = {
    dataList: [],
    subFormDataDtoList: [],
  };
  const layoutDataCodes = formSchemaData
    .filter((item) => isLayoutControlType(item.controlType))
    .map((lc) => lc.code);
  const basicAndAdvanceDataCodes = formSchemaData
    .filter(
      (item) => isBasicControlType(item.controlType) || isAdvanceControlType(item.controlType),
    )
    .map((bc) => bc.code);

  const findCode = (formData: FormSchemaData[], code: string) =>
    formData.find((item) => item.code === code);

  const getConvertedCtrlData = (
    controlData: FormSchemaData,
    code: string,
    value: FormRecordData.FormStateValue | SubFormFieldValueType,
  ) => {
    let adaptedValue;
    if (controlData && controlData.controlType === FormItemControlType.SWITCH) {
      adaptedValue = intl.formatMessage({
        id: value ? 'forminst.schema.switch.yes' : 'forminst.schema.switch.no',
      });
    } else if (
      controlData &&
      (controlData.controlType === FormItemControlType.ASSOC_FORM ||
        controlData.controlType === FormItemControlType.ASSOC_FORM_MULTI_SELECT ||
        controlData.controlType === FormItemControlType.OWNER ||
        controlData.controlType === FormItemControlType.OWNER_DEPARTMENT)
    ) {
      adaptedValue = value ? JSON.stringify(value) : null;
    } else if (controlData && controlData.controlType === FormItemControlType.ASSOC_ATTR) {
      // 关联属性不需要传值 ，值由服务端自动生成
      adaptedValue = null;
    } else {
      adaptedValue = Array.isArray(value) ? value.join(';') : value;
    }
    return {
      controlCode: controlData.code,
      controlType: controlData.controlType,
      value: adaptedValue,
    };
  };
  Object.entries(formState).forEach(([code, value]) => {
    if (basicAndAdvanceDataCodes.includes(code)) {
      const controlData = findCode(formSchemaData, code);

      if (!controlData) {
        return;
      }

      convertedFormData.dataList.push(getConvertedCtrlData(controlData, code, value));
    }
    if (layoutDataCodes.includes(code)) {
      const layoutControlData = findCode(formSchemaData, code);
      if (!layoutControlData) {
        return;
      }
      const subFormData = value;
      const parsedSubFormData = (flatMap(
        pick(layoutControlData as SubFormServeDataType, subFormControls),
      ) as unknown) as FormSchemaData[];
      const subFormDataItemDtoList = (subFormData as SubFormState).dataSource.map((item) => {
        const codes = omit(item, ['key']);
        const dataList = Object.entries(codes).map(([subFormCtrlCode, subFormCtrlValue]) => {
          const subFormCtrlData = findCode(parsedSubFormData, subFormCtrlCode) as FormSchemaData;
          return getConvertedCtrlData(subFormCtrlData, subFormCtrlCode, subFormCtrlValue);
        });
        return { objectId: item.key, dataList };
      });

      convertedFormData.subFormDataDtoList.push({
        subFormTemplateId: layoutControlData.subFormTemplateId as string,
        subFormTemplateCode: layoutControlData.code,
        subFormDataItemDtoList,
      });
    }
  });

  return convertedFormData;
};

const getDefaultValueForCtrl = (item: FormSchemaData, defaultProp: string, isExamine?: boolean) => {
  switch (item.controlType) {
    case FormItemControlType.SWITCH: {
      return item[defaultProp] && item[defaultProp].toLowerCase() === 'true';
    }
    case FormItemControlType.CHECKBOX: {
      let checkboxValue;
      if (isExamine) {
        checkboxValue = item[defaultProp];
      } else {
        checkboxValue = item[defaultProp] ? (item[defaultProp] as string).split(';') : [];
      }
      return checkboxValue;
    }
    case FormItemControlType.DESCRIPTION: {
      return (item as DescriptionControl).content || <FM id="dict.description" />;
    }
    case FormItemControlType.DATE: {
      if (isExamine) {
        return item[defaultProp]
          ? dayjs
              .fromUtc(item[defaultProp])
              .format(dateFormatCompatMap[(item as DateControl).dateTimeMode])
          : null;
      }
      return item[defaultProp];
    }
    case FormItemControlType.CREATE_TIME:
    case FormItemControlType.MODIFY_TIME: {
      return item[defaultProp] ? (
        dayjs.fromUtc(item[defaultProp]).formatToYMDHM()
      ) : (
        <FM id="forminst.common.gen-by-sys" />
      );
    }
    case FormItemControlType.SUBFORM: {
      if (defaultProp === 'defaultValue') {
        return {
          selectedRowKeys: [],
          dataSource: [getSubFormInitRecord(item as SubFormServeDataType, defaultProp)],
        };
      }
      const rawDataSource = (item as SubFormServeDataType).subFormTemplateDataItems || [];

      return {
        selectedRowKeys: [],
        dataSource: rawDataSource.map((ctrlData) => ({
          key: ctrlData.objectId,
          ...ctrlData.codeValueDic,
        })),
      };
    }

    case FormItemControlType.NUMBER: {
      if (isExamine) {
        let numberToFormat = (item[defaultProp] - 0).toFixed(
          (item as NumberInputControl).decimalPlaces,
        );
        if ((item as NumberInputControl).showThousandthSeparator) {
          numberToFormat = numberToFormat.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return item[defaultProp] ? numberToFormat : null;
      }
      return item[defaultProp] ? item[defaultProp] : null;
    }
    case FormItemControlType.OWNER_DEPARTMENT:
    case FormItemControlType.OWNER:
    case FormItemControlType.CREATOR: {
      return (item as OwnerControl | OwnerDeptControl).value;
    }
    default: {
      return item[defaultProp] ? item[defaultProp] : null;
    }
  }
};
export function getSubFormInitRecord(subFormServerData: SubFormServeDataType, defaultProp: string) {
  const parsedSubFormData = (flatMap(
    pick(subFormServerData, subFormControls),
  ) as unknown) as FormSchemaData[];
  const initialRecord: Partial<SubFormRecord> = {};
  parsedSubFormData.forEach((sf: CommonCtrlProperties) => {
    initialRecord[sf.code] = getDefaultValueForCtrl(sf, defaultProp);
  });
  return { ...initialRecord, key: uuidv1() };
}

export const getInitialValues = (
  formSchemaData: FormSchemaData[],
  pickedProp: string,
  isExamine?: boolean,
) => {
  const initialValues: Record<string, unknown> = {};

  formSchemaData.forEach((item) => {
    initialValues[item.code || item.id] = getDefaultValueForCtrl(item, pickedProp, isExamine);
  });
  return initialValues;
};
