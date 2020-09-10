import { flatMap, pick, flatMapDeep, sortBy } from 'lodash';
import { message } from 'antd';
import {
  getFormToFillin,
  submitForm,
  getFormToExamine,
  getFormToUpdate,
  updateFormRecord,
  deleteFormRecord,
  saveFormAsDraft,
  updateFormDraft,
  getColHeaders,
  getFormList,
  getSelectSource,
  getDataLinkSource,
  getAssocFormDataList,
  getAssocProperty,
  getQueryItems,
  massDeleteFormRecord,
} from './service';
import FormRecordData from './data.d';
import { initDefaultValue } from './util';

const formControls = [
  'singleLineInputControls',
  'textAreaInputControls',
  'numberInputControls',
  'dateTimeControls',
  'checkboxControls',
  'checkboxGroupControls',
  'selectControls',
  'switchControls',
  'groupTitleControls',
  'descriptionControls',
  'subFormTemplates',
  'serialNumberControl',
  'creatorControl',
  'createDateTimeControl',
  'updateDateTimeControl',
  'associatedWithFormControls',
  'associatedWithAttributeControls',
  'associatedWithFormMultiSelectControls',
  'ownerControl',
  'ownerDeptControl',
];

export interface FormInstanceState {}

const INITIAL_STATE = {};

const model: Dva.ModelType<FormInstanceState> = {
  namespace: 'formInstance',
  state: INITIAL_STATE,
  reducers: {},
  effects: {
    *getFormToCreate({ payload }, { call }) {
      try {
        const res = yield call(getFormToFillin, payload);
        return {
          raw: res,
          parsed: flatMap(pick(res, formControls)),
        };
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *createForm({ payload }, { call }) {
      try {
        yield call(submitForm, payload);
        return 'Created';
      } catch (error) {
        message.error('Creating form failed');
        return Promise.reject(error);
      }
    },
    *getFormInfo({ payload }, { call }) {
      try {
        const res = yield call(getFormToExamine, payload);
        return {
          raw: res,
          parsed: flatMap(pick(res, formControls)),
        };
      } catch (error) {
        return message.error('Getting form template failed');
      }
    },
    *getFormToUpdate({ payload }, { call }) {
      try {
        const res = yield call(getFormToUpdate, payload);
        return {
          raw: res,
          parsed: flatMap(pick(res, formControls)),
        };
      } catch (error) {
        return message.error('Fetching form template failed');
      }
    },
    *updateForm({ payload }, { call }) {
      try {
        yield call(updateFormRecord, payload);
        return 'Updated';
      } catch (error) {
        message.error('Updating form failed');
        return Promise.reject(error);
      }
    },
    *deleteForm({ payload }, { call }) {
      try {
        yield call(deleteFormRecord, payload);
        return 'Deleted';
      } catch (error) {
        return message.error('Deleting form failed');
      }
    },
    *saveForm({ payload }, { call }) {
      try {
        yield call(saveFormAsDraft, payload);
        return 'Saved';
      } catch (error) {
        message.error('Saving as draft failed');
        return Promise.reject(error);
      }
    },
    *updateTemporaryForm({ payload }, { call }) {
      try {
        yield call(updateFormDraft, payload);
        return 'Updated';
      } catch (error) {
        message.error('Updating temporary form failed');
        return Promise.reject(error);
      }
    },
    *getColHeaders({ payload }, { call }) {
      try {
        const res = yield call(getColHeaders, payload);
        // let colHeaders: FormRecord.FormRecordTableColDto[] = [];
        // const subTableElements: FormRecord.TableElement[] = [];
        // if (res.columnHeaders) {
        //   const { columnHeaders } = res;
        //   colHeaders = flatMapDeep(columnHeaders, (n: FormRecord.FormRecordTableColDto) => {
        //     if (n.subHeaders) {
        //       subTableElements.push({
        //         displayName: n.displayName,
        //         code: n.code,
        //       });
        //       return n.subHeaders.map((sub: FormRecord.FormRecordTableColDto) => ({
        //         ...sub,
        //         code: `${n.code},${sub.code}`,
        //         parentCode: n.code,
        //         parentDisplayName: n.displayName,
        //       }));
        //     }
        //     return n;
        //   }).filter((col) => col.visible);

        //   // console.log('data', colHeaders);
        // }
        // return {
        //   ...res,
        //   columnHeaders: colHeaders,
        //   subTableElements,
        // };
        return res;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getFormDataList({ payload }, { call }) {
      try {
        const res = yield call(getFormList, payload);
        let dataList: FormRecordData.FormRecordDto[] = [];
        if (res !== true && res.rows) {
          dataList = flatMapDeep(res.rows, (row: FormRecordData.FormRecordDataRowDto) => {
            return row.cells.reduce(
              (pv: FormRecordData.FormRecordDto, cv) => {
                const rowData = { ...pv };
                if (cv.subRows) {
                  cv.subRows.forEach((subRow) => {
                    subRow.cells.forEach((cell) => {
                      const code = `${cv.code},${cell.code}`;
                      const cellValue = rowData[code];
                      if (cellValue) {
                        rowData[code] = (cellValue as FormRecordData.FormRecordTableCell[]).concat({
                          value: cell.value,
                          valueType: cell.valueType,
                        });
                      } else {
                        rowData[code] = [{ value: cell.value, valueType: cell.valueType }];
                      }
                    });
                  });
                }
                if (cv.code === 'Id') {
                  rowData.key = cv.value as string;
                }
                rowData[cv.code] = { value: cv.value, valueType: cv.valueType };
                return rowData;
              },
              {
                key: '',
                Id: { value: '', valueType: '' },
                Name: { value: '', valueType: '' },
                AuditStat: { value: '', valueType: '' },
              },
            );
          });
        }
        return { dataList, totalCount: res.totalCount };
      } catch (e) {
        message.error('Fetching form data failed');
        return Promise.reject(e);
      }
    },
    *getSelectSource({ payload }, { call }) {
      try {
        return yield call(getSelectSource, payload);
      } catch (error) {
        return message.error('Fetching select data source failed');
      }
    },
    *getDataLinkSource({ payload }, { call }) {
      try {
        return yield call(getDataLinkSource, payload);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getAssocFormDataList({ payload }, { call }) {
      try {
        return yield call(getAssocFormDataList, payload);
      } catch (error) {
        return message.error('Fetching assoc. form data list failed');
      }
    },
    *getAssocProperty({ payload }, { call }) {
      try {
        const { formCode, id } = payload;
        return yield call(getAssocProperty, { formCode, id });
      } catch (error) {
        return message.error('Fetching assoc. attribute failed');
      }
    },
    *getQueryItems({ payload }, { call }) {
      try {
        return yield call(getQueryItems, payload);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *massDeleteFormRecord({ payload }, { call }) {
      try {
        yield call(massDeleteFormRecord, payload);
      } catch (error) {
        Promise.reject(error);
      }
    },
    *getTableConfig({ payload }, { call }) {
      try {
        const { formTemplateId } = payload;
        const colHeadersRlt: FormRecordData.FormRecordTableDto = yield call(getColHeaders, {
          formTemplateId,
        });
        const queryItemsRlt: FormRecordData.QueryItemDto = yield call(getQueryItems, {
          formTemplateId,
        });
        const colHeaders = sortBy(
          colHeadersRlt.columnHeaders?.filter(
            (col: FormRecordData.FormRecordTableColDto) => col.visible || col.isDefaultColumn,
          ),
          ['sequenceNumber'],
        );

        const tableSetting = {
          allowBatchOperation: colHeadersRlt.allowBatchOperation,
          optionalDisplayModel: colHeadersRlt.optionalDisplayModel,
          pcDefaultDisplayModel: colHeadersRlt.pcDefaultDisplayModel,
          orderByFieldCode: colHeadersRlt.orderByFieldCode,
          orderByDirection: colHeadersRlt.orderByDirection,
        };
        const query = queryItemsRlt.items?.filter((item) => item.visible);
        const { initMainQuery, initSubTable } = initDefaultValue(query);

        return {
          colHeaders,
          tableSetting,
          query,
          initMainQuery,
          initSubTable,
        };
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
};

export default model;
