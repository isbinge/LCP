import React, { CSSProperties, useEffect, useState, useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { Card } from 'antd';
import { v1 as uuid } from 'uuid';
import classnames from 'classnames';
import update from 'immutability-helper';
import { useSelector, useDispatch } from 'dva';
import { FormattedMessage as FM, useIntl } from 'react-intl';

import LoadingWave from '@comp/LoadingWave';
import { useLogger } from '@/utils/hooks/use-logger';
import { DndItemType } from '@/constants';

import CanvasPlaceholder from '@/assets/form/canvas-placeholder.svg';
import { msgIntl } from '@comp/i18n/MessageIntl';

import { defaultValue } from '@/domain/form/template';
import { systemNameI18n, systemCode } from '@/constants/form/common';
import { DraggableItemBasic } from '..';
import FormItemDraggable from './FormItemDraggable';

import styles from './index.scss';

interface FormCanvasProps {
  style?: CSSProperties;
}

const systemType = ['serialNo', 'creator', 'createTime', 'modifyTime', 'owner', 'ownerDept'];

const CANVAS_ACCEPT = [
  DndItemType.form.BASIC_COMPS,
  DndItemType.form.SYSTEM_COMPS,
  DndItemType.form.LAYOUT_COMPS,
  DndItemType.form.ADVANCED_COMPS,
];

/**
 * 表单设计 - 设计组件
 */
const FormCanvas: React.FC<FormCanvasProps> = ({ style }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const log = useLogger('form-design/form-canvas', { preferGroup: 'collapsed' });
  const [addIndex, setAddIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [
    {
      formItemSpecs,
      formSpec: { id: formTemplateId },
      currentId: itemCursor,
    },
    isLoading,
  ] = useSelector(({ formTemplate, loading }) => [
    formTemplate,
    loading.effects['formTemplate/getFormTpl'],
  ]);

  const displayableItemSpecs = useMemo(() => formItemSpecs.filter((item) => item.displayable), [
    formItemSpecs,
  ]);
  const findFormItem = useCallback(
    (id: string) => {
      const itemIdx = formItemSpecs.findIndex((i) => i.id === id);
      return {
        item: formItemSpecs[itemIdx],
        index: itemIdx,
      };
    },
    [formItemSpecs],
  );

  const [, drop] = useDrop<DraggableItemBasic, void, unknown>({
    accept: CANVAS_ACCEPT,
    drop: (item, monitor) => {
      log(item.payload.fromRaw ? 'Drop event from the panel' : 'Sorting', item);
      if (monitor.didDrop()) {
        return;
      }
      const oneOfSystemComp = formItemSpecs.find(
        (itemSpecs) =>
          systemType.some((type) => type === itemSpecs.compType) &&
          itemSpecs.compType === item.payload.compType,
      );
      if (item.payload.fromRaw) {
        if (oneOfSystemComp && oneOfSystemComp.displayable) {
          msgIntl.error({ id: 'formtpl.canvas.message.onlycomp', key: 'error' });
          return;
        }
        if (
          item.type !== DndItemType.form.LAYOUT_COMPS &&
          item.type !== DndItemType.form.SYSTEM_COMPS
        ) {
          dispatch({
            type: 'formTemplate/getControlCode',
            payload: {
              formTemplateId,
              subFormTemplateId: null,
              item,
              addIndex,
            },
          });
        } else {
          let updatedFormItemSpecs = [];
          if (item.type === DndItemType.form.SYSTEM_COMPS && oneOfSystemComp) {
            updatedFormItemSpecs = update(formItemSpecs, {
              $splice: [
                [formItemSpecs.findIndex((itemSpecs) => itemSpecs === oneOfSystemComp), 1],
                [
                  addIndex,
                  0,
                  {
                    ...oneOfSystemComp,
                    data: {
                      ...oneOfSystemComp.data,
                      name: intl.formatMessage({
                        id: `formtpl.comp.${systemNameI18n[oneOfSystemComp.compType]}`,
                      }),
                    },
                    displayable: true,
                  },
                ],
              ],
            });
          } else {
            updatedFormItemSpecs = update(formItemSpecs, {
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
                    compType: item.payload.compType,
                    renderOptions: item.payload.renderOptions,
                    code:
                      item.payload.compType === 'subform'
                        ? `F${uuid()}`.replace(/-/g, '')
                        : systemCode[item.payload.compType],
                    data: defaultValue[item.payload.compType]
                      ? defaultValue[item.payload.compType]()
                      : null,
                    extraData: [],
                  },
                ],
              ],
            });
          }
          dispatch({
            type: 'formTemplate/updateFormItemSpecs',
            payload: {
              formItemSpecs: updatedFormItemSpecs,
            },
          });
        }
        dispatch({
          type: 'formTemplate/updateCursor',
          payload: { currentId: oneOfSystemComp?.id || item.payload.id },
        });
      } else if (item.payload.isFromInnerCtrl) {
        const { id: dragId } = item.payload;
        const subFormIndex = formItemSpecs.findIndex(
          (i) => i.extraData && i.extraData.find((ed) => ed.id === dragId),
        );
        const subFormData = formItemSpecs[subFormIndex];
        const subFormItems = subFormData.extraData!;
        const dragItemIndex = subFormItems.findIndex((i) => i.id === dragId);
        const dragItem = subFormItems[dragItemIndex];
        const updatedSubForm = update(subFormData, {
          extraData: {
            $splice: [[dragItemIndex, 1]],
          },
        });
        const updatedFormData = update(formItemSpecs, {
          $splice: [[subFormIndex, 1, updatedSubForm]],
        });
        dispatch({
          type: 'formTemplate/updateFormItemSpecs',
          payload: {
            formItemSpecs: update(updatedFormData, {
              $splice: [
                [
                  addIndex,
                  0,
                  {
                    ...dragItem,
                    subFormId: null,
                  },
                ],
              ],
            }),
          },
        });
      }
    },
    collect: (monitor) => ({
      isActive: monitor.canDrop() && monitor.isOver(),
    }),
  });

  const [{ isOver }, dropBottom] = useDrop<DraggableItemBasic, unknown, { isOver: boolean }>({
    accept: CANVAS_ACCEPT,
    canDrop: () => false,
    hover(item) {
      setShow(!!item.payload.fromRaw);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    log('current registered items', formItemSpecs);
    setAddIndex(displayableItemSpecs.length);
  }, [displayableItemSpecs.length]);

  const moveItem = useCallback(
    (id: string, atIndex: number) => {
      const { item, index } = findFormItem(id);
      if (item) {
        dispatch({ type: 'formTemplate/updateCursor', payload: { currentId: id } });
        dispatch({
          type: 'formTemplate/updateFormItemSpecs',
          payload: {
            formItemSpecs: update(formItemSpecs, {
              $splice: [
                [index, 1],
                [atIndex, 0, item],
              ],
            }),
          },
        });
      }
    },
    [formItemSpecs],
  );

  const onFormItemSelected = (id: string) =>
    dispatch({ type: 'formTemplate/updateCursor', payload: { currentId: id } });

  const onFormItemDelete = (id: string) => {
    dispatch({ type: 'formTemplate/updateCursor', payload: { currentId: null } });
    const { item } = findFormItem(id);
    const { index: itemIndex } = findFormItem(id);
    if (
      systemType.some((type) => type === item?.compType) &&
      item &&
      item.compType !== 'serialNo' // 特殊处理流水号，用户可直接删除流水号数据
    ) {
      dispatch({
        type: 'formTemplate/updateFormItemSpecs',
        payload: {
          formItemSpecs: update(formItemSpecs, {
            $splice: [
              [itemIndex, 1],
              [
                formItemSpecs.length,
                0,
                { ...item, displayable: false, data: defaultValue[item.compType]() },
              ],
            ],
          }),
        },
      });
    } else {
      dispatch({
        type: 'formTemplate/updateFormItemSpecs',
        payload: {
          formItemSpecs: update(formItemSpecs, {
            $splice: [[itemIndex, 1]],
          }),
        },
      });
    }
  };

  const onClick = () =>
    dispatch({ type: 'formTemplate/updateCursor', payload: { currentId: null } });

  const onAddIndx = (onIndex: number) => setAddIndex(onIndex);

  return (
    <Card
      bordered={false}
      style={{ ...style }}
      bodyStyle={{ height: '100%', overflow: 'auto', padding: '8px 0px' }}
    >
      <div ref={drop} className={styles.wrapper} style={{ height: '100%' }}>
        <LoadingWave
          message={<FM id="loading.formtpl.compdata" />}
          loading={isLoading ?? false}
          filled
        >
          {displayableItemSpecs.length > 0 ? (
            <>
              {displayableItemSpecs.map((item) => {
                const wrapperClassname = classnames(styles.itemWrapper, {
                  [styles.selected]: itemCursor === item.id,
                });
                return (
                  <FormItemDraggable
                    key={item.id}
                    type={item.parentType}
                    ctrlData={item}
                    className={wrapperClassname}
                    onSelect={onFormItemSelected}
                    payload={{
                      id: item.id,
                      title: item.title,
                      compType: item.compType,
                      fromRaw: item.fromRaw,
                      isFromInnerCtrl: !!item.subFormId,
                      renderOptions: item.renderOptions,
                    }}
                    onFind={findFormItem}
                    onMove={moveItem}
                    onDelete={onFormItemDelete}
                    showIcon={itemCursor === item.id}
                    addIndex={addIndex}
                    setAddIndex={onAddIndx}
                  />
                );
              })}
              <div ref={dropBottom} style={{ flex: 1, minHeight: 90 }} onClick={onClick}>
                {isOver && show && <div style={{ height: 50, background: '#D9EAFF' }} />}
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <img src={CanvasPlaceholder} alt="canvas-placeholder" style={{ marginBottom: 10 }} />
              <FM id="formtpl.canvas.placeholder" />
            </div>
          )}
        </LoadingWave>
      </div>
    </Card>
  );
};

export default FormCanvas;
