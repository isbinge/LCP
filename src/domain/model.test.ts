import { effects } from 'dva/saga';
import model, { serviceDownedSelector } from './model';
import { healthCheck } from './service';

const { effects: modelEffects, reducers: modelReducers } = model;
const { put, call, select, take } = effects;

describe('global model', () => {
  describe('global reducers', () => {
    const testState = {
      serviceDowned: null,
    };
    it('setServiceStatus work', () => {
      expect(modelReducers.setServiceStatus(testState, { payload: { down: true } })).toEqual({
        ...testState,
        serviceDowned: true,
      });
    });
  });
  describe('global effects', () => {
    it('healthCheck work', () => {
      const generator = modelEffects.healthCheck(null, { call, select, put });
      const next = generator.next();
      expect(next.value).toEqual(call(healthCheck));
      expect(generator.throw().value).toEqual(
        put({
          type: 'setServiceStatus',
          payload: { down: true },
        }),
      );
    });
    it('healthCheckAndOops work', () => {
      const generator = modelEffects.healthCheckAndOops(
        { from: '/hi' },
        { call, select, put, take },
      );
      let next = generator.next();
      expect(next.value).toEqual(take('global/healthCheck'));
      next = generator.next();
      expect(next.value).toEqual(select(serviceDownedSelector));
      generator.next();
      next = generator.next();
      expect(next.value).toEqual(true);
    });
  });
});
