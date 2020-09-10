import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { BorderOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';
import { FormattedMessage as FM } from 'react-intl';

import { msgIntl } from '@comp/i18n/MessageIntl';
import { DndItemType } from '@/constants';
import { FormItemSpec } from '@/domain/form/template/model';
import FormItemDraggable from '../../../FormItemDraggable';

import styles from './index.scss';
import { DraggableItemBasic } from '../../../..';

interface SubformProps {
  value: FormItemSpec;
  id: string;
}
const Cell: React.FC<{ className: string }> = (props) => (
  <div className={props.className}>{props.children}</div>
);
const Subform: React.FC<SubformProps> = (subformProps) => {
  const { value: subformData } = subformProps;
  const [addIndex, setAddIndex] = useState<number>(0);
  const [hoverBgVisible, setHoverBgVisible] = useState(false);
  const dispatch = useDispatch();
  const formData = useSelector(({ formTemplate }) => formTemplate.formItemSpecs);
  const itemCursor = useSelector(({ formTemplate }) => formTemplate.currentId);
  const formTemplateId = useSelector(({ formTemplate }) => formTemplate.formSpec).id;
  const subFormIndex = formData.findIndex((i) => i.id === subformData.id);
  const [, drop] = useDrop<DraggableItemBasic, void, unknown>({
    accept: [
      DndItemType.form.BASIC_COMPS,
      DndItemType.form.ADVANCED_COMPS,
      DndItemType.form.LAYOUT_COMPS,
      DndItemType.form.SYSTEM_COMPS,
    ],
    drop: (item) => {
      if (
        item.type === DndItemType.form.LAYOUT_COMPS ||
        item.type === DndItemType.form.SYSTEM_COMPS
      ) {
        msgIntl.error({ id: 'formtpl.canvas.subform.drag-error', key: 'error' });
        setHoverBgVisible(false);
        return;
      }

      const { fromRaw, isFromInnerCtrl } = item.payload;
      if (fromRaw) {
        dispatch({
          type: 'formTemplate/getControlCode',
          payload: {
            formTemplateId,
            subFormTemplateId: subformData.id,
            item,
            addIndex,
          },
        });
      } else if (!isFromInnerCtrl) {
        const { id: dragId } = item.payload;
        const dragItemData = formData.find((i) => i.id === dragId)!;
        const dragItemIndex = formData.findIndex((i) => i === dragItemData);
        const newSubform = update(subformData, {
          extraData: {
            $splice: [[addIndex, 0, { ...dragItemData, subFormId: subformData.id }]],
          },
        });
        const formDataExceptDragItem = update(formData, { $splice: [[dragItemIndex, 1]] });
        const curSubformIndex = formDataExceptDragItem.findIndex((i) => i.id === subformData.id);
        dispatch({
          type: 'formTemplate/updateFormItemSpecs',
          payload: {
            formItemSpecs: update(formDataExceptDragItem, {
              $splice: [[curSubformIndex, 1, newSubform]],
            }),
          },
        });
      }
      setHoverBgVisible(false);
    },
    hover: (item) => {
      if (item.payload.fromRaw && subformData.extraData && subformData.extraData.length === 0) {
        setHoverBgVisible(true);
      }
    },
  });
  const findItem = (id: string) => {
    const subFormItems = subformData.extraData as FormItemSpec[];
    const item = subFormItems.find((i) => i.id === id) as FormItemSpec;
    return {
      item,
      index: subFormItems.indexOf(item),
    };
  };
  const moveItem = (id: string, atIndex: number) => {
    const { item, index } = findItem(id);
    if (!item) {
      return;
    }
    // dispatch({ type: 'formTemplate/updateCursor', payload: { currentId: id } });
    const updatedSubFormData = update(subformData, {
      extraData: {
        $splice: [
          [index, 1],
          [
            atIndex,
            0,
            {
              ...item,
            },
          ],
        ],
      },
    });
    dispatch({
      type: 'formTemplate/updateFormItemSpecs',
      payload: {
        formItemSpecs: update(formData, {
          $splice: [[subFormIndex, 1, updatedSubFormData]],
        }),
      },
    });
  };

  const onFormItemSelected = (selectedId: string) =>
    dispatch({ type: 'formTemplate/updateCursor', payload: { currentId: selectedId } });
  const onFormItemDelete = (id: string) => {
    const itemIndex = (subformData.extraData as FormItemSpec[]).findIndex((el) => el.id === id);
    const updatedSubFormData = update(subformData, {
      extraData: {
        $splice: [[itemIndex as number, 1]],
      },
    });

    dispatch({
      type: 'formTemplate/updateFormItemSpecs',
      payload: {
        formItemSpecs: update(formData, {
          $splice: [[subFormIndex, 1, updatedSubFormData]],
        }),
      },
    });
  };
  useEffect(() => {
    setAddIndex(subformData.extraData?.length || 0);
  }, [subformData.extraData?.length || 0]);
  return (
    <div>
      <div className={styles.subformContent}>
        <div className={styles.leftFixed}>
          <div>
            <Cell className={styles.firstFixedCell}>
              <BorderOutlined />
            </Cell>
            <Cell className={styles.secondFixedCell}>No.</Cell>
          </div>
          <div>
            <Cell className={styles.threeFixedCell}>
              <BorderOutlined />
            </Cell>
            <Cell className={styles.fourFixedCell}>1</Cell>
          </div>
        </div>
        <div className={styles.dynamicContent} ref={drop}>
          {hoverBgVisible && <div className={styles.hoverBG} />}
          {subformData.extraData &&
            subformData.extraData.map((innerCtrl) => {
              const wrapperClassname = classnames(
                styles.itemWrapper,
                {
                  [styles.selected]: innerCtrl.id === itemCursor,
                },
                'form-design-canvas-antd-override',
              );
              return (
                <FormItemDraggable
                  key={innerCtrl.id}
                  type={innerCtrl.parentType}
                  ctrlData={innerCtrl}
                  className={wrapperClassname}
                  onSelect={onFormItemSelected}
                  payload={{
                    id: innerCtrl.id,
                    title: innerCtrl.title,
                    compType: innerCtrl.compType,
                    fromRaw: innerCtrl.fromRaw,
                    isFromInnerCtrl: !!innerCtrl.subFormId,
                    renderOptions: innerCtrl.renderOptions,
                  }}
                  onFind={findItem}
                  onMove={moveItem}
                  onDelete={onFormItemDelete}
                  showIcon={innerCtrl.id === itemCursor}
                  addIndex={addIndex}
                  setAddIndex={setAddIndex}
                />
              );
            })}
          <div className={styles.rightFixed}>
            <FM id="formtpl.canvas.subform.ph" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subform;
