import React from 'react';
import { FormattedMessage } from 'react-intl';
import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';

import styles from './index.scss';

interface FormDesignerBtnBarProps {
  onSubmit: () => void;
  submitting?: boolean;
}

const FormDesignerBtnBar: React.FC<FormDesignerBtnBarProps> = ({ submitting, onSubmit }) => {
  return (
    <nav className={styles.buttonBar}>
      <div className={styles.blankSpace} />
      <div className={styles.rightSectn}>
        <button
          className={styles.saveButton}
          type="submit"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <LoadingOutlined style={{ marginRight: 4 }} />
          ) : (
            <SaveOutlined style={{ marginRight: 4 }} />
          )}
          <span>
            <FormattedMessage id={submitting ? 'dict.submitting' : 'dict.save'} />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default FormDesignerBtnBar;
