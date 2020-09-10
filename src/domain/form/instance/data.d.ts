import { SubFormState } from '@/pages/form/record/collect/shared/form-schema';
import { FormItemControlType } from '@/constants/form/common';

declare namespace FormRecordData {
  type FormStateValue =
    | AssocFormReturnType
    | AssocFormReturnType[]
    | string
    | number
    | SubFormState;

  type FormState = Record<string, FormStateValue>;

  /**
   *  colHeader - setting
   */
  interface FormRecordTableSetting {
    allowBatchOperation: boolean;
    optionalDisplayModel: string;
    pcDefaultDisplayModel: number;
    orderByFieldCode: string;
    orderByDirection: number;
  }

  /**
   *  colHeader - header Dto
   */
  interface FormRecordTableColDto extends FormRecordTableColBase {
    subHeaders?: FormRecordTableColBase[];
  }

  /**
   *  colHeader Dto
   */
  interface FormRecordTableDto extends FormRecordTableSetting {
    columnHeaders: FormRecordTableColDto[];
    formTemplateId: string;
  }

  interface UserAndDeptValueType {
    id: string;
    value: string;
  }

  interface AssocFormType {
    id: string;
    name: string;
  }

  interface AssocValueType {
    id: string;
    formTemplateId: string;
    tableName: string;
    value: AssocFormType | AssocFormType[];
  }
  /**
   * getTableConfig effect 处理后的返回值
   */
  interface TableConfig {
    colHeaders: FormRecordTableColDto[];
    tableSetting: FormRecordTableSetting;
    query: QueryItemBase[];
    initMainQuery: QueryItemProps[];
    initSubTable: RecordTableQueryProps[];
  }

  // interface TableElement {
  //   displayName: string;
  //   code: string;
  // }

  interface FormRecordTableCell {
    valueType: string;
    value: FormRecordTableCellValue;
  }

  /**
   * datalist-cell Dto
   */
  interface FormRecordDataCellDto extends FormRecordTableCell {
    code: string;
    subRows?: FormRecordDataRowDto[];
  }

  /**
   * datalist-row Dto
   */
  interface FormRecordDataRowDto {
    cells: FormRecordDataCellDto[];
  }

  /**
   * getFormDataList effect 处理后的返回值
   */
  interface FormRecordDto {
    index?: number;
    key: string;
    Id: FormRecordTableCell;
    Name: FormRecordTableCell;
    AuditStat: FormRecordTableCell;
    [props: string]: FormRecordTableCell | FormRecordTableCell[] | number | string | undefined;
  }

  type QueryValueType = (string | boolean | number | undefined)[];
  interface QueryItemProps {
    fieldName: string;
    values: QueryValueType;
  }

  interface RecordTableQueryProps {
    defaultQueryItem?: string;
    schemaId: string;
    queryItems: QueryItemProps[];
    excludeColumns?: string[];
  }

  // datalist Payload
  interface GetFormDataListPayload {
    sortAt: string;
    sortDirection: number;
    pageStartAt: number;
    pageLimit: number;
    displayMode: number;
    mainTableQuery: RecordTableQueryProps;
    subTableQueries?: RecordTableQueryProps[];
    includeAllSubTables?: boolean;
  }

  /**
   * query-items Dto
   * item props
   */
  interface QueryItemBase {
    allowNull: boolean;
    controlType: FormItemControlType;
    defaultValue: string;
    displayName: string;
    filterValue: string;
    parentDisplayName: string;
    propertyName: string;
    sequenceNumber: number;
    visible: boolean;
    config?: Config;
    subFormTemplateId?: string;
  }
  /**
   * query-items Dto
   */
  interface QueryItemDto {
    formTemplateId: string;
    items: QueryItemBase[];
  }

  interface GetDataLinkSourceFilterType {
    key: string;
    value: FormRecordData.FormStateValue;
  }
  interface GetDataLinkSourcePayload {
    formCode: string;
    filter: GetDataLinkSourceFilterType[];
  }
  interface GetDataLinkSourceDto {
    codeValuePairs: {
      [x: string]: FormRecordData.FormStateValue;
    };
  }

  interface OwnerDeptValue {
    deptId: string;
    name: string;
  }
}
interface AssocFormReturnType {
  objectId?: string;
  [key: string]: unknown;
}

interface AssocFormType {
  id: string;
  name: string;
}

type FormRecordTableCellValue =
  | string
  | FormRecordData.AssocValueType
  | number
  | FormRecordData.UserAndDeptValueType;

interface AssocFormSource {
  id: string;
  name: string;
}
interface Config {
  formTemplateId?: string;
  dateTimeFormat?: string;
  tableName?: string;
  mappingField?: string;
  schemaCode?: string;
  source?: (AssocFormSource | string)[];
}

interface FormRecordTableColBase {
  code: string;
  displayName: string;
  visible: boolean;
  sequenceNumber: number;
  isIdColumn: boolean;
  isDefaultColumn: boolean;
  isForeignColumn: boolean;
  valueType: string;
  controlType: FormItemControlType;
  // subHeaders?: FormRecordData.FormRecordTableColDto[];
  config?: {
    dateTimeFormat?: string;
    isDecimals?: boolean;
    decimalPlaces?: number;
    showThousandthSeparator?: boolean;
  };
}
export default FormRecordData;
