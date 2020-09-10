import React from 'react';
import { Result, Button } from 'antd';
import { Link } from '@lib/react-router-dom';
import { useLocation } from 'dva';
import { FormattedMessage as FM } from 'react-intl';

const Exception404 = () => {
  const location = useLocation<{ from: string }>();
  return (
    <div className="flex-col-center vertical-filled">
      <Result
        status={404}
        title="404"
        subTitle={<FM id="40x.404.title" />}
        extra={
          <Link replace to={location.state?.from || '/'}>
            <Button type="primary">
              <FM id="40x.404.back" />
              {location.state?.from ? <FM id="40x.404.prev" /> : <FM id="dict.homepage" />}
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default Exception404;
