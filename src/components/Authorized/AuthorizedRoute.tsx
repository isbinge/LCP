// import React from 'react';
// import { Route, Redirect } from '@lib/react-router-dom';
// import { RouteConfig } from '@/config/router';

// import Authorized from './Authorized';

// interface AuthorizedRouteProps extends RouteConfig {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   component?: React.ComponentType<any>;
// }

// const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({
//   auths,
//   component: Component,
//   authNoMatchRedirect,
//   authNoMatchRender,
//   children,
//   ...rest
// }) => (
//   <Route
//     {...rest}
//     component={undefined}
//     render={(props) => (
//       <Authorized
//         accept={auths}
//         fallback={(loggedIn) =>
//           authNoMatchRender ?? (
//             <Redirect
//               to={{
//                 pathname: loggedIn ? authNoMatchRedirect || '/403' : '/login',
//                 state: { from: props.location },
//                 search: loggedIn ? undefined : 'redirect=1',
//               }}
//             />
//           )
//         }
//       >
//         {Component ? <Component {...props} /> : children}
//       </Authorized>
//     )}
//   />
// );

// export default AuthorizedRoute;
