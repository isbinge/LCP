import React, { useState, useEffect } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import dayjs from 'dayjs';
import { Popover } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

import LcpConst from '@/constants';
import { sessionStorageSet, sessionStorageGet } from '@/utils/local-storage';

import styles from './index.scss';
/**
 * **DEVELOPMENT ONLY** component
 *
 * **DO NOT** EXPOSE IT IN PRODUCTION
 */
function BuildInfoDoNotUseInProduction() {
  const [triggered, setTrigged] = useState(false);
  const { version, timestamp } = $$BUILD_INFO;

  useEffect(() => {
    if (sessionStorageGet<boolean>(LcpConst.sessionStorage.BUILD_INFO_TRIGGER) !== true) {
      setTrigged(true);
      sessionStorageSet(LcpConst.sessionStorage.BUILD_INFO_TRIGGER, true);
      const timer = setTimeout(() => {
        setTrigged(false);
      }, 2500);
      return () => {
        clearTimeout(timer);
      };
    }
    return () => {};
  }, []);

  return (
    <Popover
      title={<span style={{ fontSize: 14 }}>Build info</span>}
      visible={triggered}
      placement="topLeft"
      content={
        <div className={styles.buildInfo}>
          <table cellSpacing={4} style={{ borderCollapse: 'separate' }}>
            <tbody>
              <tr>
                <td>
                  <FM id="buildinfo.env.label" />
                </td>
                <td className={styles.value}>
                  <FM id={__DEV__ ? 'buildinfo.env.dev' : 'buildinfo.env.prod'} />
                </td>
              </tr>
              <tr>
                <td>
                  <FM id="dict.version" />
                </td>
                <td className={styles.value}>
                  {__DEV__ ? (
                    `Base on ${version}`
                  ) : (
                    <span>
                      {version}
                      <a
                        href={`https://github.com/allsworth/LCP.Web/releases/tag/v${version}`}
                        style={{ marginLeft: 4 }}
                      >
                        <FM id="dict.changelog" />
                      </a>
                    </span>
                  )}
                </td>
              </tr>
              {dayjs(timestamp).isValid() && (
                <tr>
                  <td>
                    <FM id="buildinfo.build" />
                  </td>
                  <td className={styles.value}>{dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
    >
      <div className={styles.trigger} onClick={() => setTrigged(!triggered)}>
        <CodeOutlined />
      </div>
    </Popover>
  );
}

export default BuildInfoDoNotUseInProduction;
