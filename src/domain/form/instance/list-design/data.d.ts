import { SortMethod, MassOpts, ListDisplayMode } from '@/constants/list-design/enum';
import { FormItemControlType } from '@/constants/form/common';

declare namespace ListDesignData {
  interface QueryItemGet extends QueryItemBase {
    formTemplateListViewSettingId: string;
    controlType: FormItemControlType;
    parentDisplayName: string | null;
    displayName: string;
    associationSchemaCode: string | null;
    associationSchemaId: string | null;
    associationSchemaFiledCode: string | null;
    allowNull: true;
    optionalValues: string | null;
    createUserId: string;
    updateUserId: string;
    createDateTime: string;
    updateDateTime: string;
    auditStat: number;
  }
  interface QueryItemUpdate extends QueryItemBase {}
  interface Property {
    displayName: string;
    code: string;
    queryItemId: string;
    controlType: FormItemControlType;
    optionalValues: string | null;
    associationSchemaCode: string | null;
    associationSchemaId: string | null;
    associationSchemaFiledCode: string | null;
    isChildSchema: boolean;
    childProperties: Property[] | null;
    $$parentName?: string;
  }
  interface GetListSettingDto extends ListSettingDtoBase {
    id: string;
    formTemplateId: string;
    defaultDisplaySubFormTemplateName: string | null;
    orderByFieldName: string;
    pictureName: string | null;
    startTimeName: string;
    endTimeName: string;
    timelineAxisName: string;
    updateUserId: string;
    createDateTime: string;
    updateDateTime: string;
    auditStat: number;
    queryItems: QueryItemGet[];
    propertys: Property[];
    columns: ColumnGet[];
    actions: Action[];
  }

  interface UpdateListSettingDto extends ListSettingDtoBase {
    // 1;2;3
    defaultDisplaySubFormTemplateName: string | null;
    currentUserId: string;
    orderByFieldCode: string;
    orderByDirection: number;
    pictureCode: string | null;
    startTimeCode: string;
    startTimeName: string;
    endTimeCode: string;
    endTimeName: string;
    timelineAxisCode: string;
    timelineAxisName: string;
    createUserId: string;
    updateUserId: string;
    createDateTime: string;
    updateDateTime: string;
    auditStat: number;
    queryItemDtos: QueryItemUpdate[];
    columnDtos: ColumnUpdate[];
  }

  interface ListSettingLocal {
    optionalDisplayMode: ListDisplayMode[];
    webDisplayMode: string;
    mobileDisplayMode: string;
    massOperation: MassOpts;
    sortByField: string;
    sortMethod: SortMethod;
  }

  interface GetFormRecordSettingsPayload {
    formTplId: string;
  }

  interface UpdateFormRecordSettingsPayload {
    formTplId: string;
    fieldSettings: {
      searchConditions: string[];
      listFields: string[];
    };
    listSettings: ListSettingLocal;
  }

  interface ColumnGet extends ColumnBase {
    sequenceNumber: number;
    formTemplateListViewSettingId: string;
    propertyName: string;
    parentDisplayName: string | null;
    displayName: string;
    createUserId: string;
    updateUserId: string;
    createDateTime: string;
    updateDateTime: string;
    auditStat: number;
    childColumns: ColumnGet[] | null;
  }
}

/**
 * NOT EXPORTING
 */

interface QueryItemBase {
  id: string;
  defaultValue: string;
  filterValue: string | null;
  visible: boolean;
}

interface ColumnBase {
  id: string;
  visible: boolean;
}

interface ColumnUpdate extends ColumnBase {}

interface Action {
  id: string;
  formTemplateListViewSettingId: string;
  actionCode: string;
  displayName: string;
  iconCss: string;
  sequenceNumber: number;
  createUserId: string;
  updateUserId: string;
  createDateTime: string;
  updateDateTime: string;
  auditStat: number;
}

interface ListSettingDtoBase {
  // 1;2;3
  optionalDisplayModel: string;
  pcDefaultDisplayModel: number;
  mobileDefaultDisplayModel: number;
  allowBatchOperation: boolean;
  defaultDisplaySubFormTemplateId: string | null;
  orderByFieldCode: string;
  orderByDirection: number;
  pictureCode: string | null;
  startTimeCode: string;
  endTimeCode: string;
  timelineAxisCode: string;
  createUserId: string;
}

export default ListDesignData;
