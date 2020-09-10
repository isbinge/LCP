/* eslint-disable @typescript-eslint/naming-convention */
type DvaInstance = import('dva').DvaInstance;

declare namespace Dva {
  type DvaReducer<S, A> = (state: S, action: A) => S;
  type Action = import('redux').Action;
  type EffectsCommandMap = import('dva').EffectsCommandMap;
  type NativeCallFunc = import('redux-saga').effects.CallEffectFactory<
    import('redux-saga').effects.CallEffect
  >;
  type SelectState = import('@/domain/select.d').SelectState;

  /**
   * @deprecated __该类型已过时，请勿使用__
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface ActionWithPayload<T = any> extends Action {
    payload?: T;
  }

  interface FixedEffectsCommandMap<S> extends EffectsCommandMap {
    select: <T>(func: (state: S) => T) => T;
    put: <A extends ActionWithPayload>(action: A) => unknown;
    call: NativeCallFunc;
    throttle: Function;
    fork: Function;
    delay: Function;
  }

  type Effect<S> = (action: ActionWithPayload, effects: FixedEffectsCommandMap<S>) => void;

  interface Loading<T = { [effect: string]: boolean }> {
    global: boolean;
    models: T;
    effects: {
      [effect: string]: boolean | undefined;
    };
  }

  interface ModelType<S> {
    namespace: string;
    state: S;
    reducers?: {
      [key: string]: DvaReducer<S, ActionWithPayload>;
    };
    effects?: {
      [key: string]: Effect<SelectState>;
    };
    subscriptions?: import('dva').SubscriptionsMapObject;
  }

  /**
   * @deprecated __该类型已过时，请勿使用__
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Dispatch = <P, R = any>(action: ActionWithPayload<P>) => Promise<R>;
  interface FullDvaInstance extends DvaInstance {
    _models: import('@/domain/select.d').SelectState;
    _store: import('redux').Store;
  }
}

declare module 'dva-loading';
