/* eslint-disable @typescript-eslint/naming-convention */
import LcpConst from '@/constants';
import { LoginDto } from '@/domain/account/data.d';
import { localStorageGet, localStorageSet } from './local-storage';

interface StorageAuthV1Extra {
  rememberEmail?: boolean;
}

export interface StorageAuthV1 extends StorageAuthV1Extra {
  token: string;
  expires: number;
  token_type: string;
  signed_timestamp: number;
  scope: string;
}

export function setAuthV1ToLocal(auth: LoginDto, extra?: StorageAuthV1Extra) {
  localStorageSet<StorageAuthV1>(LcpConst.localStorage.AUTHV1, {
    token: auth.access_token,
    expires: auth.expires_in,
    token_type: auth.token_type,
    signed_timestamp: Math.round(new Date().getTime() / 1000),
    scope: auth.scope,
    ...extra,
  });
}

export function getAuthV1FromLocal() {
  return localStorageGet<StorageAuthV1>(LcpConst.localStorage.AUTHV1);
}

export async function clearUserInfo(clearEmail?: boolean) {
  try {
    if (clearEmail) {
      localStorage.removeItem(LcpConst.localStorage.REMEMBER_EMAIL);
    }
    // localStorage.removeItem(LcpConst.localStorage.AUTHV1);
    // localStorage.removeItem(LcpConst.localStorage.LOCALE);
    // sessionStorage.removeItem(LcpConst.sessionStorage.ACCOUNT);
    /**
     * Clearing all storage data will be deprecated when `1.0` is released
     */
    localStorage.clear();
    sessionStorage.clear();
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
