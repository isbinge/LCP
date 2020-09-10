import React, { useEffect, useState, useMemo } from 'react';
import { message, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useParams, useHistory, useDispatch, useSelector } from 'dva';
import { FormattedMessage as FM } from 'react-intl';
import { sortBy } from 'lodash';

import LoadingWave from '@comp/LoadingWave';
import PortalHeader from '@comp/PortalHeader';
import { actions } from '@comp/formily-custom/form-record';

import HelmetTitle from '@comp/HelmetTitle';
import { FormItemControlType } from '@/constants/form/common';
import useOwnerDepts from '@/domain/form/instance/hooks/useOwnerDeptId';
import { CommonRecord } from '@/domain/form/template/adapter';
import { getFormCreateSchema } from '@/domain/form/instance/edit/schema';
import DynamicSchemaForm from '../components/DynamicSchemaForm';
import { FormSchemaData } from '../shared/form-schema';
import {
  getGroupTitleMappings,
  convertFormStateToServer,
  getInitialValues,
  Mode,
  getDataLinkageMappings,
  getAssocFormMappings,
} from '../shared/common';

import styles from './index.scss';
import 'antd/dist/antd.css';

const FormUpdate: React.FC = () => {
  const { templateId, objectId, instanceId } = useParams();
  const { goBack } = useHistory();
  const dispatch: Dva.Dispatch = useDispatch();
  const [formSchemaData, setSchemaData] = useState<FormSchemaData[]>([]);
  const [rawFormData, setRawFormData] = useState<CommonRecord>({});
  const [isDraft, setIsDraft] = useState(false);
  const [displayMode, setDisplayMode] = useState(Mode.CENTER);
  const [{ userId }, isLoading, isUpdateLoading] = useSelector(({ loading, account }) => [
    account,
    loading.effects['formInstance/getFormToUpdate'],
    loading.effects['formInstance/updateForm'],
  ]);
  const { ownerDepts } = useOwnerDepts([]);

  useEffect(() => {
    if (templateId && instanceId) {
      dispatch({
        type: 'formInstance/getFormToUpdate',
        payload: {
          templateId,
          formCode: instanceId,
          objectId,
        },
      }).then((res) => {
        setRawFormData(res.raw);
        setIsDraft(res.raw.auditStat === 2);
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
      });
    }
  }, [templateId, objectId]);

  const schema = useMemo(
    () => getFormCreateSchema(formSchemaData, false, ownerDepts),

    [formSchemaData, ownerDepts],
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
          objectId,
          data: {
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
        message.success(res);
        goBack();
      });
    });
  };
  const handleDelete = () => {
    dispatch({
      type: 'formInstance/deleteForm',
      payload: {
        objectId,
      },
    }).then((res) => {
      if (res === 'Deleted') {
        message.success(res);
        goBack();
      }
    });
  };
  return (
    <div className={styles.container}>
      <HelmetTitle title={rawFormData.name} />
      <PortalHeader style={{ display: displayMode === 'center' ? 'flex' : 'none' }}>
        <div className={styles.header}>
          <div>
            <span className={styles.title}>
              {rawFormData.name || <FM id="formtpl.schema.form.formname.default" />}
            </span>
          </div>
          <div className={styles.toolbar}>
            <Button
              loading={isUpdateLoading}
              type="primary"
              onClick={() => {
                handleSubmit('updateForm');
              }}
            >
              <FM id="dict.submit" />
            </Button>
            {isDraft && (
              <>
                <Button
                  onClick={() => {
                    handleSubmit('updateTemporaryForm');
                  }}
                >
                  <FM id="dict.saveasdraft" />
                </Button>
                <Button onClick={handleDelete}>
                  <FM id="dict.delete" />
                </Button>
              </>
            )}
            <CloseOutlined onClick={goBack} className={styles.close} />
          </div>
        </div>
      </PortalHeader>
      <LoadingWave message={<FM id="loading.forminst.getFormdata" />} loading={isLoading}>
        <div className={styles.schemaBody}>
          <div
            className={styles.schemaInfo}
            style={{ width: displayMode === 'center' ? 950 : '100%' }}
          >
            {Object.keys(schema.properties || {}).length > 0 && (
              <DynamicSchemaForm
                schema={schema}
                groupTitleMappings={groupTitleMappings}
                dataLinkageMappings={dataLinkageMappings}
                assocFormMappings={assocFormMappings}
                initialValues={getInitialValues(formSchemaData, 'value')}
                handleFullScreen={setDisplayMode}
              />
            )}
          </div>
        </div>
      </LoadingWave>
    </div>
  );
};

export default FormUpdate;
