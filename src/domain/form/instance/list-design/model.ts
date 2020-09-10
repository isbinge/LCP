import { msgIntl } from '@comp/i18n/MessageIntl';
import { omit } from 'lodash';

import { getFormRecordSettings, updateFormRecordSettings } from './service';
import ListDesignData from './data';
import { parseProperties, flattenColumns } from './utils';

export interface FormRecordDesignState {
  settings: ListDesignData.GetListSettingDto | null;
  conditionsPreview: string[];
  fieldsPreview: string[];
}

const model: Dva.ModelType<FormRecordDesignState> = {
  namespace: 'formRecordDesign',
  state: {
    settings: null,
    conditionsPreview: [],
    fieldsPreview: [],
  },
  reducers: {
    saveSettings(state, { payload }) {
      return {
        ...state,
        settings: payload,
      };
    },
    savePreview(state, { payload }) {
      return {
        ...state,
        conditionsPreview: payload.conditionsPreview || state?.conditionsPreview,
        fieldsPreview: payload.fieldsPreview || state?.conditionsPreview,
      };
    },
  },
  effects: {
    *getSettings({ payload }, { put, call }) {
      try {
        const settings = yield call(getFormRecordSettings, payload);
        yield put({ type: 'saveSettings', payload: settings });
      } catch (error) {
        msgIntl.error({ content: 'Fetching settings failed' });
      }
    },
    *updateSettings({ payload }, { call, select, put }) {
      const {
        fieldSettings,
        listSettings,
        formTplId,
      } = payload as ListDesignData.UpdateFormRecordSettingsPayload;
      try {
        const settings: ListDesignData.GetListSettingDto = yield select(
          ({ formRecordDesign }) => formRecordDesign.settings,
        );
        const { propertys, columns } = settings;
        const properties = parseProperties(propertys);
        const flatColumns = flattenColumns(columns);
        const omittedSettings = omit(settings, ['propertys', 'columns', 'queryItems']);
        /**
         * Search conditions
         * i.e. queryItems
         */
        const queryItemDtos = fieldSettings.searchConditions
          .map((id) => properties.get(id))
          .filter((prop) => prop)
          .map((prop) => {
            return {
              id: prop?.queryItemId!,
              propertyName: prop!.code,
              defaultValue: '',
              filterValue: null,
              visible: true,
            };
          });
        /**
         * List fields
         * i.e. columns
         */
        const columnDtos = Array.from(flatColumns.values()).map((col) => ({
          id: col.id,
          visible: fieldSettings.listFields.includes(col.id),
        }));
        /**
         * Assembling payload
         */
        const compatPayload: Partial<ListDesignData.UpdateListSettingDto> = {
          ...omittedSettings,
          currentUserId: yield select((state) => state.account.userId),
          // optionalDisplayModel: listSettings.optionalDisplayMode.join(';'),
          // pcDefaultDisplayModel:
          //   Number(listSettings.webDisplayMode) || settings.pcDefaultDisplayModel,
          // mobileDefaultDisplayModel:
          //   Number(listSettings.mobileDisplayMode) || settings.mobileDefaultDisplayModel,
          allowBatchOperation: listSettings.massOperation === 'true',
          orderByFieldCode: listSettings.sortByField,
          orderByDirection: Number(listSettings.sortMethod) || settings.orderByDirection,
          columnDtos,
          queryItemDtos,
        };
        yield call(updateFormRecordSettings, {
          formTplId,
          data: compatPayload,
        });
        return yield put({
          type: 'getSettings',
          payload: {
            formTplId,
          },
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
};

export default model;
