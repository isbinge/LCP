import { replaceAll, getNicknameCapital, isChineseCharacters, isLatinCharacters } from '../text';

describe('text util', () => {
  it('should replaceAll work', () => {
    const result = replaceAll('/foo/:bar/:bar/:aux', { bar: 'rab' }, (v) => `:${v}`);
    expect(result).toEqual('/foo/rab/rab/:aux');
  });
  it('should getNicknameCapital work', () => {
    expect(getNicknameCapital('张三')).toBe('张三');
    expect(getNicknameCapital('张')).toBe('张');
    expect(getNicknameCapital('张三四')).toBe('三四');
    expect(getNicknameCapital('欧阳张三')).toBe('张三');
    expect(getNicknameCapital('欧阳张三四')).toBeNull();
    expect(getNicknameCapital('张三Tom')).toBeNull();

    expect(getNicknameCapital('Jack')).toBe('J');
    expect(getNicknameCapital('Jack Tom')).toBe('JT');
    expect(getNicknameCapital('Jack Tom Max')).toBe('JM');
    expect(getNicknameCapital('Jack Tom 张三')).toBeNull();
  });
  it('should isChineseCharacters work', () => {
    expect(isChineseCharacters('')).toBeFalsy();
    expect(isChineseCharacters('ABC')).toBeFalsy();
    expect(isChineseCharacters('张三')).toBeTruthy();
    expect(isChineseCharacters('张三A')).toBeFalsy();
    expect(isChineseCharacters('张三A', true)).toBeTruthy();
  });
  it('should isLatinCharacters work', () => {
    expect(isLatinCharacters('')).toBeFalsy();
    expect(isLatinCharacters('ABC')).toBeTruthy();
    expect(isLatinCharacters('张三')).toBeFalsy();
    expect(isLatinCharacters('张三A')).toBeFalsy();
    expect(isLatinCharacters('张三A', true)).toBeTruthy();
  });
});
