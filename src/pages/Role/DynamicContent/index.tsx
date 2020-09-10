import React, { lazy } from 'react';

import { RoleType, RoleDto } from '@/domain/role/data.d';

import styles from './index.scss';

interface DynamicContentProps {
  role: RoleDto;
}

// export interface RoleComponentType {
//   id: string;
// }

export type RoleComponentType = DynamicContentProps;

type CompPath = {
  [key in RoleType]: React.ComponentType<RoleComponentType>;
};

// const SystemAdmin = lazy(() => import('./SystemAdmin'));

const dynamicImportMap: CompPath = {
  0: lazy(() => import('./SystemAdmin')),
  1: lazy(() => import('./Users')),
  2: lazy(() => import('./SubAdmin')),
  3: lazy(() => import('./Users')),
};

const DynamicContent: React.FC<DynamicContentProps> = (props) => {
  const { role } = props;
  const Comp = dynamicImportMap[role.roleType];

  return (
    <div className={styles.container}>
      <Comp role={role} />
    </div>
  );
};
export default DynamicContent;
