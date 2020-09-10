/* eslint-disable @typescript-eslint/naming-convention */
import LcpConst from '../../constants/index';
import {
  setAuthV1ToLocal,
  getAuthV1FromLocal,
  StorageAuthV1,
  clearUserInfo,
} from '../authentication';
import { localStorageSet } from '../local-storage';

describe('authentication local/sessionstorage suite', () => {
  it('should setAuthV1ToLocal and getAuthV1FromLocal work', () => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    setAuthV1ToLocal(
      {
        access_token: 'bar',
        expires_in: 123,
        token_type: 'qux',
        scope: 'baz',
      },
      { signed_timestamp: timestamp } as StorageAuthV1,
    );
    expect(getAuthV1FromLocal()).toEqual({
      token: 'bar',
      expires: 123,
      token_type: 'qux',
      signed_timestamp: timestamp,
      scope: 'baz',
    });
  });

  it('should getAuthV1FromSession work', () => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    expect(getAuthV1FromLocal()).toEqual({
      token: 'bar',
      expires: 123,
      token_type: 'qux',
      signed_timestamp: timestamp,
      scope: 'baz',
    });
  });

  it('should clearUserInfo work', async () => {
    localStorageSet(LcpConst.localStorage.AUTHV1, { foo: 1 });
    localStorageSet(LcpConst.localStorage.REMEMBER_EMAIL, { foo: 2 });
    localStorageSet(LcpConst.localStorage.LOCALE, { foo: 3 });
    await clearUserInfo(true);
    expect(
      localStorage.getItem(LcpConst.localStorage.REMEMBER_EMAIL) ||
        localStorage.getItem(LcpConst.localStorage.AUTHV1) ||
        localStorage.getItem(LcpConst.localStorage.LOCALE) ||
        sessionStorage.getItem(LcpConst.sessionStorage.ACCOUNT),
    ).toBeNull();
  });
});
