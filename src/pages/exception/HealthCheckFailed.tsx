import React from 'react';
import { Result, Button } from 'antd';
import { useLocation } from 'dva';
import { FormattedMessage as FM } from 'react-intl';
import queryString from 'query-string';
import Emoji from '@comp/Emoji';

const HealthCheckFailed = () => {
  const { search } = useLocation();
  const { from } = queryString.parse(search);
  return (
    <div className="flex-col-center vertical-filled">
      <Result
        icon={<Emoji label="crashed" symbol="😵" style={{ fontSize: 100 }} />}
        title={<FM id="40x.hcf.title" />}
        subTitle={<FM id="40x.hcf.subtitle" />}
        extra={
          <a href={(from as string) || '/'}>
            <Button type="ghost">
              <FM id="40x.hcf.reload" />
            </Button>
          </a>
        }
      />
    </div>
  );
};

export default HealthCheckFailed;
