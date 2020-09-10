import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'dva';
import { FormattedMessage as FM } from 'react-intl';

const Exception403 = () => {
  const { goBack } = useHistory();
  return (
    <div className="flex-col-center vertical-filled">
      <Result
        status={403}
        title="403"
        subTitle={<FM id="40x.403.title" />}
        extra={
          <Button type="primary" onClick={goBack}>
            <FM id="dict.back" />
          </Button>
        }
      />
    </div>
  );
};

export default Exception403;
