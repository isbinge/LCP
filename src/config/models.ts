import GlobalModel from '@/domain/model';
import AppModel from '@/domain/app/model';
import AccountModel from '@/domain/account/model';
import FormTemplateModel from '@/domain/form/template/model';
import FormInstanceModel from '@/domain/form/instance/model';
import FormRecordListDesignModel from '@/domain/form/instance/list-design/model';
import OrganizationModel from '@/domain/organization/model';
import RoleModel from '@/domain/role/model';

const modelConfig = () => [
  GlobalModel,
  AccountModel,
  AppModel,
  FormTemplateModel,
  FormInstanceModel,
  OrganizationModel,
  RoleModel,
  FormRecordListDesignModel,
];

export default modelConfig;
