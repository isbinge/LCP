import {
  localStorageGet,
  localStorageSet,
  sessionStorageGet,
  sessionStorageSet,
} from '../local-storage';

describe('local/sessionStorage wrapper', () => {
  it('should localStorageSet/Get work', () => {
    localStorageSet('foo', { bar: 'quz' });
    expect(localStorageGet('foo')).toEqual({ bar: 'quz' });
  });

  it('should sessionStorageSet/Get work', () => {
    sessionStorageSet('foo', { bar: 'quz' });
    expect(sessionStorageGet('foo')).toEqual({ bar: 'quz' });
  });
});
