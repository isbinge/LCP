import httpRequest from '@/utils/http-request';
import { API } from '@/config';
import { clearUserInfo } from '@/utils/authentication';

export async function checkEmail(payload: { email: string }) {
  return httpRequest({
    api: API.account.CHECK_EMAIL,
    params: payload,
    noToken: true,
  });
}

export async function registerSendCode(payload: { email: string }) {
  return httpRequest({
    api: API.account.REGISTER_SEND_CODE,
    params: payload,
    noToken: true,
  });
}

export async function register(payload: { email: string; password: string }) {
  return httpRequest({
    api: API.account.REGISTER,
    data: payload,
    noToken: true,
  });
}

export async function resetPasswordSendCode(payload: { email: string }) {
  return httpRequest({
    api: API.account.RESETPASSWD_SEND_CODE,
    params: payload,
    noToken: true,
  });
}

export async function resetPasswordCheckCode(payload: { email: string; authcode: string }) {
  return httpRequest({
    api: API.account.RESETPASSWD_CHECK_CODE,
    params: payload,
    noToken: true,
  });
}

export async function resetPassword(payload: {
  email: string;
  password: string;
  authCode: string;
}) {
  return httpRequest({
    api: API.account.RESET_PASSWORD,
    data: payload,
    noToken: true,
  });
}

export async function login(payload: { email: string; password: string }) {
  return httpRequest({
    api: API.account.LOGIN,
    data: payload,
    noToken: true,
  });
}

export async function redeemToken() {
  return httpRequest({
    api: API.account.REDEEM_TOKEN,
    errorHandler: () => {
      clearUserInfo().finally(() => {
        window.location.replace('/');
      });
    },
  });
}

export async function deleteAccount(payload: { userId: string }) {
  return httpRequest({
    api: API.account.DELETE,
    pathParams: {
      id: payload.userId,
    },
  });
}
