import { effects } from 'dva/saga';

import model from './model';
import {
  checkEmail,
  registerSendCode,
  register,
  resetPasswordSendCode,
  resetPasswordCheckCode,
  resetPassword,
} from './service';

const { namespace, reducers, effects: modelEffects } = model;
const { call } = effects;

describe('Model account', () => {
  it('has right namespace', () => {
    expect(namespace).toBe('account');
  });
  describe('reducers', () => {
    let testState = {};
    beforeEach(() => {
      testState = {
        nickname: null,
        userId: null,
        defaultOrgId: null,
        email: null,
      };
    });
    it('should saveUserInfo work', () => {
      const dummyData = {
        name: 'foo',
        userId: 'bar',
        companyId: 'baz',
        email: 'qux',
      };
      expect(
        reducers.saveUserInfo(testState, {
          payload: dummyData,
        }),
      ).toEqual({
        ...testState,
        nickname: 'foo',
        userId: 'bar',
        defaultOrgId: 'baz',
        email: 'qux',
      });
    });
  });

  describe('sagas', () => {
    it('should checkEmail work', () => {
      const generator = modelEffects.checkEmail(
        { type: 'account/checkEmail', payload: { email: 'foo' } },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(checkEmail, { email: 'foo' }));
      expect(generator.throw('Not registered').value).toEqual(Promise.reject('Not registered'));
    });
    it('should registerSendCode work', () => {
      const generator = modelEffects.registerSendCode(
        { type: 'account/registerSendCode', payload: { email: 'foo' } },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(registerSendCode, { email: 'foo' }));
      expect(generator.throw('error').value).toEqual(Promise.reject('error'));
    });
    it('should register work', () => {
      const generator = modelEffects.register(
        { type: 'account/register', payload: { email: 'foo', password: 'bar' } },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(register, { email: 'foo', password: 'bar' }));
      expect(generator.throw('error').value).toEqual(Promise.reject('error'));
    });
    it('should resetPasswordSendCode work', () => {
      const generator = modelEffects.resetPasswordSendCode(
        { type: 'account/resetPasswordSendCode', payload: { email: 'foo' } },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(call(resetPasswordSendCode, { email: 'foo' }));
      expect(generator.throw('error').value).toEqual(Promise.reject('error'));
    });
    it('should resetPasswordCheckCode work', () => {
      const generator = modelEffects.resetPasswordCheckCode(
        { type: 'account/resetPasswordCheckCode', payload: { email: 'foo', code: 'bar' } },
        { call },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(resetPasswordCheckCode, { email: 'foo', authcode: 'bar' }));
      next = generator.next(true);
      expect(next.value).toBeTruthy();
    });
    it('should resetPassword work', () => {
      const generator = modelEffects.resetPassword(
        { type: 'account/resetPassword', payload: { email: 'foo', code: 'bar', password: 'qux' } },
        { call },
      );
      const next = generator.next();
      expect(next.value).toEqual(
        call(resetPassword, { email: 'foo', authCode: 'bar', password: 'qux' }),
      );
      expect(generator.throw('error').value).toEqual(Promise.reject('error'));
    });
    it('should login work', () => {});
    it('should logout work', () => {});
    it('should redeemToken work', () => {});
  });
});
