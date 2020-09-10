import React, { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './index.scss';

interface LoadingWaveProps {
  /**
   * Message below the indicator
   *
   * 指示器下方的文字提示
   */
  message?: ReactNode;
  /**
   * Animated message
   *
   * 文字三点动画是否开启
   */
  msgAnimated?: boolean;
  /**
   * Whether to fill parent, automatically set to true if children is provided
   *
   * 是否充满父布局, 如果包含自组件，则自动设置为 `true`
   */
  filled?: boolean;
  /**
   * Message style
   *
   * 文字提示样式
   */
  style?: CSSProperties;
  containerStyle?: CSSProperties;
  /**
   * Loading status, if true, render children
   *
   * 加载状态
   */
  loading?: boolean;
  /**
   * Repalce default animated wave indicator
   *
   * 用于替换默认的波浪指示器
   */
  indicator?: ReactNode;
  /**
   * Size of wave indictator
   *
   * 波浪指示器大小
   */
  size?: 'large' | 'medium' | 'small';
  /**
   * If children need parent props, use this property
   *
   * 所包裹的组件需要父级传递的 props 时，使用此属性
   */
  render?: (parentProps: never) => React.ReactNode;
}

interface LoadingWaveRawProps {
  size?: 'large' | 'medium' | 'small';
}

const LoadingWaveRaw: React.FC<LoadingWaveRawProps> = ({ size = 'large' }) => (
  <div className={styles.loadingWaveRaw} data-size={size}>
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

const LoadingWave: React.FC<LoadingWaveProps> = ({
  message,
  filled,
  msgAnimated,
  style,
  loading,
  children,
  indicator,
  size,
  render,
  containerStyle,
  ...extraProps
}) => {
  const Children = render ? render(extraProps as never) : children;
  return (
    <>
      {loading !== false ? (
        <div
          className={classNames([
            {
              [styles.filled]: filled || children || render,
            },
            styles.wrapper,
          ])}
          style={containerStyle}
        >
          <div className={styles.indicator} data-size={size}>
            {indicator || <LoadingWaveRaw size={size} />}
          </div>
          {message && (
            <div
              className={classNames([styles.message, { [styles.animated]: msgAnimated === true }])}
              style={style}
            >
              {message}
            </div>
          )}
        </div>
      ) : (
        Children
      )}
    </>
  );
};

export default LoadingWave;
