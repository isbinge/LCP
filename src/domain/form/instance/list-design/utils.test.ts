import { parseProperties, flattenColumns } from './utils';
import type ListDesignData from './data';

describe('form-record list-design utils', () => {
  it('should parseProperties work', () => {
    const properties = [
      {
        code: 'foo',
        queryItemId: null,
        childProperties: [
          {
            code: 'aux',
            queryItemId: 'qux',
            childProperties: null,
          },
          {
            code: 'qaz',
            queryItemId: 'quux',
            childProperties: null,
          },
        ],
      },
      {
        code: 'baz',
        queryItemId: 'corge',
        childProperties: null,
      },
    ];
    const result = new Map([
      [
        'qux',
        {
          code: 'foo.aux',
          queryItemId: 'qux',
          childProperties: null,
        },
      ],
      [
        'quux',
        {
          code: 'foo.qaz',
          queryItemId: 'quux',
          childProperties: null,
        },
      ],
      [
        'corge',
        {
          code: 'baz',
          queryItemId: 'corge',
          childProperties: null,
        },
      ],
    ]);
    expect(parseProperties(properties as ListDesignData.Property[])).toEqual(result);
  });
  it('should flattenColumns work', () => {
    const columns = [
      {
        id: 'foo',
        childColumns: null,
      },
      {
        id: null,
        childColumns: [
          {
            id: 'qux',
            childColumns: null,
          },
          {
            id: 'baz',
            childColumns: null,
          },
        ],
      },
    ];
    const result = new Map([
      [
        'foo',
        {
          id: 'foo',
          childColumns: null,
        },
      ],
      [
        'qux',
        {
          id: 'qux',
          childColumns: null,
        },
      ],
      [
        'baz',
        {
          id: 'baz',
          childColumns: null,
        },
      ],
    ]);
    expect(flattenColumns(columns as ListDesignData.ColumnGet[])).toEqual(result);
  });
});
