import type { ConnectedRouterState } from '@lib/react-router-dom';
import type { GlobalState } from './model';
import type { AppState } from './app/model';
import type { AccountState } from './account/model';
import type { FormTemplateState } from './form/template/model';
import type { FormInstanceState } from './form/instance/model';
import type { OrganizationState } from './organization/model';
import type { FormRecordDesignState } from './form/instance/list-design/model';
import type { RoleState } from './role/model';

/**
 * Register all state types here.
 *
 * @deprecated Directly import this type is deprecated
 *
 * ```tsx
 *  // deprecated
 *  const app = useSelector((state: SelectState) => state.app)
 *  // recommended
 *  const app = useSelector((state) => state.app)
 * ```
 */
export interface SelectState {
  router: ConnectedRouterState;
  loading: Loading;
  global: GlobalState;
  account: AccountState;
  app: AppState;
  formTemplate: FormTemplateState;
  formInstance: FormInstanceState;
  formRecordDesign: FormRecordDesignState;
  organization: OrganizationState;
  role: RoleState;
}

type DvaLoadingModels = {
  [model in keyof Omit<SelectState, 'loading'>]?: boolean;
};

type Loading = Dva.Loading<DvaLoadingModels>;
