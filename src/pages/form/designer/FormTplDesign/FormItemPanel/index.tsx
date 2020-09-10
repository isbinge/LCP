import React, { CSSProperties } from 'react';
import { DndItemType } from '@/constants';
import { FormattedMessage as FM } from 'react-intl';
import PanelSection from './PanelSection';
import PanelButton from './PanelButton';

import styles from './index.scss';

export interface FdTplPanelItemDefBase<T = Lcp.FormItem.All> {
  compType: T;
  renderOptions?: {
    /** 是否隐藏生成组件时的标题 */
    hideTitle?: boolean;
  };
}

export interface FdTplPanelItemDef<T = string> extends FdTplPanelItemDefBase<T> {
  id: string;
  titleId?: string;
  style?: Partial<Record<Lcp.SupportedLocale, CSSProperties>>;
}

export const hideTitleComps = ['groupTitle', 'inlineSplit', 'description'];

const enUsLabelStyle: CSSProperties = {
  lineHeight: 1.2,
  fontSize: '0.9em',
  textAlign: 'center',
};

const basicComps: FdTplPanelItemDef<Lcp.FormItem.Basic>[] = [
  {
    id: 'formtpl.comp.input',
    compType: 'input',
  },
  {
    id: 'formtpl.comp.textarea',
    compType: 'textarea',
  },
  {
    id: 'formtpl.comp.date',
    compType: 'date',
  },
  {
    id: 'formtpl.comp.num',
    compType: 'number',
  },
  {
    id: 'formtpl.comp.radio',
    compType: 'radio',
  },
  {
    id: 'formtpl.comp.checkbox',
    compType: 'checkbox',
  },
  {
    id: 'formtpl.comp.select',
    compType: 'select',
  },
  {
    id: 'formtpl.comp.switch',
    compType: 'switch',
  },
  {
    id: 'formtpl.comp.member-single-select',
    compType: 'staffSingleSelect',
  },
  {
    id: 'formtpl.comp.member-multi-select',
    compType: 'staffMultiSelect',
  },
  {
    id: 'formtpl.comp.dept-single-select',
    compType: 'deptSingleSelect',
  },
  {
    id: 'formtpl.comp.dept-multi-select',
    compType: 'deptMultiSelect',
  },
];

const layoutComps: FdTplPanelItemDef<Lcp.FormItem.Layout>[] = [
  {
    id: 'formtpl.comp.grouptitle',
    compType: 'groupTitle',
  },
  {
    id: 'formtpl.comp.inlinesplit',
    compType: 'inlineSplit',
  },
  {
    id: 'formtpl.comp.description',
    compType: 'description',
  },
  {
    id: 'formtpl.comp.subform',
    compType: 'subform',
  },
];

const systemComps: FdTplPanelItemDef<Lcp.FormItem.System>[] = [
  {
    id: 'formtpl.comp.sn',
    compType: 'serialNo',
  },
  {
    id: 'formtpl.comp.creator',
    compType: 'creator',
  },
  {
    id: 'formtpl.comp.owner',
    compType: 'owner',
  },
  {
    id: 'formtpl.comp.ownerdept',
    compType: 'ownerDept',
  },
  {
    id: 'formtpl.comp.createtime',
    compType: 'createTime',
  },
  {
    id: 'formtpl.comp.modtime',
    compType: 'modifyTime',
  },
];

const advancedComps: FdTplPanelItemDef<Lcp.FormItem.Advanced>[] = [
  {
    id: 'formtpl.comp.assocform.abbr',
    titleId: 'formtpl.comp.assocform',
    compType: 'associationForm',
  },
  {
    id: 'formtpl.comp.assocfield.abbr',
    titleId: 'formtpl.comp.assocfield',
    compType: 'associationAttribute',
  },
  {
    id: 'formtpl.comp.assocform.multiselect.abbr.panel',
    titleId: 'formtpl.comp.assocform.multiselect',
    compType: 'associationFormMultiSelect',
    style: {
      'en-US': enUsLabelStyle,
    },
  },
];
/**
 * 表单设计 - 组件类型面板
 */
export default function FormItemPanel() {
  return (
    <div className={styles.wrapper}>
      <PanelSection title={<FM id="formtpl.panel.title.basic" />}>
        {basicComps.map((item) => (
          <PanelButton
            dragType={DndItemType.form.BASIC_COMPS}
            key={item.id}
            id={item.id}
            compType={item.compType}
            renderOptions={{ hideTitle: hideTitleComps.includes(item.compType) }}
          />
        ))}
      </PanelSection>
      <PanelSection title={<FM id="formtpl.panel.title.layout" />} style={{ marginTop: 8 }}>
        {layoutComps.map((item) => (
          <PanelButton
            dragType={DndItemType.form.LAYOUT_COMPS}
            key={item.id}
            id={item.id}
            compType={item.compType}
            renderOptions={{ hideTitle: hideTitleComps.includes(item.compType) }}
          />
        ))}
      </PanelSection>
      <PanelSection title={<FM id="formtpl.panel.title.system" />} style={{ marginTop: 8 }}>
        {systemComps.map((item) => (
          <PanelButton
            dragType={DndItemType.form.SYSTEM_COMPS}
            key={item.id}
            id={item.id}
            compType={item.compType}
            renderOptions={{ hideTitle: hideTitleComps.includes(item.compType) }}
          />
        ))}
      </PanelSection>
      <PanelSection title={<FM id="formtpl.panel.title.advanced" />} style={{ marginTop: 8 }}>
        {advancedComps.map((item) => (
          <PanelButton
            dragType={DndItemType.form.ADVANCED_COMPS}
            key={item.id}
            id={item.id}
            compType={item.compType}
            titleId={item.titleId}
            style={item.style}
            renderOptions={{ hideTitle: hideTitleComps.includes(item.compType) }}
          />
        ))}
      </PanelSection>
    </div>
  );
}
