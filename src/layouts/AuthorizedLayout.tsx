import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Helmet } from 'react-helmet';
import { getDefaultTitle } from '@/config';
import { useIntl } from 'react-intl';

interface AuthorizedLayoutProps {
  noTokenCheck?: boolean;
  title?: false | string | { defaultTitle: string; id: string };
}

const AuthorizedLayout: React.FC<AuthorizedLayoutProps> = ({ noTokenCheck, title, children }) => {
  const dispatch = useDispatch();
  const userId = useSelector(({ account }) => account.userId);
  const [loading, setLoading] = useState(true);
  const intl = useIntl();
  const defaultAppTitle = getDefaultTitle();

  useEffect(() => {
    if (!userId && !noTokenCheck) {
      dispatch({ type: 'account/redeemToken' }).then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  return loading ? null : (
    <>
      <Helmet titleTemplate={`%s | ${defaultAppTitle}`} defaultTitle={defaultAppTitle}>
        {title && (
          <title>
            {typeof title === 'object'
              ? intl.formatMessage({
                  id: title.id,
                  defaultMessage: title.defaultTitle,
                })
              : title}
          </title>
        )}
      </Helmet>
      {children}
    </>
  );
};

export default AuthorizedLayout;
