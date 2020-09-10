import React from 'react';
// import { useSelector } from 'dva';

// import { SelectState } from '@/domain/select';

type FallbackFunction = (loggedIn: boolean) => React.ReactNode;

interface AuthorizedProps {
  accept?: string | string[];
  fallback?: React.ReactNode | FallbackFunction;
  currentAuth?: string;
}

const Authorized: React.FC<AuthorizedProps> = ({ children }) => {
  // const allowedAuthority = Array.isArray(accept) ? accept : [accept];
  // const storedAuth = useSelector(({ login }: SelectState) => login?.role);
  // const currentAuthority =
  //   currentAuth ??
  //   (storedAuth !== 'NULL' ? storedAuth : null) ??
  //   localStorage.getItem('_role') ??
  //   'NULL';
  // const isLoggedIn = currentAuthority !== 'NULL' || !currentAuthority;
  // const isAuthMatched = accept === undefined || allowedAuthority.includes(currentAuthority);
  // const Fallback = fallback && (typeof fallback === 'function' ? fallback(isLoggedIn) : fallback);

  // if (isAuthMatched) {
  return <> {children} </>;
  // }
  // return fallback ? <> {Fallback} </> : null;
};

export default Authorized;
