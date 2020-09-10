import { notification } from 'antd';
import { routerRedux } from 'dva';
import { RequestOptionsInit, ResponseError, extend } from 'umi-request';

import { API_PATH } from '@/config/api';
import { i18nConf } from '@/config';
import { dvaApp } from '@/App';
import LcpConst from '@/constants';
import { replaceAll } from './text';
import { getAuthV1FromLocal } from './authentication';
import LcpIntl from './locale';

interface RequestSettings extends RequestOptionsInit {
  api: string;
  pathParams?: Record<string, string>;
  noToken?: boolean;
  languageOverride?: Lcp.SupportedLocale;
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const devErrorHandler = (error: ResponseError<unknown>) => {
  const { response, request, message } = error;
  if (message.includes('timeout')) {
    notification.error({
      message: `请求错误: ${error.request.url}`,
      description: '本地网络或远程接口超时',
      placement: 'bottomRight',
    });
    Object.assign(error, { data: { message: 'Timeout' } });
  } else if (!response) {
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    const { status, url, statusText } = response;
    const errorText = codeMessage[status] || statusText;
    notification.error({
      message: `${request.options.method} 请求错误 ${status} : ${url}`,
      description: `${errorText} (此提示仅开发环境可见)`,
      key: LcpConst.antdMsgKey.DEV_ERROR_NOTIFY,
      duration: 5,
      placement: 'bottomRight',
    });
  }
  throw error;
};

const prodErrorHandler = (error: ResponseError<unknown>) => {
  const { message, response } = error;
  if (message.includes('timeout') || response?.status >= 500) {
    const { intl } = LcpIntl;
    notification.error({
      message: intl.formatMessage({ id: 'util.request.failed' }),
      duration: 3,
      key: 'request-error',
      placement: 'bottomLeft',
    });
    Object.assign(error, { data: { message: intl.formatMessage({ id: 'util.request.failed' }) } });
  }
  throw error;
};

export function apiResolver(api: string, pathParams?: Record<string, string>) {
  const apiArr = api.split(' ');
  if (pathParams) {
    apiArr[1] = replaceAll(apiArr[1], pathParams, (v) => `{${v}}`);
  }
  return apiArr;
}

export const basicRequest = extend({
  errorHandler: __DEV__ ? devErrorHandler : prodErrorHandler,
  prefix: API_PATH,
  credentials: 'include',
  useCache: true,
  getResponse: true,
  timeout: 10000,
  headers: {
    'Accept-Language': i18nConf.spec[LcpIntl.locale].alias.rfc5646ls,
  },
  ttl: 1,
});

basicRequest.interceptors.response.use(async (res) => {
  if (res) {
    // eslint-disable-next-line no-underscore-dangle
    const { dispatch } = dvaApp._store;
    if (res.status === 401) {
      dispatch(routerRedux.replace('/', { needLogin: true }));
    } else if (res.status > 501) {
      dispatch({ type: 'global/healthCheckAndOops', payload: { from: window.location.pathname } });
    }
  }
  return res;
});

export async function httpRequest<D = unknown>({
  api,
  pathParams,
  data = {},
  noToken,
  languageOverride,
  ...options
}: RequestSettings) {
  const [method, url] = apiResolver(api, pathParams);
  const localAuth = getAuthV1FromLocal();
  const headers: Record<string, string> = {};
  if (!noToken && localAuth) {
    headers.Authorization = `${localAuth.token_type} ${localAuth.token}`;
  }
  if (languageOverride) {
    headers['Accept-Language'] = i18nConf.spec[languageOverride].alias.rfc5646ls;
  }
  return basicRequest<D>(url, {
    method,
    data,
    headers,
    ...options,
  }).then((res) => res.data);
}

export default httpRequest;
