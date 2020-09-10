import { useDispatch, useSelector } from 'dva';
import { useEffect, useMemo, useState } from 'react';
import { MemberInfoDto } from '@/domain/organization/data';
import FormRecordData from '../data.d';

/**
 * 获取默认的拥有者部门
 *
 * @param {string[]} dep useEffect依赖
 * @returns `ownerDepts` 默认所属部门 `ownerDeptIds`默认所属部门id
 */
const useOwnerDepts = (dep: string[]) => {
  const dispatch = useDispatch();

  const [defaultOrgId, orgs] = useSelector(({ account, organization }) => [
    account.defaultOrgId,
    organization.orgs,
  ]);
  const [ownerDepts, setOwnerDepts] = useState<FormRecordData.OwnerDeptValue[]>([]);
  const [ownerDeptIds, setOwnerDeptIds] = useState<string>('');

  useEffect(() => {
    dispatch({
      type: 'organization/getOrgs',
    });
  }, dep);

  const memberId = useMemo(
    () => orgs.find((org) => org.companyId === defaultOrgId)?.memberId || '',
    [defaultOrgId, orgs],
  );

  useEffect(() => {
    if (memberId) {
      dispatch<MemberInfoDto, { id: string }>({
        type: 'organization/requestMemberInfo',
        payload: {
          id: memberId,
        },
      }).then((memberInfo) => {
        const deptIds = memberInfo.departmentIds.split(';');
        const deptNames = memberInfo.departmentNames.split(';');
        setOwnerDepts(deptIds.map((deptId, index) => ({ deptId, name: deptNames[index] })));
        // setOwnerDeptIds(memberInfo.departmentIds);

        setOwnerDeptIds(memberInfo.departmentIds);
        // setOwnerDepts({
        //   deptId: memberInfo.departmentIds,
        //   name: memberInfo.departmentNames,
        // });
      });
    }
  }, [memberId]);

  return { ownerDepts, ownerDeptIds };
};

export default useOwnerDepts;
