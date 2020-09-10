import React from 'react';
import { Link } from '@lib/react-router-dom';
import { useHistory } from 'dva';
import { FormattedMessage } from 'react-intl';

import UserProfilePopover from '@comp/UserProfilePopover';
import PortalHeader from '@comp/PortalHeader';
import SelectLang from '@comp/i18n/SelectLang';

import logo from '@/assets/lcp_logo.png';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.scss';

interface NavBarProps {
  /** Default: `false` */
  showSelectLang?: boolean;
  /** Default: `false` */
  hideLogo?: boolean;
  /** Default: `false` */
  showGoBack?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  center?: React.ReactNode;
}

/**
 * Universal Navigation Bar
 *
 * Default: [Logo] + [  ] + [UserInfoHeader]
 */
const NavigationBar: React.FC<NavBarProps> = ({
  showSelectLang,
  hideLogo,
  left,
  right,
  center,
  showGoBack,
}) => {
  const { goBack } = useHistory();
  return (
    <PortalHeader style={showGoBack ? { paddingLeft: 0 } : undefined}>
      <nav className={styles.navWrapper}>
        {showGoBack && (
          <div className={styles.goBack} onClick={goBack}>
            <ArrowLeftOutlined />
          </div>
        )}
        <div className={styles.left} data-go-back={showGoBack}>
          {!hideLogo && (
            <Link to="/home" className={styles.link}>
              <img src={logo} alt="lcp logo" className={styles.logo} />
              <span className={styles.text}>
                <FormattedMessage id="global.appname" defaultMessage="LCP" />
              </span>
            </Link>
          )}
          {showSelectLang && (
            <SelectLang iconStyle={{ color: '#3f91f7' }} style={{ marginLeft: 8 }} />
          )}
          {left}
        </div>
        <div className={styles.center}>{center}</div>
        <div style={{ flex: 1 }} />
        <div>
          {right}
          <UserProfilePopover />
        </div>
      </nav>
    </PortalHeader>
  );
};

export default NavigationBar;
