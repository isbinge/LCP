import React from 'react';
import { Skeleton } from 'antd';
import { AvatarProps } from 'antd/lib/skeleton/Avatar';
import { PartialSkelotion } from '.';

interface IntAvatarProps extends Omit<AvatarProps, 'style'>, PartialSkelotion {}

export const LoadingAvatar: React.FC<IntAvatarProps> = ({
  size = 'small',
  shape = 'square',
  active = true,
  loading = true,
  style,
  children,
}) => (
  <div className="partial-skeloton" style={style}>
    <Skeleton
      active={active}
      loading={loading}
      title={false}
      avatar={{ size, shape }}
      paragraph={false}
    >
      {children}
    </Skeleton>
  </div>
);
