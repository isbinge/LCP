import React, { useState } from 'react';
import classNames from 'classnames';
import { RoleGroupDto, RoleDto } from '@/domain/role/data.d';

import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';

import styles from './index.scss';

interface RoleTreeProps {
  selectedRole: Nullable<RoleDto>;
  data: RoleGroupDto[];
  onSelect: (role: RoleDto) => void;
}

const RoleTree: React.FC<RoleTreeProps> = (props) => {
  const { data: roleGroups, selectedRole, onSelect } = props;

  const [isExpand, setIsExpand] = useState(true);

  const treeParentNode = (roleGroup: RoleGroupDto) => (
    <div
      className={classNames(styles.treeNode, styles.group)}
      onClick={() => {
        setIsExpand(!isExpand);
      }}
    >
      {isExpand ? <CaretDownOutlined /> : <CaretRightOutlined />} {roleGroup.groupName}
    </div>
  );
  const treeNormalNode = (role: RoleDto) => (
    <div
      key={role.roleId}
      onClick={() => {
        onSelect(role);
      }}
      className={classNames(styles.treeNode, styles.role, {
        [styles.select]: selectedRole?.roleId === role.roleId,
      })}
    >
      {role.roleName}
    </div>
  );
  return (
    <div className={styles.container}>
      {roleGroups.map((roleGroup) => (
        <div key={roleGroup.groupId}>
          {treeParentNode(roleGroup)}
          {isExpand ? <>{roleGroup.children.map((role) => treeNormalNode(role))}</> : null}
        </div>
      ))}
    </div>
  );
};

export default RoleTree;
