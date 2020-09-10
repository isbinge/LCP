import { OrgCollection } from './data.d';

export const flattenData = (depts: OrgCollection[]) => {
  const res: OrgCollection[] = [];
  const loop = (data: OrgCollection[]) => {
    data.forEach((item) => {
      res.push(item);
      if (item.childrens && item.childrens.length > 0) {
        loop(item.childrens);
      }
    });
  };
  loop(depts);
  return res;
};
