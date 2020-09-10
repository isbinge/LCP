import { isEmail } from '..';

describe('utils', () => {
  it('should isEmail work', () => {
    expect(isEmail('')).toBe(false);
    expect(isEmail('@')).toBe(false);
    expect(isEmail('a@b.c')).toBe(false);
    expect(isEmail('1@2.3')).toBe(false);
    expect(isEmail('foo@bar')).toBe(false);

    expect(isEmail('1001@bar.quz')).toBe(true);
    expect(isEmail('foo@1001.quz')).toBe(true);
    expect(isEmail('foo@bar.100')).toBe(false);

    expect(isEmail('foo@bar.1uz')).toBe(false);
    expect(isEmail('foo@bar.q1z')).toBe(false);
    expect(isEmail('foo@bar.qu1')).toBe(false);

    expect(isEmail('foo@#ar.quz')).toBe(false);
    expect(isEmail('foo@b#r.quz')).toBe(false);
    expect(isEmail('foo@bar.#uz')).toBe(false);
    expect(isEmail('foo@bar.q#z')).toBe(false);
    expect(isEmail('foo@bar.qu#')).toBe(false);

    expect(isEmail('fo_o@bar.quz')).toBe(true);
    expect(isEmail('_foo@bar.quz')).toBe(true);
    expect(isEmail('foo_@bar.quz')).toBe(true);
    expect(isEmail('foo@bar.quz')).toBe(true);
  });
});
