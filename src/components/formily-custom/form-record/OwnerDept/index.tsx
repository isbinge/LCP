import React, { useMemo } from 'react';
import {
  Select,
  // Input,
  Tabs,
  Tree,
} from 'antd';
// import useOwnerDepts from '@/domain/form/instance/hooks/useOwnerDeptId';

import {
  FormattedMessage as FM,
  //  useIntl
} from 'react-intl';

import FormRecordData from '@/domain/form/instance/data.d';
import useSelectionRange from '@/domain/form/instance/hooks/useSelectionRange';
import { OwnerDeptControl } from '@/domain/form/template/system/adapter/adapter-type';
import { SelectionRangeTabType } from '@/domain/form/template/common';

import { TreeProps } from 'antd/lib/tree';
import { SelectProps } from 'antd/lib/select';
import { useFormEffects } from '@formily/antd';
import styles from '../owner.scss';

const { TabPane } = Tabs;

// const { Search } = Input;

interface OwnerDeptProps {
  value: FormRecordData.OwnerDeptValue[];
  onChange: (value: FormRecordData.OwnerDeptValue[]) => void;
  ownerDepts?: FormRecordData.OwnerDeptValue[];
  ownerDeptControl: OwnerDeptControl;
}

const OwnerDept: React.FC<OwnerDeptProps> = (props) => {
  const { value: ownerDeptValues, onChange: handleChange, ownerDeptControl, ownerDepts } = props;
  // const intl = useIntl();

  const { unitSelectionRange: unitSelectionRangeString } = ownerDeptControl;

  const { unitSelectionRange, deptTreeData, otherTreeData, deptCtrlTreeData } = useSelectionRange(
    unitSelectionRangeString,
    useFormEffects,
    ownerDepts,
  );

  const handleDeptsSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    handleChange([
      {
        deptId: info.node.key as string,
        name: info.node.title as string,
      },
    ]);
  };

  const handleDeselect: SelectProps<string>['onDeselect'] = (selectedKey) => {
    handleChange(ownerDeptValues.filter((item) => item.deptId !== selectedKey));
  };

  const selectedKeys = useMemo(() => {
    return (ownerDeptValues && ownerDeptValues.map((item) => item.deptId)) || [];
  }, [ownerDeptValues]);

  return (
    <Select
      mode="tags"
      value={selectedKeys}
      options={
        ownerDeptValues && ownerDeptValues.map((item) => ({ label: item.name, value: item.deptId }))
      }
      dropdownClassName={styles.dorpDown}
      onDeselect={handleDeselect}
      dropdownRender={() => (
        <>
          {/* <Search
            placeholder={intl.formatMessage({ id: 'dict.search' })}
            className={styles.search}
            allowClear
          /> */}
          <Tabs className={styles.tabStyle} key={SelectionRangeTabType.DEPT}>
            {unitSelectionRange.dept && (
              <TabPane
                tab={<FM id="formtpl.schema.owner.modal.dept" />}
                key={SelectionRangeTabType.DEPT}
                className={styles.tabPaneStyle}
              >
                <Tree
                  className={styles.deptTreeStyle}
                  onSelect={handleDeptsSelect}
                  selectedKeys={selectedKeys}
                  defaultExpandedKeys={deptTreeData && [deptTreeData[0]?.key]}
                  treeData={deptTreeData}
                />
              </TabPane>
            )}
            {unitSelectionRange.deptCtrl?.length && (
              <TabPane
                tab={<FM id="formtpl.schema.owner.modal.deptctrl" />}
                key={SelectionRangeTabType.DEPT_CTRL}
                className={styles.tabPaneStyle}
              >
                <Tree
                  className={styles.deptTreeStyle}
                  onSelect={handleDeptsSelect}
                  selectedKeys={selectedKeys}
                  treeData={deptCtrlTreeData}
                />
              </TabPane>
            )}
            {unitSelectionRange.other?.length && (
              <TabPane
                tab={<FM id="forminst.schema.owner.mydept" />}
                key={SelectionRangeTabType.OTHER}
                className={styles.tabPaneStyle}
              >
                <Tree
                  className={styles.deptTreeStyle}
                  onSelect={handleDeptsSelect}
                  selectedKeys={selectedKeys}
                  treeData={otherTreeData}
                />
              </TabPane>
            )}
          </Tabs>
        </>
      )}
    />
  );
};

export default OwnerDept;
