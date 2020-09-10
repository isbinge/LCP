import React from 'react';
import { Helmet, HelmetProps } from 'react-helmet';
import { getDefaultTitle } from '@/config';

interface HelmetTitleProps extends HelmetProps {
  title?: string;
}

const HelmetTitle: React.FC<HelmetTitleProps> = ({
  titleTemplate,
  defaultTitle,
  title,
  children,
}) => {
  return (
    <Helmet
      titleTemplate={titleTemplate || (title ? `%s | ${getDefaultTitle()}` : getDefaultTitle())}
      defaultTitle={defaultTitle || getDefaultTitle()}
    >
      <title>{title}</title>
      {children}
    </Helmet>
  );
};

export default HelmetTitle;
