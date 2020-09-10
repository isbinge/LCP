import React, { useState } from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal/Modal';
import { FormattedMessage } from 'react-intl';

import styles from './index.scss';

interface AppTemplateSelectProps extends Omit<ModalProps, 'onOk'> {
  onOk?: (e: React.MouseEvent<HTMLElement>, selected: number) => void;
}
interface AppTemplateCardProps {
  checked: boolean;
}
const AppTemplateCard: React.FC<AppTemplateCardProps> = ({ checked }) => (
  <div className={styles.appTplCard} data-active={checked}>
    <h3>
      <FormattedMessage id="home.appshelf.commonapp" />
    </h3>
    <span>
      <FormattedMessage id="home.appshelf.create.commonapp.desc" />
    </span>
  </div>
);

const AppTemplateSelect: React.FC<AppTemplateSelectProps> = ({ visible, onOk, onCancel }) => {
  const [selected, setSelected] = useState(-1);
  return (
    <Modal
      title={<FormattedMessage id="home.appshelf.create" />}
      visible={visible}
      onOk={(e) => {
        if (onOk) {
          onOk(e, selected);
        }
      }}
      onCancel={onCancel}
    >
      <ul className={styles.appTpls}>
        {Array(1)
          .fill(0)
          .map((_, key) => (
            <li key={1} onClick={() => setSelected(key)}>
              <AppTemplateCard checked={selected === key} />
            </li>
          ))}
      </ul>
    </Modal>
  );
};

export default AppTemplateSelect;
