import { effects } from 'dva/saga';

import model from './model';
import { getAppList, getFormTplList, createApp, updateApp, deleteApp, getApp } from './service';

const { namespace, reducers, effects: modelEffects } = model;
const { put, call } = effects;

describe('Model app', () => {
  it('has right namespace', () => {
    expect(namespace).toBe('app');
  });
  describe('reducers', () => {
    let testState = {};
    const dummyData = [
      {
        id: 'test-id',
        name: 'test-name',
        code: 'test-code',
        iconCss: 'test-css',
      },
    ];
    beforeEach(() => {
      testState = {
        apps: [],
        currentAppId: null,
        formTpls: [],
      };
    });
    it('should saveAppList work', () => {
      expect(
        reducers.saveAppList(testState, {
          payload: {
            apps: dummyData,
          },
        }),
      ).toEqual({
        ...testState,
        apps: dummyData,
      });
    });
    it('should saveFormTplList work', () => {
      expect(
        reducers.saveFormTplList(testState, {
          payload: {
            formTpls: [dummyData],
          },
        }),
      ).toEqual({
        ...testState,
        formTpls: [dummyData],
      });
    });
    it('should saveApp work', () => {
      const [dummyAppData] = dummyData;
      expect(
        reducers.saveApp(testState, {
          payload: {
            app: dummyAppData,
          },
        }),
      ).toEqual({
        ...testState,
        app: dummyAppData,
      });
    });
  });

  describe('sagas', () => {
    it('should getApp work', () => {
      const dummyData = {
        auditStat: 0,
        companyId: 'foo',
        createDateTime: 'foo',
        createUserId: 'foo',
        description: 'foo',
        updateDateTime: 'foo',
        updateUserId: 'foo',
        id: 'foo',
        name: 'foo',
        iconCss: 'foo',
      };
      const generator = modelEffects.getApp({ type: 'app/getApp', payload: null }, { call, put });
      let next = generator.next();
      expect(next.value).toEqual(call(getApp, null));
      next = generator.next(dummyData);
      expect(next.value).toEqual(
        put({
          type: 'saveApp',
          payload: {
            app: dummyData,
          },
        }),
      );
      next = generator.next();
      expect(next.done).toBeTruthy();
    });
    it('should getAppList work', () => {
      const dummyData = [
        {
          id: 'foo',
          name: 'bar',
          iconCss: 'qaz',
        },
      ];
      const generator = modelEffects.getAppList(
        { type: 'app/getAppList', payload: { orgId: 'foo' } },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual('foo');
      next = generator.next('foo');
      expect(next.value).toEqual(call(getAppList, { orgId: 'foo' }));
      next = generator.next(dummyData);
      expect(next.value).toEqual(
        put({
          type: 'saveAppList',
          payload: {
            apps: dummyData,
          },
        }),
      );
      next = generator.next();
      expect(next.done).toBeTruthy();
    });

    it('should getFormTplList work', () => {
      const dummyData = [
        {
          id: 'foo',
          name: 'foo',
          code: 'foo',
          iconCss: 'foo',
        },
      ];
      const generator = modelEffects.getFormTplList(
        { type: 'app/getFormTplList', payload: { appId: 'foo' } },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(getFormTplList, { appId: 'foo' }));
      next = generator.next(dummyData);
      expect(next.value).toEqual(
        put({
          type: 'saveFormTplList',
          payload: {
            formTpls: dummyData,
          },
        }),
      );
      next = generator.next();
      expect(next.done).toBeTruthy();
    });

    it('should createApp work', () => {
      const generator = modelEffects.createApp(
        {
          type: 'app/createApp',
          payload: {
            companyId: 'foo',
            currentUserId: 'bar',
          },
        },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(
        call(createApp, {
          companyId: 'foo',
          currentUserId: 'bar',
        }),
      );
      next = generator.next();
      expect(next.done).toBeTruthy();
    });

    it('should updateApp work', () => {
      const generator = modelEffects.updateApp(
        { type: 'app/updateApp', payload: null },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(updateApp, null));
      next = generator.next();
      expect(next.done).toBeTruthy();
    });

    it('should deleteApp work', () => {
      const generator = modelEffects.deleteApp(
        { type: 'app/deleteApp', payload: null },
        { call, put },
      );
      let next = generator.next();
      expect(next.value).toEqual(call(deleteApp, null));
      next = generator.next();
      expect(next.done).toBeTruthy();
    });
  });
});
