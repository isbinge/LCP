import React from 'react';
import { ISchemaVirtualFieldComponentProps } from '@formily/antd';
import { Tooltip } from 'antd';

import { QuestionCircleFilled } from '@ant-design/icons';
import styles from './index.scss';

/** 自定义外包装custom-wrapper
 * 用于显示tips 或 field类型
 */

//  使用方法
//   test: {
//      type: 'custom-wrapper',
//      title: 'test',
//      description: 'test-descripetion',
//      'x-component-props': {
//        fieldType: '关联属性',
//      },
//      properties: {
//        aa: {
//          type: 'string',
//        },
//      },
//    },
const CustomerWrapper: React.FC<ISchemaVirtualFieldComponentProps> = props => {
  const { children } = props;

  return (
    <>
      <div className={styles.titleStyle}>
        <div>
          {props.props.required && <div className={styles.itemRequire}>* </div>}
          {props.props.title}
          {props.props.description ? (
            <Tooltip title={props.props.description} overlayClassName="tool-tips-container">
              <QuestionCircleFilled style={{ color: '#ddd', marginLeft: 5 }} />
            </Tooltip>
          ) : null}
        </div>
        {props.props['x-component-props']?.fieldType ? (
          <div className={styles.box}>{props.props['x-component-props']?.fieldType}</div>
        ) : null}
      </div>
      {children}
    </>
  );
};
export default CustomerWrapper;
