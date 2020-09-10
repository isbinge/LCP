import { flattenData } from './utils';

const fakeData = [
  {
    id: '1',
    name: 'ss',
    childrens: [
      {
        id: '2',
        name: 'ddd',
      },
    ],
  },
];

describe('test utils', () => {
  it('test flattenData', () => {
    const flattened = flattenData(fakeData);
    expect(flattened).toEqual([
      {
        id: '1',
        name: 'ss',
        childrens: [
          {
            id: '2',
            name: 'ddd',
          },
        ],
      },
      {
        id: '2',
        name: 'ddd',
      },
    ]);
  });
});
