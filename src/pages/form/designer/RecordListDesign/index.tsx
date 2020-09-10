import React, { useEffect, useMemo } from 'react';
import { Tabs, Form, Card, Table, List, message } from 'antd';
import { useDispatch, useParams, useSelector } from 'dva';

import LoadingWave from '@comp/LoadingWave';
import { useLogger } from '@/utils/hooks/use-logger';
import { parseProperties } from '@/domain/form/instance/list-design/utils';
import { ColumnsType } from 'antd/lib/table';
import FormDesignerBtnBar from '@comp/FormDesignerBtnBar';
import FieldSettings from './FieldSettings';
import ListSettings from './ListSettings';
import RldSearchCondPreview from './components/SearchCondPreview';

import styles from './index.scss';

function colSpanHandler(dep: boolean) {
  if (dep) {
    return undefined;
  }
  return 0;
}

const RecordListDesign: React.FC = () => {
  const dispatch = useDispatch();
  const { templateId } = useParams();
  const [formField] = Form.useForm();
  const [formList] = Form.useForm();
  const log = useLogger('record-list-design', { preferGroup: 'expanded' });
  const [
    { settings, conditionsPreview, fieldsPreview },
    isLoading,
    isUpdating,
  ] = useSelector((state) => [
    state.formRecordDesign,
    state.loading.effects['formRecordDesign/getSettings'],
    state.loading.effects['formRecordDesign/updateSettings'],
  ]);

  const memoizedProperties = useMemo(() => parseProperties(settings?.propertys || []), [
    settings?.propertys,
  ]);

  const memoizedColumns = useMemo(() => {
    const columns: ColumnsType<object> = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },
    ];
    const map: ColumnsType<object> =
      settings?.columns.map((col) => {
        if (!col.id && col.childColumns) {
          return {
            title: col.parentDisplayName,
            align: 'center',
            colSpan: colSpanHandler(
              col.childColumns.map((cc) => cc.id).some((id) => fieldsPreview.includes(id)),
            ),
            children: col.childColumns.map((cc) => ({
              title: cc.displayName,
              dataIndex: cc.id,
              key: cc.id,
              colSpan: colSpanHandler(fieldsPreview.includes(cc.id)),
              align: 'center',
            })),
          };
        }
        return {
          title: col.displayName,
          dataIndex: col.id,
          key: col.id,
          colSpan: colSpanHandler(fieldsPreview.includes(col.id)),
          align: 'center',
        };
      }) || [];
    return columns.concat(map);
  }, [fieldsPreview]);

  const propertiesForPreview = useMemo(() => {
    return new Map(
      Array.from(memoizedProperties.values())
        .filter((prop) => conditionsPreview.includes(prop.queryItemId))
        .map((i) => [i.queryItemId, i]),
    );
  }, [conditionsPreview]);

  useEffect(() => {
    if (templateId) {
      dispatch({
        type: 'formRecordDesign/getSettings',
        payload: {
          formTplId: templateId,
        },
      });
    }
  }, [templateId]);

  return (
    <div className={styles.formRecordListDesign}>
      <FormDesignerBtnBar
        submitting={isUpdating}
        onSubmit={async () => {
          try {
            const fieldSettings = await formField.validateFields();
            const listSettings = await formList.validateFields();
            await dispatch({
              type: 'formRecordDesign/updateSettings',
              payload: {
                fieldSettings,
                listSettings,
                formTplId: templateId,
              },
            });
            message.success('Update successfully');
          } catch (e) {
            log('submit failed', e);
            message.error('Updating failed');
          }
        }}
      />
      <div className={styles.contentWrapper}>
        <Card className={styles.previewContainer} bordered={false}>
          <div>
            <div className={styles.title}>Search conditions</div>
            {conditionsPreview.length > 0 ? (
              <List
                bordered={false}
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 1,
                  xl: 2,
                  xxl: 3,
                }}
                style={{ padding: 16 }}
                dataSource={conditionsPreview.map((queryItemId) =>
                  propertiesForPreview.get(queryItemId),
                )}
                renderItem={(item) =>
                  item && (
                    <List.Item>
                      <RldSearchCondPreview type={item.controlType} label={item.displayName} />
                    </List.Item>
                  )
                }
              />
            ) : (
              <div className={styles.conditionPlaceholder}>
                <span>Pick search conditions from the right panel</span>
              </div>
            )}
          </div>
          <div>
            <div className={styles.title}>List fields</div>
            <Table
              columns={memoizedColumns}
              pagination={{ disabled: true, total: 1, current: 1 }}
            />
          </div>
        </Card>
        <Card
          bordered={false}
          className={styles.settingsContainer}
          bodyStyle={{ padding: 0, height: '100%' }}
        >
          <div
            style={{
              height: '100%',
              width: 300,
              position: 'relative',
            }}
          >
            <LoadingWave message="Loading settings..." loading={isLoading}>
              <Tabs defaultActiveKey="1" tabBarStyle={{ margin: 0 }}>
                <Tabs.TabPane
                  key="1"
                  tab="Field settings"
                  style={{
                    height: '100%',
                    padding: '12px 10px',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                  }}
                  forceRender
                >
                  <FieldSettings form={formField} data={settings} />
                </Tabs.TabPane>
                <Tabs.TabPane
                  key="2"
                  tab="List settings"
                  style={{
                    height: '100%',
                    padding: '12px 10px',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                  }}
                  forceRender
                >
                  <ListSettings
                    form={formList}
                    data={settings}
                    parsedProperties={memoizedProperties}
                  />
                </Tabs.TabPane>
              </Tabs>
            </LoadingWave>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecordListDesign;
