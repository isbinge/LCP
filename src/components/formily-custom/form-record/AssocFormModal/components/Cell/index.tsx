import React, { ReactNode } from 'react';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { LinkR } from '@lib/react-router-dom';
import { FormattedMessage as FM } from 'react-intl';

import FormRecordData from '@/domain/form/instance/data.d';
import { FormItemControlType } from '@/constants/form/common';
import { CELL_PLACEHOLDER } from '@/constants/record/common';

import styles from './index.scss';

interface CellCompProps {
  appId?: string;
  item: FormRecordData.FormRecordTableCell;
  record?: FormRecordData.FormRecordDto;
  col: FormRecordData.FormRecordTableColDto;
  isRecordList: boolean;
}

const Cell: React.FC<CellCompProps> = ({ appId, item, col, record, isRecordList }) => {
  const ctrlType = col?.controlType;
  const cellClassname = classNames(styles.textContainer, {
    [styles.draft]: record?.AuditStat.value === 2,
  });

  const CompGenerator: React.FC<{ type: FormItemControlType }> = ({ type }) => {
    let text: ReactNode = CELL_PLACEHOLDER;
    let render: ReactNode = <span className={cellClassname}>{text}</span>;
    switch (type) {
      case FormItemControlType.ASSOC_FORM: {
        const itemValue = item?.value as FormRecordData.AssocValueType;
        if (itemValue) {
          const link = itemValue.value as FormRecordData.AssocFormType;
          text = link.name || CELL_PLACEHOLDER;
          render = (
            <LinkR
              to="/app/:appId/form/:templateId/inst/:instanceId/examine/:objectId"
              values={{
                appId,
                templateId: itemValue.formTemplateId,
                instanceId: itemValue.tableName,
                objectId: link.id,
              }}
            >
              <span className={cellClassname}>{text}</span>
            </LinkR>
          );
        }
        break;
      }
      case FormItemControlType.ASSOC_FORM_MULTI_SELECT: {
        const itemValue = item?.value as FormRecordData.AssocValueType;
        if (itemValue) {
          const links = itemValue.value as FormRecordData.AssocFormType[];
          text = links.map((link) => link.name || CELL_PLACEHOLDER).join(';');
          render = links.map((link, index) => (
            <LinkR
              key={link.id}
              to="/app/:appId/form/:templateId/inst/:instanceId/examine/:objectId"
              values={{
                appId,
                templateId: itemValue.formTemplateId,
                objectId: link.id,
                instanceId: itemValue.tableName,
              }}
            >
              {index + 1 === links.length ? (
                <span className={cellClassname}>{link.name}</span>
              ) : (
                <span className={cellClassname}>{`${link.name};`}</span>
              )}
            </LinkR>
          ));
        }
        break;
      }
      case FormItemControlType.DATE:
      case FormItemControlType.CREATE_TIME:
      case FormItemControlType.MODIFY_TIME: {
        const itemValue = item?.value;
        text = itemValue
          ? dayjs.fromUtc(itemValue as string).formatToYMDHM(col.config?.dateTimeFormat)
          : CELL_PLACEHOLDER;
        render = <span className={cellClassname}>{text}</span>;
        break;
      }
      case FormItemControlType.NUMBER: {
        const itemValue = item?.value;
        const { config } = col;
        if (itemValue !== null) {
          text = Number(itemValue).toFixed(config?.decimalPlaces);
          text = config?.showThousandthSeparator
            ? (text as string).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : text;
        }
        render = <span className={cellClassname}>{text}</span>;
        break;
      }
      case FormItemControlType.SWITCH: {
        const itemValue = item?.value;
        text = <FM id={itemValue ? 'forminst.schema.switch.yes' : 'forminst.schema.switch.no'} />;
        render = <span className={cellClassname}>{text}</span>;
        break;
      }
      case FormItemControlType.CREATOR:
      case FormItemControlType.OWNER:
      case FormItemControlType.OWNER_DEPARTMENT: {
        const itemValue = item?.value as FormRecordData.UserAndDeptValueType;
        text = itemValue.value || CELL_PLACEHOLDER;
        render = <span className={cellClassname}>{text}</span>;
        break;
      }
      default: {
        const itemValue = item?.value as string;
        text = itemValue || CELL_PLACEHOLDER;
        render = <span className={cellClassname}>{text}</span>;
        break;
      }
    }
    return (
      <Tooltip title={text} overlayClassName="tool-tips-container">
        <span>{isRecordList ? render : text}</span>
      </Tooltip>
    );
  };

  return <CompGenerator type={ctrlType} />;
};
export default Cell;
