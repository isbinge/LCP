import React, { useEffect, useMemo } from 'react';
import Form, { FormInstance } from 'antd/lib/form';
import { Radio, Tooltip, Select } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';

import { MassOpts, SortMethod } from '@/constants/list-design/enum';
import { FormItemControlType } from '@/constants/form/common';
import type ListDesignData from '@/domain/form/instance/list-design/data.d';

interface ListSettingsProps {
  form: FormInstance;
  data: ListDesignData.GetListSettingDto | null;
  parsedProperties: Map<string, ListDesignData.Property>;
}

const ALLOWED_SORTING_FIELD_TYPE = [
  FormItemControlType.CREATE_TIME,
  FormItemControlType.MODIFY_TIME,
  FormItemControlType.INPUT,
  FormItemControlType.TEXTAREA,
  FormItemControlType.DATE,
  FormItemControlType.NUMBER,
  FormItemControlType.SELECT,
  FormItemControlType.RADIO,
  FormItemControlType.CHECKBOX,
  FormItemControlType.SWITCH,
  FormItemControlType.SERIAL_NO,
];

const ListSettings: React.FC<ListSettingsProps> = ({ form, data: settings, parsedProperties }) => {
  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        // optionalDisplayMode: settings.optionalDisplayModel.split(';').filter((i) => i),
        // defaultDisplayMode: '1',
        // webDisplayMode: settings.pcDefaultDisplayModel.toString(),
        // mobileDisplayMode: settings.mobileDefaultDisplayModel.toString(),
        massOperation: settings.allowBatchOperation.toString(),
        sortByField: settings.orderByFieldCode,
        sortMethod: settings.orderByDirection.toString(),
      });
    }
  }, [settings]);

  const memoizedFilteredParsedProps = useMemo(
    () =>
      Array.from(parsedProperties.values()).filter((property) => {
        return ALLOWED_SORTING_FIELD_TYPE.includes(property.controlType);
      }),
    [parsedProperties],
  );

  return (
    <div
      style={{
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <Form form={form} name="list" labelCol={{ span: 24 }}>
        {/* <Form.Item label="Optional display mode" name="optionalDisplayMode">
          <Checkbox.Group
            onChange={(values) => {
              if (!values.includes(form.getFieldValue('webDisplayMode'))) {
                form.setFieldsValue({
                  webDisplayMode: ListDisplayMode.List,
                });
              }
              if (!values.includes(form.getFieldValue('mobileDisplayMode'))) {
                form.setFieldsValue({
                  mobileDisplayMode: ListDisplayMode.List,
                });
              }
            }}
          >
            <Checkbox value={ListDisplayMode.List} disabled>
              List
            </Checkbox>
            <Checkbox value={ListDisplayMode.Calendar}>Calendar</Checkbox>
            <Checkbox value={ListDisplayMode.Timeline}>Timeline</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="Default display mode" name="defaultDisplayMode">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="1">Web</Radio.Button>
            <Radio.Button value="2">Mobile</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Default display mode"
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.defaultDisplayMode !== currentValues.defaultDisplayMode ||
            prevValues.optionalDisplayMode !== currentValues.optionalDisplayMode
          }
        >
          {({ getFieldValue }) => {
            const isWeb = getFieldValue('defaultDisplayMode') === '1';
            return (
              <>
                <Form.Item
                  name={isWeb ? 'webDisplayMode' : undefined}
                  noStyle={!isWeb}
                  label="Default display mode (Web)"
                >
                  {isWeb && (
                    <Radio.Group>
                      <Radio.Button value={ListDisplayMode.List}>List</Radio.Button>
                      {getFieldValue('optionalDisplayMode')?.includes(ListDisplayMode.List) && (
                        <Radio.Button value={ListDisplayMode.Calendar}>Calendar</Radio.Button>
                      )}
                      {getFieldValue('optionalDisplayMode')?.includes(ListDisplayMode.Timeline) && (
                        <Radio.Button value={ListDisplayMode.Timeline}>Timeline</Radio.Button>
                      )}
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item
                  name="mobileDisplayMode"
                  noStyle={isWeb}
                  label="Default display mode (Mobile)"
                >
                  {!isWeb && (
                    <Radio.Group>
                      <Radio.Button value={ListDisplayMode.List}>List</Radio.Button>
                      {getFieldValue('optionalDisplayMode')?.includes(ListDisplayMode.Calendar) && (
                        <Radio.Button value={ListDisplayMode.Calendar}>Calendar</Radio.Button>
                      )}
                      {getFieldValue('optionalDisplayMode')?.includes(ListDisplayMode.Timeline) && (
                        <Radio.Button value={ListDisplayMode.Timeline}>Timeline</Radio.Button>
                      )}
                    </Radio.Group>
                  )}
                </Form.Item>
              </>
            );
          }}
        </Form.Item> */}

        <Form.Item
          label={
            <Tooltip title="Configure if staffs are allowed to perform mass operations within their authority">
              <span>
                Mass operation <QuestionCircleFilled style={{ color: '#aaa' }} />
              </span>
            </Tooltip>
          }
          name="massOperation"
        >
          <Radio.Group>
            <Radio.Button value={MassOpts.Allowed}>Allowed</Radio.Button>
            <Radio.Button value={MassOpts.Disallowed}>Disallowed</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item
          label={
            <Tooltip title="Selected subforms will display by default">
              <span>
                Show subform by default <QuestionCircleFilled style={{ color: '#aaa' }} />
              </span>
            </Tooltip>
          }
        >
          <Select disabled placeholder="Coming soon..." />
        </Form.Item> */}
        <Form.Item label="Sorting by field" name="sortByField">
          <Select>
            {memoizedFilteredParsedProps.map((property) => (
              <Select.Option key={property.code} value={property.code}>
                {property.displayName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Sorting method" name="sortMethod">
          <Radio.Group>
            <Radio.Button value={SortMethod.Ascending}>Ascending</Radio.Button>
            <Radio.Button value={SortMethod.Descending}>Descending</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item label="Function buttons">
          <Button type="default" onClick={() => {}} disabled>
            Configure function buttons
          </Button>
        </Form.Item> */}
      </Form>
    </div>
  );
};

export default ListSettings;
