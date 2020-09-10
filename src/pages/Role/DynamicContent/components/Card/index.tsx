import React, { ReactNode } from 'react';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Modal } from 'antd';

import { useIntl } from 'react-intl';

import styles from './index.scss';

const { confirm } = Modal;
interface UserForCard {
  id: string;
  profilePhotoUrl: string;
  name: string;
  deptName: string;
}

interface Card {
  // 展示用户
  user?: UserForCard;
  onDelete?: (id: string) => void;
  //   点击
  text?: ReactNode;
  onClick?: () => void;
}

const Card: React.FC<Card> = ({ user, onDelete, text, onClick }) => {
  const intl = useIntl();
  return user ? (
    <div className={styles.userCardContainer}>
      <Avatar src={user.profilePhotoUrl} className={styles.avatar} size="large">
        {user.name}
      </Avatar>
      <div className={styles.info}>
        <div className={styles.name}> {user.name}</div>
        <div className={styles.dep}>{user.deptName}</div>
      </div>
      <div
        className={styles.remove}
        onClick={() => {
          confirm({
            title: intl.formatMessage({ id: 'role.common.remove.title' }),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({ id: 'role.common.remove.title' }),
            okText: intl.formatMessage({ id: 'role.common.remove.oktext' }),
            cancelText: intl.formatMessage({ id: 'role.common.remove.canceltext' }),
            onOk() {
              if (onDelete) {
                onDelete(user.id);
              }
            },
            onCancel() {},
          });
        }}
      >
        <DeleteOutlined className={styles.removeIcom} style={{ color: '#fff' }} />
      </div>
    </div>
  ) : (
    <a onClick={onClick} className={styles.userCardContainer} style={{ justifyContent: 'center' }}>
      {text}
    </a>
  );
};

export default Card;
