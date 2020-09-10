import { setAuthV1ToLocal, clearUserInfo } from '@/utils/authentication';
import { localStorageSet, sessionStorageSet, sessionStorageGet } from '@/utils/local-storage';
import LcpConst from '@/constants';
import { routerRedux } from 'dva';
import {
  checkEmail,
  login,
  registerSendCode,
  register,
  redeemToken,
  deleteAccount,
  resetPassword,
  resetPasswordSendCode,
  resetPasswordCheckCode,
} from './service';
import { LoginDto } from './data.d';
import { SelectState } from '../select';

export interface AccountState {
  nickname: string | null;
  userId: string | null;
  defaultOrgId: string | null;
  email: string | null;
}

export const INITIAL_STATE: AccountState = {
  nickname: null,
  userId: null,
  defaultOrgId: null,
  email: null,
};

export const accountSelector = ({ account }: SelectState) => account;
export const userIdSelector = (state: SelectState) => state.account.userId;

const model: Dva.ModelType<AccountState> = {
  namespace: 'account',
  state: sessionStorageGet<AccountState>(LcpConst.sessionStorage.ACCOUNT) || INITIAL_STATE,
  reducers: {
    saveUserInfo(state, { payload }) {
      return {
        ...state,
        nickname: payload.name,
        userId: payload.userId,
        defaultOrgId: payload.companyId,
        email: payload.email,
      };
    },
  },
  effects: {
    *checkEmail({ payload }, { call }) {
      try {
        const res = yield call(checkEmail, payload);
        return res.isRegister;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *register({ payload }, { call }) {
      try {
        return yield call(register, payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *registerSendCode({ payload }, { call }) {
      try {
        return yield call(registerSendCode, payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *resetPasswordSendCode({ payload }, { call }) {
      try {
        return yield call(resetPasswordSendCode, payload);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *resetPasswordCheckCode({ payload }, { call }) {
      try {
        const { email, code } = payload as { email: string; code: string };
        const { checkSucceed } = yield call(resetPasswordCheckCode, {
          email,
          authcode: code,
        });
        if (checkSucceed) {
          return true;
        }
        throw new Error();
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *resetPassword({ payload }, { call }) {
      try {
        const { email, code, password } = payload as {
          email: string;
          code: string;
          password: string;
        };
        return yield call(resetPassword, {
          email,
          authCode: code,
          password,
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *login({ payload }, { call }) {
      try {
        const res: LoginDto = yield call(login, payload.data);
        setAuthV1ToLocal(res);
        if (payload.rememberEmail) {
          localStorageSet(LcpConst.localStorage.REMEMBER_EMAIL, {
            remember: true,
            email: payload.data.email,
          });
        } else {
          localStorage.removeItem(LcpConst.localStorage.REMEMBER_EMAIL);
        }
        return true;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *logout() {
      try {
        yield clearUserInfo(true);
        return window.location.replace('/');
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *redeemToken(_, { call, put, select }) {
      try {
        const res = yield call(redeemToken);
        yield put({ type: 'saveUserInfo', payload: res });
        sessionStorageSet<AccountState>(
          LcpConst.sessionStorage.ACCOUNT,
          yield select((state) => state.account),
        );
      } catch (e) {
        put(routerRedux.push('/', { expired: true }));
      }
    },
    *delete(_, { call, put, select }) {
      try {
        const userId = yield select(userIdSelector);
        yield call(deleteAccount, { userId });
        return yield put({ type: 'logout' });
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
};

export default model;
