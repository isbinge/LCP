export { DndItemType } from './dnd-item-type';
export { componentDefinition } from './form/comp-defs';

const LcpConst = {
  // Support email
  SUPPORT_EMAIL: 'help@wonkez.com',
  // Form
  FORM_DESIGN_TPL_COMPTYPE_LAYOUT: ['groupTitle', 'inlineSplit', 'description', 'subform'],
  FORM_RECORD_DEFAULT_PAGE_SIZE: 20,
  // Account
  ACCOUNT_REGISTER_RESEND_EMAIL_TMINUS: 60,
  // Storages
  localStorage: {
    LOCALE: '__locale',
    REMEMBER_EMAIL: '__login::rememl',
    AUTHV1: '__auth@v1',
  },
  sessionStorage: {
    ACCOUNT: '$$auth_redeemed@v1',
    BUILD_INFO_TRIGGER: '@@dev::build_info_trigger',
  },
  // ant-design message key
  antdMsgKey: {
    FORM_TPL_SAVE: 'form-tpl-save',
    SWITCH_ORGS: 'switch-orgs',
    DEV_ERROR_NOTIFY: 'dev::error-notify',
  },
};

export declare namespace LocalStorageValue {
  type Locale = Lcp.SupportedLocale;
  interface RememberEmail {
    email: string;
    remember: boolean;
  }
}

export default LcpConst;
