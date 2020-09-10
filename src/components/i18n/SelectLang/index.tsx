import React, { useContext } from 'react';
import { Menu } from 'antd';
import classNames from 'classnames';
import { GlobalOutlined } from '@ant-design/icons';
import { ClickParam } from 'antd/es/menu';

import LcpIntl from '@/utils/locale';
import { i18nConf } from '@/config';
import Emoji from '@comp/Emoji';
import HeaderDropdown from '../../HeaderDropdown';

import styles from './index.less';
import { LocaleContext } from '../I18nProvider';

interface SelectLangProps {
  style?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  className?: string;
}

const SelectLang: React.FC<SelectLangProps> = ({ className, iconStyle, style }) => {
  const { appLanguage } = useContext(LocaleContext);
  const changeLang = ({ key }: ClickParam) => {
    LcpIntl.locale = key as Lcp.SupportedLocale;
  };
  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[appLanguage]} onClick={changeLang}>
      {Object.entries(i18nConf.spec).map(([locale, spec]) => (
        <Menu.Item key={locale}>
          <Emoji symbol={spec.icon} label={spec.title} />
          <span style={{ marginLeft: 4 }}>{spec.titleEn ?? spec.title}</span>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <span className={styles.selectLangWrapper}>
      <HeaderDropdown overlay={langMenu} placement="bottomLeft" trigger={['click']}>
        <a className={classNames(styles.dropDown, className)} title="language" style={style}>
          <GlobalOutlined style={iconStyle} />
        </a>
      </HeaderDropdown>
    </span>
  );
};

export default SelectLang;
