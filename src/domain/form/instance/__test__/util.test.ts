import dayjs, { OpUnitType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import lcp from '../../../../utils/lib/dayjs-lcp-plugin';
import { FormItemControlType } from '../../../../constants/form/common';
import { dateTransfer, queryGenerate, adpaterDefaultValue, initDefaultValue } from '../util';
import FormRecordData from '../data.d';

dayjs.extend(lcp);
dayjs.extend(utc);

describe('instance/util', () => {
  it("should dateTransfer work when type's length is 1 ", () => {
    const dummyParams: OpUnitType[] = ['day'];
    expect(dateTransfer(dummyParams)).toEqual([
      dayjs().startOf('day').toISOStringInUTC(),
      dayjs().endOf('day').toISOStringInUTC(),
    ]);
  });

  it("should dateTransfer work when type's length is 2 ", () => {
    const dummyParams: OpUnitType[] = ['day', 'day'];
    expect(dateTransfer(dummyParams)).toEqual([
      dayjs().startOf('day').subtract(1, 'day').toISOStringInUTC(),
      dayjs().endOf('day').subtract(1, 'day').toISOStringInUTC(),
    ]);
  });

  it('should dateTransfer work when type is error', () => {
    const dummyParams: OpUnitType[] = [];
    expect(dateTransfer(dummyParams)).toEqual([]);
  });

  it('should queryGenerate work when code is new', () => {
    const dummyParams = {
      queryItems: [],
      values: ['testValue'],
      code: 'testNewCode',
    };
    expect(queryGenerate(dummyParams.queryItems, dummyParams.values, dummyParams.code)).toEqual([
      { fieldName: 'testNewCode', values: ['testValue'] },
    ]);
  });

  it('should queryGenerate work when code is old', () => {
    const dummyParams = {
      queryItems: [
        {
          fieldName: 'oldCode',
          values: ['oldeValue'],
        },
      ],
      values: ['testValue'],
      code: 'oldCode',
    };

    expect(queryGenerate(dummyParams.queryItems, dummyParams.values, dummyParams.code)).toEqual([
      { fieldName: 'oldCode', values: ['testValue'] },
    ]);
  });

  it('sould adpaterDefaultValue work', () => {
    const dummyParams = { value: 'testValue', type: FormItemControlType.ASSOC_ATTR };
    expect(adpaterDefaultValue(dummyParams.value, dummyParams.type)).toEqual([]);
  });

  it('should initDefaultValue work when has query', () => {
    const dummyParams: FormRecordData.QueryItemBase[] = [
      {
        allowNull: false,
        controlType: 1,
        defaultValue: '',
        displayName: '',
        filterValue: '',
        parentDisplayName: '',
        propertyName: 'testcode1',
        sequenceNumber: 1,
        visible: true,
      },
      {
        allowNull: false,
        controlType: 1,
        defaultValue: '',
        displayName: '',
        filterValue: '',
        parentDisplayName: '',
        propertyName: 'testcode2',
        sequenceNumber: 1,
        visible: true,
        subFormTemplateId: 'subForm1',
      },
      {
        allowNull: false,
        controlType: 1,
        defaultValue: '',
        displayName: '',
        filterValue: '',
        parentDisplayName: '',
        propertyName: 'testcode3',
        sequenceNumber: 1,
        visible: true,
        subFormTemplateId: 'subForm1',
      },
    ];
    expect(initDefaultValue(dummyParams)).toEqual({
      initMainQuery: [{ fieldName: 'testcode1', values: [] }],
      initSubTable: [
        {
          schemaId: 'subForm1',
          queryItems: [
            { fieldName: 'testcode2', values: [] },
            { fieldName: 'testcode3', values: [] },
          ],
        },
      ],
    });
  });
});
