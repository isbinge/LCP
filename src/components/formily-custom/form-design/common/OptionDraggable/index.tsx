import React, { useRef, ReactText } from 'react';
import { useDrag, useDrop, DragObjectWithType } from 'react-dnd';
import { MoreOutlined } from '@ant-design/icons';
import styles from './index.scss';

interface OptionDraggableProps {
  className?: string;
  id: ReactText;
  stateValue: {
    id: ReactText;
    value: string;
  }[];
  onMove: (id: ReactText, atIndex: number) => void;
}
interface DraggeItem extends DragObjectWithType {
  payload: {
    id: ReactText;
  };
}

/**
 *  可拖拽组件 用于表单设计 组件属性中选项的拖拽排序
 * @param props
 */
const OptionDraggable: React.FC<OptionDraggableProps> = (props) => {
  const { id, children, stateValue, onMove, className } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [, drag, preview] = useDrag({
    item: {
      type: 'dragOption',
      payload: {
        id,
      },
    },
  });
  const overIndex = stateValue.findIndex((v) => v.id === id);
  const [, drop] = useDrop({
    accept: ['dragOption'],
    canDrop: () => false,
    hover({ payload }: DraggeItem) {
      const { id: draggedId } = payload;
      const originalIndex = stateValue.findIndex((v) => v.id === draggedId);
      if (originalIndex !== overIndex) {
        onMove(draggedId, overIndex);
      }
    },
  });
  drag(drop(ref));

  return (
    <div ref={preview} className={className}>
      {children}
      <span ref={ref}>
        <MoreOutlined className={styles.iconHover} />
      </span>
    </div>
  );
};

export default OptionDraggable;
