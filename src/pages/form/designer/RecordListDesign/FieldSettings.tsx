import React, { useState, useMemo, useEffect } from 'react';
import { Checkbox, Dropdown, Form, Card } from 'antd';
import { flatMapDeep } from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'dva';
import { PlusOutlined } from '@ant-design/icons';

import { flattenColumns } from '@/domain/form/instance/list-design/utils';

import type { FormInstance } from 'antd/lib/form';
import type { CheckboxProps, CheckboxGroupProps } from 'antd/lib/checkbox';
import type ListDesignData from '@/domain/form/instance/list-design/data.d';

import styles from './index.scss';

interface FieldSettingsProps {
  form: FormInstance;
  data: ListDesignData.GetListSettingDto | null;
}

type SavePreview = {
  [propName in 'fieldsPreview' | 'conditionsPreview']?: unknown;
};

const scListItemStyle: React.CSSProperties = { display: 'flex', padding: '4px 0' };
const lfListItemStyle: React.CSSProperties = { display: 'flex', padding: '4px 8px' };

const SearchCondition: React.FC<{ item: ListDesignData.Property }> = ({ item }) => {
  return (
    <li>
      <div style={{ ...lfListItemStyle }}>
        {item.displayName}
        <div style={{ flex: 1 }} />
        {item.queryItemId && (
          <Checkbox value={item.queryItemId} onClick={(e) => e.stopPropagation()} />
        )}
      </div>
      {item.childProperties && (
        <ul style={{ paddingLeft: 8 }}>
          {item.childProperties.map((cp) => {
            return (
              <li style={{ ...lfListItemStyle }} key={cp.queryItemId}>
                <span>{cp.displayName}</span>
                <div style={{ flex: 1 }} />
                <Checkbox value={cp.queryItemId} onClick={(e) => e.stopPropagation()} />
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

const ListField: React.FC<{ col: ListDesignData.ColumnGet; idx: number }> = ({ col, idx }) => {
  return (
    <Draggable draggableId={col.id ?? String(col.parentDisplayName) + idx} index={idx}>
      {(provided) => (
        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div style={{ ...scListItemStyle }}>
            {col.id ? col.displayName : col.parentDisplayName}
            <div style={{ flex: 1 }} />
            {col.id && <Checkbox value={col.id} onClick={(e) => e.stopPropagation()} />}
          </div>
          {!col.id && (
            <ul style={{ marginLeft: 16 }}>
              {col.childColumns?.map((cc) => {
                return (
                  <li style={{ ...scListItemStyle }} key={cc.id}>
                    {cc.displayName}
                    <div style={{ flex: 1 }} />
                    <Checkbox value={cc.id} onClick={(e) => e.stopPropagation()} />
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      )}
    </Draggable>
  );
};

const FieldSettings: React.FC<FieldSettingsProps> = ({ form, data: settings }) => {
  const dispatch = useDispatch();
  const { conditionsPreview } = useSelector((state) => state.formRecordDesign);

  const savePreview = (payload: SavePreview) =>
    dispatch({
      type: 'formRecordDesign/savePreview',
      payload,
    });
  /**
   * 搜索条件全部数据
   * 仅用于渲染 UI
   */
  const queryItemAll = useMemo(() => {
    if (settings?.propertys) {
      return flatMapDeep(settings?.propertys, (prop) => {
        if (!prop.queryItemId) {
          return [
            prop.childProperties!.map((cp) => ({
              ...cp,
              $$parentName: prop.displayName,
            })),
          ];
        }
        return [prop];
      });
    }
    return [];
  }, [settings?.propertys]);

  const queryItemIdAll = useMemo(() => queryItemAll.map((i) => i.queryItemId), [queryItemAll]);

  /**
   * 列表字段全部数据
   * 仅用于渲染 UI
   */
  const colAll = useMemo(() => {
    if (settings?.columns) {
      return flatMapDeep(settings?.columns, (col) => {
        if (!col.id) {
          return [col.childColumns!];
        }
        return [col];
      });
    }
    return [];
  }, [settings?.columns]);

  const colIdAll = useMemo(() => colAll.map((i) => i.id), [colAll]);

  // 查询条件初始值
  const conditionsInit = useMemo(() => {
    return settings?.queryItems.map((i) => i.id) || [];
  }, [settings?.queryItems]);

  // 列表字段初始值
  const fieldsInit = useMemo(() => {
    return Array.from(flattenColumns(settings?.columns || []).values())
      .filter((col) => col.visible)
      .map((i) => i.id);
  }, [settings?.columns]);

  useEffect(() => {
    form.setFieldsValue({
      searchConditions: conditionsInit,
      listFields: fieldsInit,
    });
    savePreview({ conditionsPreview: conditionsInit });
    dispatch({
      type: 'formRecordDesign/savePreview',
      payload: {
        conditionsPreview: conditionsInit,
        fieldsPreview: fieldsInit,
      },
    });
  }, [settings]);

  const [conditionsCheckAllConfig, setConditionsCheckAllConfig] = useState({
    indeterminate:
      (conditionsInit.length < queryItemIdAll.length && conditionsInit.length > 0) || false,
    allChecked: conditionsInit.length === queryItemIdAll.length || false,
  });

  const [fieldsCheckAllConfig, setFieldsCheckAllConfig] = useState({
    indeterminate: (fieldsInit.length < queryItemIdAll.length && fieldsInit.length > 0) || false,
    allChecked: fieldsInit.length === queryItemIdAll.length || false,
  });

  const handleConditionChange: CheckboxGroupProps['onChange'] = (checkedList) => {
    setConditionsCheckAllConfig({
      indeterminate:
        (checkedList.length < queryItemIdAll?.length && checkedList.length > 0) || false,
      allChecked: checkedList.length === queryItemIdAll.length,
    });
  };

  const handleConditionCheckAllChange: CheckboxProps['onChange'] = (e) => {
    const newVal = e.target.checked ? queryItemIdAll : [];
    form.setFieldsValue({
      searchConditions: newVal,
    });
    dispatch({
      type: 'formRecordDesign/savePreview',
      payload: {
        conditionsPreview: newVal,
      },
    });
    setConditionsCheckAllConfig({
      indeterminate: false,
      allChecked: e.target.checked,
    });
  };

  const handleFieldsChange: CheckboxGroupProps['onChange'] = (checkedList) => {
    setFieldsCheckAllConfig({
      indeterminate:
        (checkedList.length < queryItemIdAll?.length && checkedList.length > 0) || false,
      allChecked: checkedList.length === queryItemIdAll.length,
    });
  };

  const handleFieldsCheckAllChange: CheckboxProps['onChange'] = (e) => {
    const newVal = e.target.checked ? colIdAll : [];
    form.setFieldsValue({
      listFields: newVal,
    });
    savePreview({ fieldsPreview: newVal });
    setFieldsCheckAllConfig({
      indeterminate: false,
      allChecked: e.target.checked,
    });
  };

  return (
    <div
      style={{
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <DragDropContext onDragEnd={() => {}}>
        <Form
          form={form}
          onValuesChange={(changed) => {
            if (changed.searchConditions) {
              savePreview({ conditionsPreview: changed.searchConditions });
            }
            if (changed.listFields) {
              savePreview({ fieldsPreview: changed.listFields });
            }
          }}
        >
          <Form.Item label={<span className={styles.label}>Search conditions</span>} colon={false}>
            <Dropdown
              forceRender
              trigger={['click']}
              overlay={
                <div>
                  <Card
                    bodyStyle={{ padding: 0 }}
                    bordered={false}
                    style={{
                      width: 256,
                      padding: 8,
                      maxHeight: 250,
                      background: '#fff',
                      overflow: 'hidden auto',
                    }}
                  >
                    <Form.Item noStyle>
                      <ul style={{ listStyle: 'none', marginBottom: 0 }}>
                        <li style={{ display: 'flex', padding: '4px 8px' }}>
                          <em>Select All</em>
                          <div style={{ flex: 1 }} />
                          <Checkbox
                            onClick={(e) => e.stopPropagation()}
                            indeterminate={conditionsCheckAllConfig.indeterminate}
                            onChange={handleConditionCheckAllChange}
                            checked={conditionsCheckAllConfig.allChecked}
                          />
                        </li>
                        <Form.Item name="searchConditions" noStyle>
                          <Checkbox.Group
                            onChange={handleConditionChange}
                            style={{ width: '100%' }}
                          >
                            {settings?.propertys?.map((item) => (
                              <SearchCondition item={item} key={item.code} />
                            ))}
                          </Checkbox.Group>
                        </Form.Item>
                      </ul>
                    </Form.Item>
                  </Card>
                </div>
              }
            >
              <a onClick={(e) => e.preventDefault()} style={{ display: 'flex' }}>
                <div style={{ flex: 1 }} />
                <PlusOutlined />
              </a>
            </Dropdown>
          </Form.Item>
          <div>
            {queryItemAll.map(
              (qi) =>
                conditionsPreview.includes(qi.queryItemId) && (
                  <div style={{ margin: '8px 0' }}>
                    {qi.$$parentName ? `${qi.$$parentName} > ${qi.displayName}` : qi.displayName}
                  </div>
                ),
            )}
          </div>
          <Form.Item
            label={<span className={styles.label}>List fields</span>}
            labelCol={{ span: 24 }}
            style={{ marginTop: 32 }}
          >
            <ul style={{ listStyle: 'none', marginBottom: 0 }}>
              <li style={{ display: 'flex', padding: '4px 0' }}>
                <em>Select All</em>
                <div style={{ flex: 1 }} />
                <Checkbox
                  indeterminate={fieldsCheckAllConfig.indeterminate}
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleFieldsCheckAllChange}
                  checked={fieldsCheckAllConfig.allChecked}
                />
              </li>
              <Form.Item name="listFields" labelCol={{ span: 24 }}>
                <Checkbox.Group style={{ width: '100%' }} onChange={handleFieldsChange}>
                  <Droppable droppableId="list">
                    {(droppableProvided) => (
                      <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                        {settings?.columns?.map((col, idx) => (
                          <ListField col={col} idx={idx} key={col.id} />
                        ))}
                        {droppableProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Checkbox.Group>
              </Form.Item>
            </ul>
          </Form.Item>
        </Form>
      </DragDropContext>
    </div>
  );
};

export default FieldSettings;
