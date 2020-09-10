import React from 'react';
import { Skeleton } from 'antd';
import { PartialSkelotion } from '.';

interface TitleProps extends PartialSkelotion {
  width?: string | number;
}

export const LoadingTitle: React.FC<TitleProps> = ({
  width,
  active = true,
  style,
  children,
  loading = true,
}) => (
  <div className="partial-skeloton" style={style}>
    <Skeleton active={active} loading={loading} title={{ width }} paragraph={false}>
      {children}
    </Skeleton>
  </div>
);
