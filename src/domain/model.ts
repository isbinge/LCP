import { healthCheck } from './service';
import type { SelectState } from './select.d';

export interface GlobalState {
  serviceDowned: boolean | null;
}

export const serviceDownedSelector = (state: SelectState) => state.global.serviceDowned;

const model: Dva.ModelType<GlobalState> = {
  namespace: 'global',
  state: {
    serviceDowned: null,
  },
  reducers: {
    setServiceStatus(state, { payload }) {
      return {
        ...state,
        serviceDowned: payload.down,
      };
    },
  },
  effects: {
    *healthCheck(_, { call, put }) {
      try {
        yield call(healthCheck);
        return true;
      } catch (e) {
        yield put({ type: 'setServiceStatus', payload: { down: true } });
        return false;
      }
    },
    *healthCheckAndOops({ payload }, { call, select, put, take }) {
      try {
        yield take('global/healthCheck');
        const down = yield select(serviceDownedSelector);
        if (!down) {
          yield call(healthCheck);
        }
        return true;
      } catch (e) {
        yield put({ type: 'setServiceStatus', payload: { down: true } });
        window.location.href = payload.from ? `/oops?from=${payload.from}` : '/oops';
        return false;
      }
    },
  },
};

export default model;
