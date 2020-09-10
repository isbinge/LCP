import React, { useRef, useState } from 'react';
import { useDrag, useDrop, DragObjectWithType, DropTargetMonitor } from 'react-dnd';
import { Tooltip } from 'antd';
import { InfoCircleFilled, DeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import { FormItemSpec } from '@/domain/form/template/model';
import { DraggableItemBasic } from '@/pages/form/designer/FormTplDesign';
import { DndItemType } from '@/constants';
import DynamicFormItem from '../DynamicFormItem';
import { PanelBtnRenderPayload } from '../../FormItemPanel/PanelButton';

import styles from './index.scss';

interface FormItemDraggableProps extends DragObjectWithType {
  className: string;
  payload: PanelBtnRenderPayload;
  showIcon: boolean;
  ctrlData: FormItemSpec;
  addIndex?: number;
  setAddIndex: (onIndex: number) => void;
  onSelect: (id: string) => void;
  onFind: (id: string) => { item: FormItemSpec; index: number };
  onMove: (id: string, atIndex: number) => void;
  onDelete: (id: string) => void;
}

/**
 * 将通过动态表单组件工厂生成普通的表单组件
 * 包装为用于设计用途的表单组件
 */
const FormItemDraggable: React.FC<FormItemDraggableProps> = (props) => {
  const {
    className,
    onSelect,
    onFind,
    onMove,
    onDelete,
    type,
    showIcon,
    ctrlData,
    addIndex,
    setAddIndex,
  } = props;
  const { id, title, compType, renderOptions, isFromInnerCtrl } = props.payload;
  const { index: overIndex } = onFind(id);

  const ref = useRef<HTMLDivElement>(null);
  const [isUp, setIsUp] = useState(true);
  const [fromRaw, setFromRaw] = useState<boolean | undefined>(true);
  const [{ isDragging }, drag] = useDrag({
    item: {
      type,
      payload: {
        id,
        title,
        compType,
        overIndex,
        isFromInnerCtrl,
        fromRaw: false,
      } as PanelBtnRenderPayload,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const accept = isFromInnerCtrl
    ? [DndItemType.form.BASIC_COMPS, DndItemType.form.ADVANCED_COMPS]
    : [
        DndItemType.form.BASIC_COMPS,
        DndItemType.form.SYSTEM_COMPS,
        DndItemType.form.LAYOUT_COMPS,
        DndItemType.form.ADVANCED_COMPS,
      ];
  const [{ isOver }, drop] = useDrop({
    accept,
    canDrop: () => false,
    hover: ({ payload }: DraggableItemBasic, monitor: DropTargetMonitor) => {
      const { id: draggedId, isFromInnerCtrl: IsDragItemFromInnerCtrl } = payload;
      if (ctrlData.parentType === 'LAYOUT_COMPS' && IsDragItemFromInnerCtrl) {
        return;
      }
      const { index: originalIndex } = onFind(draggedId);
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverLeftX = hoverBoundingRect.left;
      const hoverRightX = hoverBoundingRect.right;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;
      const hoverX = clientOffset!.x;

      const isOverLeftLine = hoverX < hoverLeftX;
      const isOverRightLine = hoverX > hoverRightX;
      const isOverHorizontalLine = hoverClientY < hoverMiddleY;
      const isOverDownLine = isFromInnerCtrl ? isOverLeftLine : isOverHorizontalLine;
      const isOverUpLine = isFromInnerCtrl ? isOverRightLine : !isOverHorizontalLine;
      setFromRaw(payload.fromRaw);
      if (originalIndex !== overIndex && (!payload.fromRaw || isFromInnerCtrl)) {
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards or Right
        if (originalIndex < overIndex && isOverDownLine) {
          return;
        }
        // Dragging upwards
        if (originalIndex > overIndex && isOverUpLine) {
          return;
        }
        onMove(draggedId, overIndex);
      }
      if (payload.fromRaw || isFromInnerCtrl) {
        const isOverVerticalLine = hoverClientX < hoverMiddleX;

        const findAddPosition = (condition: boolean) => {
          if (condition && overIndex !== addIndex) {
            setAddIndex(overIndex);
            setIsUp(true);
          } else if (!condition) {
            setAddIndex(overIndex + 1);
            setIsUp(false);
          }
        };
        if (isFromInnerCtrl) {
          findAddPosition(isOverVerticalLine);
        } else {
          findAddPosition(isOverHorizontalLine);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  const opacity = Number(!isDragging);
  drag(drop(ref));
  const showDown = isOver && fromRaw && !isUp && ctrlData.compType !== 'subform';
  const showUp = isOver && fromRaw && isUp && ctrlData.compType !== 'subform';
  const shadowStyle = {
    height: isFromInnerCtrl ? '100%' : 50,
    width: isFromInnerCtrl ? 120 : '100%',
    background: '#D9EAFF',
  };

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={isFromInnerCtrl ? styles.horizontalDisplay : undefined}
    >
      {showUp && <div style={shadowStyle} />}
      <div
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(props.payload.id);
        }}
      >
        {showIcon && (
          <div
            className={styles.button}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(props.payload.id);
            }}
          >
            <DeleteOutlined className={styles.icon} />
          </div>
        )}
        {renderOptions?.hideTitle ? null : (
          <div
            className={classNames(styles.title, {
              [styles.displayInTable]: isFromInnerCtrl,
            })}
          >
            {(ctrlData.compType === 'switch' && ctrlData.data.content) || ctrlData.data.name}
            {ctrlData.data?.description ? (
              <Tooltip title={ctrlData.data.description} overlayClassName="tool-tips-container">
                <InfoCircleFilled style={{ color: '#ddd', marginLeft: 5 }} />
              </Tooltip>
            ) : null}
          </div>
        )}
        <DynamicFormItem
          className={classNames({
            [styles.dynComp]: isFromInnerCtrl,
          })}
          isFromInnerCtrl={isFromInnerCtrl}
          key={props.payload.id}
          type={compType}
          ctrlData={ctrlData}
          id={props.payload.id}
        />
      </div>
      {showDown && <div style={shadowStyle} />}
    </div>
  );
};

export default FormItemDraggable;
