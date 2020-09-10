import React, { lazy } from 'react';
import { Switch, Redirect, Route } from '@lib/react-router-dom';
import { RouteConfig } from '@/config/router';
import AuthorizedLayout from '@/layouts/AuthorizedLayout';

export function ConfiguredRoute(config: RouteConfig) {
  const route = { ...config, path: config.path || '*' };
  const { component, lazyComponent, ...rest } = route;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LazyAdapted: React.ComponentType<any> = lazyComponent ? lazy(lazyComponent!) : component!;

  // Redirect route
  if (route.redirect) {
    return <Redirect {...route.redirect} />;
  }

  if (route.routes) {
    // Layout route
    if (LazyAdapted) {
      return (
        <Route
          {...rest}
          render={(props) => (
            <LazyAdapted {...props}>
              <Switch>
                {route.routes?.map((subRoute) => (
                  <ConfiguredRoute {...subRoute} key={subRoute.name || String(subRoute.path)} />
                ))}
              </Switch>
            </LazyAdapted>
          )}
        />
      );
    }
    // If no component is provided
    return (
      <Switch {...rest}>
        {route.routes.map((subRoute) => (
          <ConfiguredRoute {...subRoute} key={subRoute.name || String(subRoute.path)} />
        ))}
      </Switch>
    );
  }
  // end route
  return (
    <AuthorizedLayout noTokenCheck={rest.noTokenRedeem} title={rest.title ?? rest.name}>
      <Route {...rest} component={LazyAdapted} />
    </AuthorizedLayout>
  );
}
