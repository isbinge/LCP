declare namespace Lcp {
  namespace FormItem {
    type All = Basic | Layout | System | Advanced;
    type Basic =
      | 'input'
      | 'textarea'
      | 'date'
      | 'number'
      | 'radio'
      | 'checkbox'
      | 'select'
      | 'switch'
      | 'staffSingleSelect'
      | 'staffMultiSelect'
      | 'deptSingleSelect'
      | 'deptMultiSelect';

    type Layout = 'groupTitle' | 'inlineSplit' | 'description' | 'subform';
    type System = 'creator' | 'createTime' | 'modifyTime' | 'serialNo' | 'owner' | 'ownerDept';
    type Advanced = 'associationForm' | 'associationAttribute' | 'associationFormMultiSelect';
  }
  namespace FormDataType {
    interface Form {
      id: string;
      name: string;
      code: string;
      iconCss: string;
      dataTitle: string[];
      groupId?: string;
      openFormDynamic: boolean;
      openTaskNotification: boolean;
      displayToMobile: boolean;
      displayToPc: boolean;
      createUserId?: string;
      currentUserId: string;
      updateUserId?: string;
      createDateTime?: string;
      updateDateTime?: string;
      auditStat?: number;
    }
  }
}
