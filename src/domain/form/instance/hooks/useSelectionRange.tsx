import { useMemo, ReactText, useEffect, useState } from 'react';
import { forEach, flatMap } from 'lodash';
import { TreeProps } from 'antd/lib/tree';
import { useDispatch, useSelector } from 'dva';

import { Department, DeptTreeDto } from '@/domain/organization/data.d';
import { RoleDto } from '@/domain/role/data.d';
import { IFormEffect, IFormActions, IFieldState } from '@formily/antd';
import { parseUnitSelectionRange } from '../../template/system/adapter/common';
import { SelectionRangeTabType } from '../../template/common';
import FormRecordData from '../data.d';

type SelectionRange = {
  [x in SelectionRangeTabType]?: ReactText[];
};

const generateTreeData = (
  data: Department[],
  deptIds: ReactText[],
  disabled: boolean = true,
): TreeProps['treeData'] =>
  data.map((item) => {
    if (disabled === false) {
      return {
        key: item.id,
        title: item.name,
        disabled: false,
        children: item.childrens ? generateTreeData(item.childrens, deptIds, false) : [],
      };
    }
    const disabledd = !deptIds.includes(item.id);
    return {
      key: item.id,
      title: item.name,
      disabled: !deptIds.includes(item.id),
      children: item.childrens ? generateTreeData(item.childrens, deptIds, disabledd) : [],
    };
  });

const useSelectionRange = (
  unitSelectionRangeString: string,
  useFormEffects: (effects: IFormEffect) => void,
  ownerDepts?: FormRecordData.OwnerDeptValue[],
) => {
  const dispatch = useDispatch();
  const [defaultOrgId, depts, roleGroups] = useSelector(({ organization, role, account }) => [
    account.defaultOrgId,
    organization.depts,
    role.roleGroups,
  ]);
  const [deptTreeData, setDeptTreeData] = useState<TreeProps['treeData']>([]);
  const [deptCtrlTreeData, setDeptCtrlTreeData] = useState<TreeProps['treeData']>([]);

  const [otherTreeData, setOtherTreeData] = useState<TreeProps['treeData']>([]);

  const unitSelectionRange = useMemo(() => {
    const range = parseUnitSelectionRange(unitSelectionRangeString);
    let isEmpty = true;
    const defaultRlt: SelectionRange = {
      dept: depts[0]?.id ? [depts[0].id] : [],
      //   dept: defaultOrgId ? [defaultOrgId] : [],
      other: [-1],
      role: [],
      deptCtrl: [],
    };
    const rlt: SelectionRange = {};
    forEach(range, (items, key) => {
      if (items.length > 0) {
        rlt[key] = items;
        isEmpty = false;
      }
    });

    return isEmpty ? defaultRlt : rlt;
  }, [depts, unitSelectionRangeString]);

  const roleTreeData = useMemo(() => {
    if (unitSelectionRange && unitSelectionRange.role) {
      const roles = flatMap(roleGroups, 'children');
      return roles
        .map((item: RoleDto) => ({
          key: item.roleId,
          title: item.roleName,
        }))
        .filter((item) => unitSelectionRange?.role?.includes(item.key));
    }
    return [];
  }, [roleGroups, unitSelectionRange.role]);

  useEffect(() => {
    if (unitSelectionRange.role?.length) {
      dispatch({
        type: 'role/getRoles',
        payload: { id: defaultOrgId },
      });
    }
  }, [unitSelectionRange.role]);

  useEffect(() => {
    if (unitSelectionRange.dept?.length) {
      dispatch<DeptTreeDto>({
        type: 'organization/getDeptTree',
        payload: {
          memberIds: [],
          deptIds: unitSelectionRange.dept,
        },
      }).then((res) => {
        setDeptTreeData(generateTreeData([res.fullDeptInfo], res.deptIds));
      });
    } else if (unitSelectionRange.dept?.length === 0) {
      dispatch({
        type: 'organization/requestDepts',
      });
    }
  }, [unitSelectionRange.dept]);

  const handleDeptCtrlTree = (
    ownerDeptCtrls: ReactText[],
    getFieldValue: IFormActions['getFieldValue'],
  ) => {
    // 暂未实现人员控件
    const memberIds: string[] = [];
    let deptIds: string[] = [];
    ownerDeptCtrls.forEach((code) => {
      const ctrlValue = getFieldValue(code);
      if (ctrlValue && Array.isArray(ctrlValue)) {
        deptIds = deptIds.concat(ctrlValue.map((item: { deptId: string }) => item.deptId));
      } else if (ctrlValue) {
        deptIds = deptIds.concat(ctrlValue.deptId);
      }
    });
    if (memberIds.length || deptIds.length) {
      dispatch<DeptTreeDto>({
        type: 'organization/getDeptTree',
        payload: {
          memberIds,
          deptIds,
        },
      }).then((res) => {
        setDeptCtrlTreeData(generateTreeData([res.fullDeptInfo], res.deptIds));
      });
    }
  };

  useFormEffects(($, { getFieldValue }) => {
    const ownerDeptCtrls = unitSelectionRange.deptCtrl || [];
    if (unitSelectionRange.deptCtrl?.length) {
      $('onFormMount').subscribe(() => {
        handleDeptCtrlTree(ownerDeptCtrls, getFieldValue);
      });
      ownerDeptCtrls.forEach((field) => {
        $('onFieldChange', field).subscribe((fieldState: IFieldState) => {
          if (fieldState.unmounted || !fieldState.modified) {
            return;
          }
          handleDeptCtrlTree(ownerDeptCtrls, getFieldValue);
        });
      });
    }
  });

  useEffect(() => {
    if (unitSelectionRange.other && ownerDepts?.length) {
      const deptIds = ownerDepts.map((item) => item.deptId);
      if (deptIds.length) {
        dispatch<DeptTreeDto>({
          type: 'organization/getDeptTree',
          payload: {
            memberIds: [],
            deptIds,
          },
        }).then((res) => {
          setOtherTreeData(generateTreeData([res.fullDeptInfo], res.deptIds));
        });
      }
    }
  }, [unitSelectionRange.other && unitSelectionRange.other[0] === -1, ownerDepts]);

  return { unitSelectionRange, deptTreeData, roleTreeData, otherTreeData, deptCtrlTreeData };
};

export default useSelectionRange;
