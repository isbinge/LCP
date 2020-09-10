import { FormItemDataType } from '@/constants/form/common';
import { SelectionRangeTabType } from './common';

declare namespace FormTemplate {
  interface UpdateFormNamePayload {
    name: string;
    formTplId: string;
  }

  interface GetDbFieldsPayload {
    formCode: string;
    isChildSchema: boolean;
  }

  type DbFieldsDto = DbFieldsItem[];

  type SelectionRange = {
    [x in SelectionRangeTabType]: string[];
  };
}

interface DbFieldsItem {
  dataType: FormItemDataType;
  displayName: string;
  isChildFiled: number;
  name: string;
}

export default FormTemplate;
