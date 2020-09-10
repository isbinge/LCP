import React from 'react';
import { Result, Button } from 'antd';
import { useLocation } from 'dva';
import { FormattedMessage as FM } from 'react-intl';

const UncaughtError = () => {
  const location = useLocation<{ from: string }>();
  return (
    <div className="flex-col-center vertical-filled">
      <Result
        status={500}
        title={<FM id="40x.uce.title" />}
        subTitle={<FM id="40x.uce.subtitle" />}
        extra={
          <a href="/">
            <Button type="primary">
              <FM id="40x.404.back" />
              {location.state?.from ? <FM id="40x.404.prev" /> : <FM id="dict.homepage" />}
            </Button>
          </a>
        }
      />
    </div>
  );
};

export default UncaughtError;
