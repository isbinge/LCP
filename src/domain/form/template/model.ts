import update from 'immutability-helper';
import { v1 as uuidv1 } from 'uuid';
import { message } from 'antd';

import {
  createFormTpl,
  updateFormTpl,
  getControlCode,
  getAssocForms,
  getDbFields,
  getFormTpl,
  deleteFormTpl,
  getLinkForms,
  updateFormTplName,
} from '@/domain/form/template/service';

import {
  hideTitleComps,
  FdTplPanelItemDefBase,
} from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { defaultValue } from '@/domain/form/template';
import { parseFormData, adaptFormData } from '@/domain/form/template/adapter';
import { msgIntl } from '@comp/i18n/MessageIntl';
import { FormTplList } from '@/domain/app/data.d';
import { SelectState } from '@/domain/select';
import { accountSelector, userIdSelector } from '@/domain/account/model';
import { formTplsSelector } from '@/domain/app/model';
import LcpConst from '@/constants';
import { routerReduxR } from '@lib/react-router-dom';
import FormTemplate from './data.d';

export interface FormItemSpec extends FdTplPanelItemDefBase {
  id: string;
  code?: string;
  displayable: boolean;
  parentType: string;
  title: string;
  fromRaw: boolean;
  subFormId: Nullable<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  extraData?: FormItemSpec[];
}

export interface FormTemplateState {
  currentId: string | null;
  formSpec: Lcp.FormDataType.Form;
  formItemSpecs: FormItemSpec[];
  edited: boolean;
}

export const currentIdSelector = (state: SelectState) => state.formTemplate.currentId;
export const formItemSpecsSelector = (state: SelectState) => state.formTemplate.formItemSpecs;
export const formTemplateSelector = ({ formTemplate }: SelectState) => [
  formTemplate.formSpec,
  formTemplate.formItemSpecs,
];

export const INITIAL_STATE: FormTemplateState = {
  currentId: null,
  formSpec: {
    id: uuidv1(),
    name: '',
    code: '',
    iconCss: 'undefined',
    dataTitle: [],
    openFormDynamic: true,
    openTaskNotification: false,
    displayToMobile: true,
    displayToPc: true,
    currentUserId: '',
  },
  formItemSpecs: [],
  edited: false,
};

// const hideTitleType = ['switch', 'groupTitle', 'inlineSplit', 'description'];

const FormTemplateModel: Dva.ModelType<FormTemplateState> = {
  namespace: 'formTemplate',
  state: INITIAL_STATE,
  reducers: {
    reset() {
      const id = uuidv1();
      return { ...INITIAL_STATE, formSpec: { ...INITIAL_STATE.formSpec, id } };
    },
    updateTplName(state, { payload: { newName } }) {
      return {
        ...state,
        formSpec: {
          ...state.formSpec,
          name: newName,
        },
      };
    },
    updateCursor(state, { payload: { currentId } }) {
      return {
        ...state,
        currentId,
      };
    },
    updateFormSpec(state, { payload: { formSpec } }) {
      return {
        ...state,
        formSpec,
      };
    },
    updateFormItemSpecs(state, { payload: { formItemSpecs } }) {
      return {
        ...state,
        formItemSpecs,
      };
    },
    saveFormTpl(state, { payload: { formSpec, formItemSpecs } }) {
      return {
        ...state,
        formSpec,
        formItemSpecs,
      };
    },
    setEdited(state, { payload: { edited } }) {
      return {
        ...state,
        edited,
      };
    },
  },
  effects: {
    *createFormTpl({ payload }, { call, select, put }) {
      try {
        const { appId } = payload;
        const { userId } = yield select(accountSelector);
        const [formSpec, formItemSpecs] = yield select(formTemplateSelector);
        const data = adaptFormData(formSpec, formItemSpecs, {
          appId,
          currentUserId: userId,
        });
        const templateId = yield call(createFormTpl, { data });
        yield put({ type: 'app/getFormTplList', payload: { appId } });
        yield put(
          routerReduxR.replace('/app/:appId/form-designer/:templateId/form-design', {
            appId,
            templateId,
          }),
        );
      } catch (e) {
        message.error({ content: e, key: LcpConst.antdMsgKey.FORM_TPL_SAVE });
      }
    },
    *updateFormTpl({ payload }, { call, select, put }) {
      try {
        const { appId, templateId } = payload;
        const { userId } = yield select(accountSelector);
        const [formSpec, formItemSpecs] = yield select(formTemplateSelector);
        const data = adaptFormData(formSpec, formItemSpecs, {
          appId,
          currentUserId: userId,
        });
        yield call(updateFormTpl, { templateId, data });
        yield put({ type: 'getFormTpl', payload: { templateId } });
        yield put({ type: 'app/getFormTplList', payload: { appId } });
        yield put({ type: 'setEdited', payload: { edited: false } });
        return Promise.resolve();
      } catch (error) {
        message.error(error.data?.message || 'Update failed');
        return Promise.reject(error);
      }
    },
    *deleteFormTpl({ payload }, { call }) {
      try {
        yield call(deleteFormTpl, payload);
      } catch (error) {
        msgIntl.error({ id: 'message.appdetail.forminst.delete.failed' });
      }
    },
    *getFormTpl({ payload }, { call, put }) {
      try {
        const { formItemSpecs, formSpec } = parseFormData(yield call(getFormTpl, payload));
        yield put({
          type: 'saveFormTpl',
          payload: {
            formItemSpecs,
            formSpec,
          },
        });
        yield put({ type: 'subscribeFormTplChange' });
      } catch (e) {
        msgIntl.error({ content: 'Parsing data failed' });
      }
    },
    *getControlCode({ payload }, { call, put, select }) {
      const { formTemplateId, subFormTemplateId, item, addIndex } = payload;
      try {
        const code = yield call(getControlCode, { formTemplateId, subFormTemplateId });
        const formItemSpecs: FormItemSpec[] = yield select(formItemSpecsSelector);
        if (subFormTemplateId) {
          const curSubForm = formItemSpecs.find(({ id }) => id === subFormTemplateId)!;
          const curSubFormIndex = formItemSpecs.findIndex((ctrlData) => ctrlData === curSubForm);
          const updatedSubFormData = update(curSubForm, {
            extraData: {
              $splice: [
                [
                  addIndex,
                  0,
                  {
                    id: item.payload.id,
                    displayable: true,
                    parentType: item.type,
                    title: item.payload.title,
                    fromRaw: item.payload.fromRaw,
                    subFormId: subFormTemplateId,
                    renderOptions: { hideTitle: hideTitleComps.includes(item.payload.compType) },
                    compType: item.payload.compType,
                    code,
                    data: defaultValue[item.payload.compType](),
                  },
                ],
              ],
            },
          });
          yield put({
            type: 'updateFormItemSpecs',
            payload: {
              formItemSpecs: update(formItemSpecs, {
                $splice: [
                  [
                    curSubFormIndex,
                    1,
                    {
                      ...updatedSubFormData,
                    },
                  ],
                ],
              }),
            },
          });
        } else {
          yield put({
            type: 'updateFormItemSpecs',
            payload: {
              formItemSpecs: update(formItemSpecs, {
                $splice: [
                  [
                    addIndex,
                    0,
                    {
                      id: item.payload.id,
                      displayable: true,
                      parentType: item.type,
                      title: item.payload.title,
                      fromRaw: item.payload.fromRaw,
                      subFormId: null,
                      renderOptions: { hideTitle: hideTitleComps.includes(item.payload.compType) },
                      compType: item.payload.compType,
                      code,
                      data: defaultValue[item.payload.compType](),
                    },
                  ],
                ],
              }),
            },
          });
        }
      } catch (error) {
        message.error("Can't drag from panel now");
      }
    },
    *getAssociationForms({ payload }, { call }) {
      try {
        return yield call(getAssocForms, payload);
      } catch (error) {
        return message.error('获取关联表单错误');
      }
    },
    *getDbFields({ payload }, { call }) {
      try {
        const { formCode, isChildSchema } = payload as FormTemplate.GetDbFieldsPayload;
        const rlt: FormTemplate.DbFieldsDto = yield call(getDbFields, { formCode });
        if (isChildSchema) {
          return rlt.filter((item) => item.name.split('.')[0] === formCode);
        }
        return rlt.filter((item) => !item.isChildFiled);
      } catch (error) {
        return message.error(error.data);
      }
    },
    *getLinkForms({ payload }, { call }) {
      try {
        return yield call(getLinkForms, payload);
      } catch (error) {
        return message.error(error.data);
      }
    },
    *adapterSelectedCtrl({ payload }, { put, select }) {
      try {
        const { currentCtrl, value } = payload;

        const currentId: Nullable<string> = yield select(currentIdSelector);
        const isTypeChange = value.inputType !== currentCtrl.compType;
        let updateSelectedCtrl;
        if (isTypeChange && value.inputType) {
          const defaultValueAfterChange = defaultValue[value.inputType]();
          const prevOptions = value.options?.optionsValue;
          const prevSelectValue = value.options?.selectValue;
          const prevSelectValueisArray = Array.isArray(prevSelectValue);
          let currentSelectValue;
          if (
            prevSelectValueisArray &&
            value.inputType !== 'input' &&
            value.inputType !== 'checkbox'
          ) {
            [currentSelectValue] = prevSelectValue.length > 0 ? prevSelectValue : [''];
          } else if (!prevSelectValueisArray && value.inputType === 'checkbox') {
            currentSelectValue = [prevSelectValue];
          } else {
            currentSelectValue = prevSelectValue;
          }
          // 类型转换 name options 保持不变
          const baseData = { ...defaultValueAfterChange, name: value.name };
          updateSelectedCtrl = {
            ...currentCtrl,
            // id,
            data: prevOptions
              ? {
                  ...baseData,
                  options: {
                    selectValue: currentSelectValue,
                    optionsValue: prevOptions,
                  },
                }
              : baseData,
            compType: value.inputType,
          };
        } else {
          updateSelectedCtrl = {
            ...currentCtrl,
            data: value,
          };
        }
        yield put({
          type: 'updateCtrl',
          payload: {
            selectedCtrl: currentCtrl,
            updateSelectedCtrl,
            id: currentId,
          },
        });
      } catch (error) {
        Promise.reject(error);
      }
    },
    *updateCtrl({ payload }, { put, select }) {
      try {
        const { selectedCtrl, updateSelectedCtrl, id } = payload;
        const formItemSpecs: FormItemSpec[] = yield select(formItemSpecsSelector);
        if (selectedCtrl?.subFormId) {
          // 子表
          const subFormIndex = formItemSpecs.findIndex(
            (item) => item.id === selectedCtrl.subFormId,
          );
          const subFormData = formItemSpecs[subFormIndex];
          const itemIndex = (subFormData.extraData as FormItemSpec[]).findIndex(
            (item) => item.id === selectedCtrl.id,
          );
          const updatedSubFormData = update(subFormData, {
            extraData: {
              $splice: [[itemIndex, 1, updateSelectedCtrl]],
            },
          });
          yield put({
            type: 'updateFormItemSpecs',
            payload: {
              formItemSpecs: update(formItemSpecs, {
                $splice: [[subFormIndex, 1, updatedSubFormData]],
              }),
            },
          });
        } else {
          // 主表
          const itemIndex = formItemSpecs.findIndex((i) => i.id === id);
          yield put({
            type: 'updateFormItemSpecs',
            payload: {
              formItemSpecs: update(formItemSpecs, {
                $splice: [[itemIndex, 1, updateSelectedCtrl]],
              }),
            },
          });
        }
      } catch (error) {
        Promise.reject(error);
      }
    },
    *updateFormTplName({ payload }, { call, put, select }) {
      try {
        const currentUserId = yield select(userIdSelector);
        const formTpls: FormTplList = yield select(formTplsSelector);
        const tplIndex = formTpls.findIndex((tpl) => tpl.id === payload.formTplId);
        yield call(updateFormTplName, { ...payload, iconCss: '', currentUserId });
        const updatedFormTpl = {
          ...formTpls[tplIndex],
          name: payload.name,
        };
        yield put({
          type: 'app/saveFormTplList',
          payload: {
            formTpls: update(formTpls, {
              $splice: [[tplIndex, 1, updatedFormTpl]],
            }),
          },
        });
      } catch (error) {
        msgIntl.error({ id: 'appdetail.formlist.rename.fail.message' });
        Promise.reject(error);
      }
    },
    *subscribeFormTplChange(_, { take, put }) {
      yield put({ type: 'setEdited', payload: { edited: false } });
      yield take([
        'updateTplName',
        'updateFormSpec',
        'updateFormItemSpecs',
        '@@router/LOCATION_CHANGE',
      ]);
      yield put({ type: 'setEdited', payload: { edited: true } });
    },
  },
};

export default FormTemplateModel;
