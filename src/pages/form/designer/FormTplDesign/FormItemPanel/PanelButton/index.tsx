import React from 'react';
import { useDrag } from 'react-dnd';

import { v1 as uuidv1 } from 'uuid';
import { useIntl, FormattedMessage } from 'react-intl';
import LcpIntl from '@/utils/locale';
import { FdTplPanelItemDefBase, FdTplPanelItemDef } from '..';

import styles from './index.scss';

interface PanelBtnProps extends FdTplPanelItemDef {
  /** 拖拽类型 */
  dragType: string;
  /** 是否为移动行为（而非复制行为） */
  isMove?: boolean;
}

export interface PanelBtnRenderPayload extends FdTplPanelItemDefBase {
  /** 组件渲染时的唯一Id */
  id: string;
  /** 组件标题，用于显示 */
  title: string;
  fromRaw?: boolean;
  isFromInnerCtrl?: boolean;
}

/**
 * 左侧组件面板
 * 拖拽源包装
 */
const PanelButton: React.FC<PanelBtnProps> = (props) => {
  const intl = useIntl();
  const [{ opacity }, drag] = useDrag({
    item: {
      type: props.dragType,
      /** 定义拖拽行为携带的数据 */
      payload: {
        id: uuidv1(),
        title: intl.formatMessage({ id: props.id }),
        compType: props.compType,
        renderOptions: props.renderOptions,
        fromRaw: true,
      } as PanelBtnRenderPayload,
    },
    options: {
      dropEffect: props.isMove ? 'move' : 'copy',
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });
  return (
    <div
      className={styles.item}
      ref={drag}
      style={{ opacity }}
      title={intl.formatMessage({ id: props.titleId ?? props.id })}
    >
      <span style={props.style?.[LcpIntl.locale]}>
        <FormattedMessage id={props.id} />
      </span>
    </div>
  );
};

export default PanelButton;
