import React from 'react';
import { Skeleton } from 'antd';
import { SkeletonParagraphProps } from 'antd/lib/skeleton/Paragraph';
import { PartialSkelotion } from '.';

interface ParaProps extends Omit<SkeletonParagraphProps, 'style'>, PartialSkelotion {}

export const LoadingParagraph: React.FC<ParaProps> = ({
  width,
  active = true,
  rows = 3,
  children,
  style,
  loading = true,
}) => (
  <div className="partial-skeloton" style={style}>
    <Skeleton active={active} loading={loading} title={false} paragraph={{ width, rows }}>
      {children}
    </Skeleton>
  </div>
);
