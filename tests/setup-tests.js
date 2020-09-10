import EnzymeAdapter from 'enzyme-adapter-react-16';
import enzyme from 'enzyme';
import enUS from '../src/locales/en_US';
import LcpIntl from '../src/utils/locale';

LcpIntl.initialize({ locale: 'en-US', messages: enUS });

class StorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }

  get allItems() {
    return this.store;
  }
}

global.sessionStorage = new StorageMock();
global.localStorage = new StorageMock();

// jest.mock('@/utils/http-request', () => ({
//   default: () => Promise.resolve({}),
// }));
jest.mock('uuid', () => ({
  v1: () => 'mockUuid',
}));
jest.mock('dva/warnAboutDeprecatedCJSRequire', () => jest.fn());

enzyme.configure({ adapter: new EnzymeAdapter() });
