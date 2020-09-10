import React, { useEffect, useState, useMemo } from 'react';
import { Button, message } from 'antd';
import sortBy from 'lodash/sortBy';
import { v1 as uuidv1 } from 'uuid';
import { useParams, useHistory, useDispatch, useSelector } from 'dva';
import { CloseOutlined } from '@ant-design/icons';
import { FormattedMessage as FM } from 'react-intl';
import LcpIntl from '@/utils/locale';

import LoadingWave from '@comp/LoadingWave';
import PortalHeader from '@comp/PortalHeader';
import { actions } from '@comp/formily-custom/form-record';
import { CommonRecord } from '@/domain/form/template/adapter';
import { getFormCreateSchema } from '@/domain/form/instance/edit/schema';
import HelmetTitle from '@comp/HelmetTitle';
import { FormItemControlType } from '@/constants/form/common';
// import useOwnerDepts from '@/domain/form/instance/hooks/useOwnerDeptId';
import { FormSchemaData } from '../shared/form-schema';
import {
  getGroupTitleMappings,
  convertFormStateToServer,
  getInitialValues,
  Mode,
  getDataLinkageMappings,
  getAssocFormMappings,
} from '../shared/common';
import DynamicSchemaForm from '../components/DynamicSchemaForm';

import styles from './index.scss';
import 'antd/dist/antd.css';

const FormCreate: React.FC = () => {
  const { templateId, instanceId } = useParams();
  const { goBack } = useHistory();
  const dispatch: Dva.Dispatch = useDispatch();
  const [formSchemaData, setSchemaData] = useState<FormSchemaData[]>([]);
  const [rawFormData, setRawFormData] = useState<CommonRecord>({});
  const [displayMode, setDisplayMode] = useState(Mode.CENTER);
  const [
    isLoading,
    isCreateLoading,
    isSaveLoading,
    userId,
  ] = useSelector(({ loading, account }) => [
    loading.effects['formInstance/getFormToCreate'],
    loading.effects['formInstance/createForm'],
    loading.effects['formInstance/saveForm'],
    account.userId,
  ]);
  const { intl } = LcpIntl;
  useEffect(() => {
    if (templateId && instanceId) {
      dispatch({
        type: 'formInstance/getFormToCreate',
        payload: { templateId, formCode: instanceId },
      })
        .then((res) => {
          setRawFormData(res.raw);
          setSchemaData(
            sortBy(
              res.parsed.filter(
                (item: FormSchemaData) =>
                  item &&
                  (item.sequenceNumber >= 0 ||
                    item.controlType === FormItemControlType.OWNER ||
                    item.controlType === FormItemControlType.OWNER_DEPARTMENT ||
                    item.controlType === FormItemControlType.CREATOR),
              ),
              ['sequenceNumber'],
            ),
          );
        })
        .catch(() => {
          message.error('Fetching form template failed');
        });
    }
  }, [templateId, instanceId]);

  const schema = useMemo(
    () => getFormCreateSchema(formSchemaData, true, rawFormData.ownerDeptControl?.value || []),

    [formSchemaData, rawFormData],
  );
  const [groupTitleMappings, dataLinkageMappings, assocFormMappings] = useMemo(
    () => [
      getGroupTitleMappings(formSchemaData),
      getDataLinkageMappings(formSchemaData),
      getAssocFormMappings(formSchemaData),
    ],
    [formSchemaData],
  );

  const handleSubmit = (saveFormDataMode: string) => {
    actions.submit((values) => {
      const convertedFormState = convertFormStateToServer(values, formSchemaData);
      const ownerDeptId = values?.OwnerDeptId?.map((item: { deptId: string }) => item.deptId).join(
        ',',
      );
      dispatch({
        type: `formInstance/${saveFormDataMode}`,
        payload: {
          data: {
            objectId: uuidv1(),
            formTemplateId: rawFormData.formTemplateId,
            formTemplateCode: rawFormData.code,
            ownerId: values?.OwnerId?.userId,
            ownerDeptId,
            currentUserId: rawFormData.currentUserId || userId,
            DataList: convertedFormState.dataList,
            subFormDataDtoList: convertedFormState.subFormDataDtoList,
          },
        },
      }).then((res) => {
        if (res === 'Created' || res === 'Saved') {
          message.success(res);
          goBack();
        }
      });
    });
  };

  return (
    <div className={styles.container}>
      <HelmetTitle title={`${rawFormData.name}-${intl.formatMessage({ id: 'dict.newrecord' })}`} />
      <PortalHeader style={{ display: displayMode === 'center' ? 'flex' : 'none' }}>
        <div className={styles.header}>
          <div>
            <span className={styles.title}>
              {rawFormData.name || <FM id="formtpl.schema.form.formname.default" />}-
              <FM id="dict.newrecord" />
            </span>
          </div>
          <div className={styles.toolbar}>
            <Button
              loading={isCreateLoading}
              type="primary"
              onClick={() => {
                handleSubmit('createForm');
              }}
            >
              <FM id="dict.submit" />
            </Button>
            <Button
              loading={isSaveLoading}
              onClick={() => {
                handleSubmit('saveForm');
              }}
            >
              <FM id="dict.saveasdraft" />
            </Button>
            <CloseOutlined onClick={goBack} className={styles.close} />
          </div>
        </div>
      </PortalHeader>
      <LoadingWave message={<FM id="loading.forminst.getform" />} loading={isLoading}>
        <div className={styles.schemaBody}>
          <div
            className={styles.schemaInfo}
            style={{ width: displayMode === 'center' ? 950 : '100%' }}
          >
            {Object.keys(schema.properties || {}).length > 0 && (
              <DynamicSchemaForm
                initialValues={getInitialValues(formSchemaData, 'defaultValue')}
                schema={schema}
                groupTitleMappings={groupTitleMappings}
                dataLinkageMappings={dataLinkageMappings}
                assocFormMappings={assocFormMappings}
                handleFullScreen={setDisplayMode}
                isCreate
              />
            )}
          </div>
        </div>
      </LoadingWave>
    </div>
  );
};

export default FormCreate;
