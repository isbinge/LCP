/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';

import React, { Suspense } from 'react';
import { Switch } from '@lib/react-router-dom';
import dva, { Model, routerRedux } from 'dva';
import type { Action } from 'redux';
import createLoading from 'dva-loading';
import { setup } from '@formily/antd-components';
import { notification, message } from 'antd';

import resolveModels from '@/config/models';
import I18nProvider from '@comp/i18n/I18nProvider';
import LoadingWave from '@comp/LoadingWave';
import LcpConst from '@/constants';
import history from './utils/history';
import LcpIntl from './utils/locale';
import config from './config';
import routerConfig from './config/router';
import GlobalErrorBoundary from './utils/GlobalErrorBoundary';
import { ConfiguredRoute } from './utils/ConfiguredRoute';
import type { SelectState } from './domain/select.d';

const { locale } = LcpIntl;
const { ConnectedRouter } = routerRedux;

setup();
// eslint-disable-next-line @typescript-eslint/naming-convention
setConfig({ ErrorOverlay: () => null });

message.config({
  maxCount: 2,
  duration: config.antd.messageDurationProd,
  getContainer: () => document.getElementById('root') || document.body,
});

declare module 'dva' {
  export function useSelector<TState = SelectState, TSelected = unknown>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
  ): TSelected;

  interface ActionWithPayload<T> extends Action {
    payload?: T;
  }

  export function useDispatch<
    TDispatch = <R = unknown, P = unknown>(action: ActionWithPayload<P>) => Promise<R>
  >(): TDispatch;
}

export const dvaApp = dva({
  onError: (e) => {
    // Not necessary for i18n
    if (__DEV__) {
      notification.error({
        message: `未处理的错误: ${e.message}`,
        key: LcpConst.antdMsgKey.DEV_ERROR_NOTIFY,
        description: (
          <div>
            <div>该错误非自定义错误，且未被处理，而被顶层捕获。</div>
            <div style={{ marginBottom: '8px' }}>
              请查看控制台排查，如果这是有意为之，请确保有后续 catch 操作。
            </div>
            <em>注意: 该提示仅在开发模式下可见。</em>
          </div>
        ),
        duration: config.antd.notifiDurationDev,
      });
      console.error(e);
    } else {
      // Using English for i18n workaround
      // Production
      notification.error({
        message: "Something's wrong...",
        description:
          'Please refresh and try again, if the error still exists, please contact the support team.',
        duration: 2,
      });
    }
  },
  history,
}) as Dva.FullDvaInstance;

dvaApp.use(createLoading());

resolveModels().forEach((model) => {
  dvaApp.model(model as Model);
});

dvaApp.router((router) => (
  <ConnectedRouter history={router!.history}>
    <GlobalErrorBoundary>
      <Switch>
        {routerConfig.map((route) => (
          <ConfiguredRoute {...route} key={route.name || String(route.path)} />
        ))}
      </Switch>
    </GlobalErrorBoundary>
  </ConnectedRouter>
));

if (__DEV__) {
  window.dvaApp = dvaApp as Dva.FullDvaInstance;
}
const App = dvaApp.start();

export default hot(() => (
  <I18nProvider locale={locale}>
    <Suspense fallback={<LoadingWave filled />}>
      <App />
    </Suspense>
  </I18nProvider>
));
