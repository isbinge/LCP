/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo } from 'react';
import { router as reactRouterDom, useHistory, routerRedux } from 'dva';
import { History, Path, LocationDescriptorObject, LocationState } from 'history';
import { RouteProps, RedirectProps, LinkProps, RouteComponentProps } from 'react-router-dom';
import { CallHistoryMethodAction, Push, Replace } from 'connected-react-router';
import { replaceAll } from '../text';

export const { Link, Redirect } = reactRouterDom;

interface LinkrProps extends LinkProps {
  values?: Record<string, PrimitiveType>;
}

interface RedirectrProps extends RedirectProps {
  values?: Record<string, PrimitiveType>;
}

const pathReplacePattern = (v: string) => `:${v}`;

const extendTo = (to: LinkrProps['to'], values: LinkrProps['values']) => {
  let enhancedTo = to;
  if (values) {
    if (typeof enhancedTo === 'function') {
      enhancedTo = new Proxy(enhancedTo, {
        apply: (target, _, [arg]) => {
          const newTarget = (location: typeof arg) => {
            const ret = target(location);
            if (typeof ret === 'object') {
              ret.pathname = ret.pathname
                ? replaceAll(ret.pathname, values, pathReplacePattern)
                : undefined;
            }
          };
          return newTarget(arg);
        },
      });
    } else if (typeof enhancedTo === 'object') {
      if (enhancedTo.pathname) {
        enhancedTo.pathname = replaceAll(enhancedTo.pathname, values, pathReplacePattern);
      }
    } else if (typeof enhancedTo === 'string') {
      enhancedTo = replaceAll(enhancedTo, values, pathReplacePattern);
    }
  }
  return enhancedTo;
};

/**
 * LinkR (template strings enabled)
 *
 * e.g:
 * ```tsx
 *  <LinkR to='/foo/:bar' values={{ bar: 1 }} />
 *  // is equivalent to
 *  <Link to="/foo/1" />
 * ```
 * and object type is also supported
 * ```tsx
 *  <LinkR to={{ pathname: '/foo/:bar' }} values={{ bar: 1 }} />
 *  // is equivalent to
 *  <Link to={{ pathname: '/foo/1' }} />
 * ```
 * @author Kirk
 */
export const LinkR: React.FC<LinkrProps> = ({ to, values, ...extraProps }) => {
  const extendedTo = useMemo(() => extendTo(to, values), [to, values]);
  return <Link {...extraProps} to={extendedTo} />;
};

/**
 * RedirectR (template strings enabled)
 *
 * e.g:
 * ```tsx
 *  <RedirectR to='/foo/:bar' values={{ bar: 1 }} />
 *  // is equivalent to
 *  <RedirectR to="/foo/1" />
 * ```
 * and object type is also supported
 * ```tsx
 *  <RedirectR to={{ pathname: '/foo/:bar' }} values={{ bar: 1 }} />
 *  // is equivalent to
 *  <RedirectR to={{ pathname: '/foo/1' }} />
 * ```
 *
 * @author Kirk
 */
export const RedirectR: React.FC<RedirectrProps> = ({ to, values, ...extraProps }) => {
  const extendedTo = useMemo(() => extendTo(to, values), [to, values]);
  return <Redirect {...extraProps} to={extendedTo as RedirectProps['to']} />;
};

interface HistoryR<S> extends Omit<History<S>, 'push' | 'replace'> {
  push(path: Path, values?: Record<string, PrimitiveType>, state?: S): void;
  push(location: LocationDescriptorObject<S>, values?: Record<string, PrimitiveType>): void;
  replace(path: Path, values?: Record<string, PrimitiveType>, state?: S): void;
  replace(location: LocationDescriptorObject<S>, values?: Record<string, PrimitiveType>): void;
}

interface RouterReduxR extends Omit<typeof routerRedux, 'push' | 'replace'> {
  push(
    path: Path,
    values?: Record<string, PrimitiveType>,
    state?: LocationState,
  ): CallHistoryMethodAction<[Path, LocationState?]>;
  push<S>(
    location: LocationDescriptorObject<S>,
    values?: Record<string, PrimitiveType>,
  ): CallHistoryMethodAction<[Path, LocationState?]>;
  replace(
    path: Path,
    values?: Record<string, PrimitiveType>,
    state?: LocationState,
  ): CallHistoryMethodAction<[Path, LocationState?]>;
  replace<S>(
    location: LocationDescriptorObject<S>,
    values?: Record<string, PrimitiveType>,
  ): CallHistoryMethodAction<[Path, LocationState?]>;
}

type HistoryProxyHandler = ProxyHandler<History['push'] | History['replace']>;
type RouterReduxProxyHandler = ProxyHandler<Push | Replace>;

const historyHandler: HistoryProxyHandler = {
  apply: (target, _, args) => {
    let locationDescr: LocationDescriptorObject = {};
    if (typeof args[0] === 'string') {
      // historyR.push("/foo/:bar", { bar: 1 }, { aux: "qux" })
      const [path, values, state] = args;
      locationDescr.pathname = replaceAll(path, values, pathReplacePattern);
      locationDescr.state = state;
    } else if (typeof args[0] === 'object') {
      const [argLocationDescr, values] = args;
      locationDescr = argLocationDescr;
      if (locationDescr.pathname) {
        locationDescr.pathname = replaceAll(locationDescr.pathname, values, pathReplacePattern);
      }
    }
    return target(locationDescr);
  },
};

/**
 * useHistoryR (useHistory with template string enabled)
 *
 * e.g:
 * ```ts
 * // with a route state *aux*
 * historyR.push("/foo/:bar", { bar: 1 }, { aux: true } )
 * // is equivalent to
 * const bar = 1;
 * history.push(`/foo/:${bar}`, { aux:true })
 * ```
 * If string template is not needed, use it as regular `history`
 * ```ts
 * historyR.push({ pathname: "/foo/bar", state: { aux: true } })
 * // Or pass a null to values
 * historyR.push("/foo/bar", null, { aux:true })
 * ```
 * @author Kirk
 */
export function useHistoryR<S>(): HistoryR<S> {
  const history = useHistory<S>();
  return {
    ...history,
    push: new Proxy(history.push, historyHandler),
    replace: new Proxy(history.replace, historyHandler),
  };
}

export const routerReduxR = ({
  ...routerRedux,
  push: new Proxy(routerRedux.push, historyHandler as RouterReduxProxyHandler),
  replace: new Proxy(routerRedux.replace, historyHandler as RouterReduxProxyHandler),
} as unknown) as RouterReduxR;

export const {
  generatePath,
  Prompt,
  BrowserRouter,
  MemoryRouter,
  Route,
  Router,
  StaticRouter,
  Switch,
  matchPath,
  withRouter,
} = reactRouterDom;

export type { RouteProps, RedirectProps, LinkProps, RouteComponentProps };
export type { RouterState as ConnectedRouterState } from 'connected-react-router';

export default reactRouterDom;
