import { adaptUnitSelectionRange, parseUnitSelectionRange } from '../../system/adapter/common';

describe('system common utils', () => {
  it('adaptUnitSelectionRange', () => {
    const unitSelectionRange = {
      dept: ['1'],
      role: ['2'],
      deptCtrl: ['3'],
      other: ['-1'],
    };
    const res = adaptUnitSelectionRange(unitSelectionRange);
    expect(res).toEqual('Dept:1;Role:2;DeptControl:3;Other:-1;');
  });

  it('adaptUnitSelectionRange', () => {
    const unitSelectionRangeString = 'Dept:1;Role:2;DeptControl:3;Other:-1;';
    const res = parseUnitSelectionRange(unitSelectionRangeString);
    expect(res).toEqual({
      dept: ['1'],
      role: ['2'],
      deptCtrl: ['3'],
      other: ['-1'],
    });
  });
});
