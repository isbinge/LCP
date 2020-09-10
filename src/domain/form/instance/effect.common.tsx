/* eslint-disable no-param-reassign */
import {
  IFormExtendsEffectSelector,
  IFormActions,
  ISchemaFormAsyncActions,
  FormPath,
  IFieldState,
} from '@formily/antd';
import update from 'immutability-helper';

import {
  SubFormRecord,
  SubFormFieldValueType,
} from '@/pages/form/record/collect/shared/form-schema';
import { isEqualWith, isNumber, isArray, isBoolean } from 'lodash';
import debounce from 'lodash/debounce';
import { MemberInfoDto } from '@/domain/organization/data';
import {
  GroupTitleMappings,
  ConditionCode,
  DataLkgMap,
  AssocFormMappings,
  AssocFormMap,
  DataLkgMappings,
} from './schema-type';
import FormRecordData from './data';

interface UniqueDataLkg {
  conditionCode: ConditionCode[];
  dataLinkageSchemaCode: string;
  filled: { dataLinkageResult: string; filledFieldCode: string[] }[];
}

interface Env {
  groupTitleMappings: GroupTitleMappings;
  dataLinkageMappings?: DataLkgMappings;
  assocFormMappings?: AssocFormMappings;
}

const isConditionCodeEqual = (first: ConditionCode[], second: ConditionCode[]) => {
  return isEqualWith(first, second, (m: ConditionCode[], n: ConditionCode[]) => {
    const mCondition = m.map((cond) => cond.currentFieldCode + cond.currentFieldCode);
    const nCondition = n.map((cond) => cond.currentFieldCode + cond.currentFieldCode);
    return m.length === n.length && mCondition.every((cond) => nCondition.includes(cond));
  });
};

const uniqueDataLkgMapGenerator = (map: DataLkgMap[]) => {
  // 合并重复的shcmacode 及 conditioncode
  let rlt: UniqueDataLkg[] = [];
  map.forEach((item) => {
    const dataLinkage = rlt.find(
      (d) =>
        d.dataLinkageSchemaCode === item.dataLinkageSchemaCode &&
        isConditionCodeEqual(d.conditionCode, item.conditionCode),
    );
    if (dataLinkage) {
      // todo
      const dataLinkageIndex = rlt.findIndex(
        (d) =>
          d.dataLinkageSchemaCode === item.dataLinkageSchemaCode &&
          isConditionCodeEqual(d.conditionCode, item.conditionCode),
      );
      const filled = dataLinkage.filled.find((f) => f.dataLinkageResult === item.dataLinkageResult);
      let newDataLinkage = { ...dataLinkage };

      if (filled) {
        const filledIndex = dataLinkage.filled.findIndex(
          (f) => f.dataLinkageResult === item.dataLinkageResult,
        );
        const newFilled = update(dataLinkage.filled, {
          $splice: [
            [
              filledIndex,
              1,
              {
                ...filled,
                filledFieldCode: [...filled.filledFieldCode, item.filledFieldCode],
              },
            ],
          ],
        });
        newDataLinkage = {
          ...newDataLinkage,
          filled: newFilled,
        };
      } else {
        const newFilledOne = {
          dataLinkageResult: item.dataLinkageResult,
          filledFieldCode: [item.filledFieldCode],
        };
        const newFilled = [...newDataLinkage.filled, newFilledOne];
        newDataLinkage = {
          ...newDataLinkage,
          filled: newFilled,
        };
      }

      rlt = update(rlt, {
        $splice: [[dataLinkageIndex, 1, newDataLinkage]],
      });
    } else {
      // todo
      rlt.push({
        conditionCode: item.conditionCode,
        dataLinkageSchemaCode: item.dataLinkageSchemaCode,
        filled: [
          {
            dataLinkageResult: item.dataLinkageResult,
            filledFieldCode: [item.filledFieldCode],
          },
        ],
      });
    }
  });
  return rlt;
};

const adapaterValue = (value: IFieldState['value']) => {
  let rlt = value;
  if (typeof value === 'object') {
    if (isArray(value)) {
      rlt = value[0]?.deptId || null;
    } else {
      rlt = value?.objectId || value?.deptId || value?.userId || null;
    }
  }
  return rlt;
};

const linkData = debounce(
  (
    uniqueDataLkgMap: UniqueDataLkg[],
    dispatch: Dva.Dispatch,
    setFieldState: IFormActions['setFieldState'],
    getFieldValue: IFormActions['getFieldValue'],
    subFormIndex?: number,
  ) => {
    uniqueDataLkgMap.forEach((item) => {
      const payload = {
        formCode: item.dataLinkageSchemaCode,
        filter: item.conditionCode.map((cond) => {
          if (cond.currentFieldCode.includes('.')) {
            const [subFormCode, fieldCode] = cond.currentFieldCode.split('.');
            const getValue = isNumber(subFormIndex)
              ? getFieldValue(subFormCode).dataSource[subFormIndex][fieldCode]
              : null;
            return {
              key: cond.linkageFieldCode,
              value: adapaterValue(getValue),
            };
          }
          const getValue = getFieldValue(cond.currentFieldCode);
          return {
            key: cond.linkageFieldCode,
            value: adapaterValue(getValue),
          };
        }),
      };

      if (
        payload.filter.every((filterItem) => filterItem.value !== null && filterItem.value !== '')
      ) {
        dispatch<FormRecordData.GetDataLinkSourcePayload, FormRecordData.GetDataLinkSourceDto>({
          type: 'formInstance/getDataLinkSource',
          payload,
        }).then((res) => {
          item.filled.forEach((i) => {
            const returnValue =
              res && res.codeValuePairs ? res.codeValuePairs[i.dataLinkageResult] : null;
            const path = i.filledFieldCode.filter((code) => !code.includes(',')).join(',');
            // 主表
            if (path) {
              setFieldState(`*(${path})`, (state) => {
                state.value = returnValue;
              });
            }
            // 子表
            const subFormFilledFieldCodeList = i.filledFieldCode.filter((code) =>
              code.includes(','),
            );
            if (subFormFilledFieldCodeList.length > 0) {
              subFormFilledFieldCodeList.forEach((subFormFilledFieldCod) => {
                const [subFormCode, subFormFieldCode] = subFormFilledFieldCod.split(',');
                const subFormValue = getFieldValue(subFormCode);

                if (isNumber(subFormIndex)) {
                  setFieldState(subFormCode, (state) => {
                    state.value = {
                      ...subFormValue,
                      dataSource: subFormValue.dataSource.map(
                        (row: SubFormRecord, index: number) => {
                          const rowCopy = { ...row };
                          if (index === subFormIndex) {
                            rowCopy[subFormFieldCode] = returnValue as SubFormFieldValueType;
                          }

                          return rowCopy;
                        },
                      ),
                    };
                  });
                  return;
                }

                setFieldState(subFormCode, (state) => {
                  state.value = {
                    ...subFormValue,
                    dataSource: subFormValue.dataSource.map((row: SubFormRecord) => {
                      const rowCopy = { ...row };
                      rowCopy[subFormFieldCode] = returnValue as SubFormFieldValueType;
                      return rowCopy;
                    }),
                  };
                });
              });
            }
          });
        });
      }
    });
  },
  500,
);

const assocFormFilled = (
  assocFormMap: AssocFormMap,
  dispatch: Dva.Dispatch,
  id: string,
  setFieldState: IFormActions['setFieldState'],
  getFieldValue: IFormActions['getFieldValue'],
  subFormIndex?: number,
) => {
  dispatch({
    type: 'formInstance/getAssocProperty',
    payload: {
      formCode: assocFormMap.schemaCode,
      id,
    },
  }).then((res) => {
    assocFormMap.mappingControls
      .concat(assocFormMap.mappingProperties)
      .filter((item) => item)
      .forEach((mappingControl) => {
        const [filledCode, valueCode] = mappingControl.split(':');
        const code = valueCode.includes('.') ? valueCode.includes('.')[1] : valueCode;
        const returnValue =
          res && res.codeValuePairs && res.codeValuePairs[code] ? res.codeValuePairs[code] : null;
        if (!filledCode.includes('.')) {
          // 填充到主表
          setFieldState(filledCode, (state) => {
            state.value = returnValue;
          });
        } else {
          const [subFormCode, subFormFieldCode] = filledCode.split('.');
          const subFormValue = getFieldValue(subFormCode);

          // 填充到子表
          if (isNumber(subFormIndex)) {
            // 子表的关联表单填充到子表

            setFieldState(subFormCode, (state) => {
              state.value = {
                ...subFormValue,
                dataSource: subFormValue.dataSource.map((row: SubFormRecord, index: number) => {
                  const rowCopy = { ...row };
                  if (index === subFormIndex) {
                    rowCopy[subFormFieldCode] = returnValue as SubFormFieldValueType;
                  }

                  return rowCopy;
                }),
              };
            });
            return;
          }
          // 主表的关联表单填充到子表
          setFieldState(subFormCode, (state) => {
            state.value = {
              ...subFormValue,
              dataSource: subFormValue.dataSource.map((row: SubFormRecord) => {
                const rowCopy = { ...row };
                rowCopy[subFormFieldCode] = returnValue as SubFormFieldValueType;
                return rowCopy;
              }),
            };
          });
        }
      });
  });
};

export const getFormEffects = (
  { groupTitleMappings, dataLinkageMappings, assocFormMappings }: Env,
  handleFullScreen?: (mode: string) => void,
  dispatch?: Dva.Dispatch,
  isCreate?: boolean,
) => (
  $: IFormExtendsEffectSelector,
  { setFieldState, getFieldValue }: IFormActions | ISchemaFormAsyncActions,
) => {
  $('toggle').subscribe(({ payload }: { payload: { visible: boolean; fieldName: string } }) => {
    const path =
      groupTitleMappings[payload.fieldName].length > 0
        ? groupTitleMappings[payload.fieldName].join(',')
        : '';
    if (!path) {
      return;
    }
    setFieldState(FormPath.match(`*(${path})`), (state) => {
      state.display = !payload.visible;
    });
  });
  $('toggleTable').subscribe(
    ({ payload }: { payload: { isFullScreen: boolean; fieldName: string } }) => {
      if (handleFullScreen) {
        handleFullScreen((payload.isFullScreen && 'fullScreen') || 'center');
      }
      setFieldState(FormPath.match(`*`), (state) => {
        // 拥有者等系统控件 未拖入时 display 为false
        const firstDisplay = isBoolean(state.props.display) ? state.props.display : true;
        state.display = payload.isFullScreen ? false : firstDisplay;
      });
      setFieldState(payload.fieldName, (state) => {
        state.display = true;
      });
    },
  );

  if (dataLinkageMappings) {
    const systemCodes = ['CreateUserId', 'OwnerId', 'OwnerDeptId'];

    systemCodes.forEach((code) => {
      if (dataLinkageMappings[code] && dispatch) {
        $('onFieldValueChange', code).subscribe((fieldState: IFieldState) => {
          const canFilled = isCreate
            ? fieldState.unmounted
            : fieldState.unmounted || !fieldState.modified;
          if (canFilled) {
            return;
          }
          const uniqueDataLkgMap = uniqueDataLkgMapGenerator(dataLinkageMappings[code]);
          linkData(uniqueDataLkgMap, dispatch, setFieldState, getFieldValue);
        });
      }
    });
  }

  $('datalink').subscribe(
    ({ payload }: { payload: { code: string; map: DataLkgMap[]; index?: number } }) => {
      const uniqueDataLkgMap = uniqueDataLkgMapGenerator(payload.map);
      if (dispatch) {
        linkData(uniqueDataLkgMap, dispatch, setFieldState, getFieldValue, payload.index);
      }
    },
  );

  if (assocFormMappings) {
    // 关联表单监听
    $('assocFormFilled').subscribe(
      ({ payload }: { payload: { code: string; id: string; index?: number } }) => {
        const assocFormMap = assocFormMappings[payload.code];

        if (dispatch && assocFormMap) {
          assocFormFilled(
            assocFormMap,
            dispatch,
            payload.id,
            setFieldState,
            getFieldValue,
            payload.index,
          );
        }
      },
    );
  }

  // 拥有者监听
  $('ownerValueChange').subscribe(
    ({
      payload,
    }: {
      payload: {
        memberId: string;
        filledMappings: {
          deptMappingField: string | null;
          emailMappingField: string | null;
          genderMappingField: string | null;
          mobileMappingField: string | null;
        };
        isAuto: boolean;
      };
    }) => {
      const { memberId, filledMappings, isAuto } = payload;

      if (dispatch && memberId) {
        dispatch({
          type: 'organization/requestMemberInfo',
          payload: {
            id: memberId,
          },
        }).then((res: MemberInfoDto) => {
          if (res) {
            if (!isAuto) {
              // 修改所属部门
              setFieldState('OwnerDeptId', (state) => {
                const deptIds = res.departmentIds.split(';');
                const deptNames = res.departmentNames.split(';');
                state.value = deptIds.map((deptId, index) => ({ deptId, name: deptNames[index] }));
              });
            }

            if (filledMappings.deptMappingField) {
              // 部门填充
              setFieldState(filledMappings.deptMappingField, (state) => {
                const deptIds = res.departmentIds.split(';');
                const deptNames = res.departmentNames.split(';');
                state.value = deptIds.map((deptId, index) => ({ deptId, name: deptNames[index] }));
              });
            }
            if (filledMappings.emailMappingField) {
              // 邮件填充
              setFieldState(filledMappings.emailMappingField, (state) => {
                state.value = res.email;
              });
            }

            if (filledMappings.genderMappingField) {
              setFieldState(filledMappings.genderMappingField, (state) => {
                // 性别填充
                state.value = res.gender;
              });
            }
            if (filledMappings.mobileMappingField) {
              setFieldState(filledMappings.mobileMappingField, (state) => {
                // 手机填充
                state.value = res.mobile;
              });
            }
          }
        });
      } else if (!memberId) {
        // 移除填充
        const path = `${filledMappings.deptMappingField},${filledMappings.emailMappingField},${filledMappings.genderMappingField},${filledMappings.mobileMappingField}`;

        setFieldState(`OwnerDeptId,${filledMappings.deptMappingField}`, (state) => {
          state.value = [];
        });

        setFieldState(`*(${path})`, (state) => {
          state.value = null;
        });
      }
    },
  );
};
