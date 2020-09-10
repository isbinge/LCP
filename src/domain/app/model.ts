import { message } from 'antd';
import { msgIntl } from '@comp/i18n/MessageIntl';
import { getAppList, createApp, getFormTplList, updateApp, deleteApp, getApp } from './service';
import { AppList, FormTplList, GetAppDto, AppListItem } from './data.d';
import { SelectState } from '../select';

export interface AppState {
  app: AppListItem | null;
  apps: AppList;
  formTpls: FormTplList;
}

export const formTplsSelector = (state: SelectState) => state.app.formTpls;

const model: Dva.ModelType<AppState> = {
  namespace: 'app',
  state: {
    app: null,
    apps: [],
    formTpls: [],
  },
  reducers: {
    saveAppList(state, { payload: { apps } }) {
      return {
        ...state,
        apps,
      };
    },
    saveFormTplList(state, { payload: { formTpls } }) {
      return {
        ...state,
        formTpls,
      };
    },
    saveApp(state, { payload: { app } }) {
      return {
        ...state,
        app,
      };
    },
  },
  effects: {
    *getApp({ payload }, { call, put }) {
      try {
        const app: GetAppDto = yield call(getApp, payload);
        yield put({
          type: 'saveApp',
          payload: {
            app,
          },
        });
        return app;
      } catch (e) {
        message.error('Failed when fetching app info');
        return Promise.reject(e);
      }
    },
    *getAppList({ payload }, { call, put, select }) {
      try {
        const orgId = yield payload?.orgId || select((state) => state.account.defaultOrgId);
        if (!orgId) {
          return;
        }
        yield put({
          type: 'saveAppList',
          payload: {
            apps: yield call(getAppList, { orgId }),
          },
        });
      } catch (e) {
        message.error('Failed when fetching app list');
      }
    },
    *createApp({ payload }, { call }) {
      try {
        return yield call(createApp, payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getFormTplList({ payload }, { put, call }) {
      try {
        const formInstList = yield call(getFormTplList, payload);
        yield put({
          type: 'saveFormTplList',
          payload: {
            formTpls: formInstList,
          },
        });
        return formInstList;
      } catch (e) {
        message.error('Fetch form template list failed');
        return Promise.reject(e);
      }
    },
    *updateApp({ payload }, { call }) {
      try {
        yield call(updateApp, payload);
        return Promise.resolve();
      } catch (e) {
        msgIntl.error({ id: 'msg.update.failed' });
        return Promise.reject(e);
      }
    },
    *deleteApp({ payload }, { call }) {
      try {
        yield call(deleteApp, payload);
      } catch (e) {
        message.error('Delete app failed');
      }
    },
    *subscribeAppOps(_, { takeEvery, put }) {
      yield takeEvery(
        ['app/createApp/@@end', 'app/updateApp/@@end', 'app/deleteApp/@@end'],
        function* cb() {
          yield put({ type: 'getAppList' });
        },
      );
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'subscribeAppOps' });
    },
  },
};

export default model;
