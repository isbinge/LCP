import React from 'react';
import './index.global.scss';

interface PortalHeaderProps {
  style?: React.CSSProperties | undefined;
}

/**
 * 页眉
 * @param props
 */
export const PortalHeader: React.FC<PortalHeaderProps> = (props) => {
  const { children, style } = props;
  return (
    <div className="portal-header-wrapper" style={style}>
      {children}
    </div>
  );
};
export default PortalHeader;
