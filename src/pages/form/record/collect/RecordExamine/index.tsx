import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { useParams, useHistory, useDispatch, useSelector } from 'dva';
import { sortBy } from 'lodash';
import { FormattedMessage as FM } from 'react-intl';
import { SchemaForm } from '@formily/antd';
import { LinkR } from '@lib/react-router-dom';
import { CloseOutlined } from '@ant-design/icons';

import LoadingWave from '@comp/LoadingWave';
import { actions } from '@comp/formily-custom/form-record';
import PortalHeader from '@comp/PortalHeader';
import HelmetTitle from '@comp/HelmetTitle';
import { getFormInfoSchema } from '@/domain/form/instance/examine/schema';
import { getFormEffects } from '@/domain/form/instance/effect.common';
import { getGroupTitleMappings, getInitialValues, Mode } from '../shared/common';
import { FormSchemaData } from '../shared/form-schema';

import styles from './index.scss';
import './index.global.scss';

const FormInfo: React.FC = () => {
  const { appId, templateId, objectId, instanceId } = useParams();
  const { goBack } = useHistory();
  const dispatch: Dva.Dispatch = useDispatch();
  const [formSchemaData, setFormSchemaData] = useState<FormSchemaData[]>([]);
  const [formDataName, setFormDataName] = useState('');
  const [displayMode, setDisplayMode] = useState(Mode.CENTER);
  const [isLoading, isDeleteLoading] = useSelector(({ loading }) => [
    loading.effects['formInstance/getFormInfo'],
    loading.effects['formInstance/deleteForm'],
  ]);

  useEffect(() => {
    dispatch({
      type: 'formInstance/getFormInfo',
      payload: {
        templateId,
        formCode: instanceId,
        objectId,
      },
    }).then((res) => {
      setFormDataName(res.raw.name);
      setFormSchemaData(
        sortBy(
          res.parsed.filter((item: { sequenceNumber: number }) => item && item.sequenceNumber >= 0),
          ['sequenceNumber'],
        ),
      );
    });
  }, [instanceId, objectId]);

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

  const schema = getFormInfoSchema(
    formSchemaData.filter((item) => item.hasOwnProperty('controlType')),
  );

  const groupTitleMappings = getGroupTitleMappings(formSchemaData);

  return (
    <div className={styles.container}>
      <HelmetTitle title={formDataName} />
      <PortalHeader style={{ display: displayMode === 'center' ? 'flex' : 'none' }}>
        <div className={styles.header}>
          <div>
            <span className={styles.title}>
              {formDataName || <FM id="formtpl.schema.form.formname.default" />}
            </span>
          </div>
          <div className={styles.toolbar}>
            <LinkR
              to="/app/:appId/form/:templateId/inst/:instanceId/edit/:objectId"
              values={{
                appId,
                templateId,
                objectId,
                instanceId,
              }}
              replace
            >
              <Button type="primary">
                <span>
                  <FM id="dict.edit" />
                </span>
              </Button>
            </LinkR>
            <Button onClick={handleDelete} loading={isDeleteLoading}>
              <span>
                <FM id="dict.delete" />
              </span>
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
              <SchemaForm
                className="form-schema"
                schema={schema}
                initialValues={getInitialValues(formSchemaData, 'value', true)}
                colon={false}
                effects={getFormEffects({ groupTitleMappings }, setDisplayMode)}
                actions={actions}
              />
            )}
          </div>
        </div>
      </LoadingWave>
    </div>
  );
};

export default FormInfo;
