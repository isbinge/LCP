import React, { lazy, Suspense, useEffect } from 'react';
import { DragObjectWithType } from 'react-dnd';
import { useDispatch, useSelector, useParams } from 'dva';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import DndProvider from '@lib/DndProvider';

import LoadingWave from '@comp/LoadingWave';
import { msgIntl } from '@comp/i18n/MessageIntl';
import FormDesignerBtnBar from '@comp/FormDesignerBtnBar';
import { FormItemSpec } from '@/domain/form/template/model';
import LcpConst from '@/constants';
import { PanelBtnRenderPayload } from './FormItemPanel/PanelButton';

import styles from './index.scss';

/* Lazy loading FormTemplate child components */
const FormCanvas = lazy(() => import('./FormCanvas'));
const FormControl = lazy(() => import('./FormControl'));
const FormItemPanel = lazy(() => import('./FormItemPanel'));

export interface DraggableItemBasic extends DragObjectWithType {
  payload: PanelBtnRenderPayload;
}

const validateForm = (formItemSpecs: FormItemSpec[], formSpec: Lcp.FormDataType.Form) => {
  const subForms = formItemSpecs.filter((item) => item.compType === 'subform');
  function emitError(id: string) {
    return msgIntl.error({ id, key: LcpConst.antdMsgKey.FORM_TPL_SAVE });
  }
  const validataFieldsName = (formItems: FormItemSpec[]) => {
    if (
      formItems.some(
        (spec) => spec.compType !== 'switch' && spec.compType !== 'inlineSplit' && !spec.data.name,
      )
    ) {
      emitError('message.formtpl.fieldnameno');
      return false;
    }
    return true;
  };

  const validateEmptyFields = (formItems: FormItemSpec[]) => {
    if (formItems.filter((item) => item.displayable).length < 1) {
      emitError('message.formtpl.fieldsnotset');
      return false;
    }
    return validataFieldsName(formItems);
  };

  const validateFormName = (formName: string) => {
    if (!formName || formName.length > 32) {
      emitError('appdetail.formlist.rename.rule.message');
      return false;
    }
    return true;
  };

  const validateDataTitle = (dataTitle: string[]) => {
    if (dataTitle.length === 0) {
      emitError('message.formtpl.datatitlenotset');
      return false;
    }
    return true;
  };

  if (
    !validateFormName(formSpec.name) ||
    !validateEmptyFields(formItemSpecs) ||
    !validateDataTitle(formSpec.dataTitle)
  ) {
    return false;
  }

  if (subForms.length > 0) {
    if (subForms.some((subForm) => !validataFieldsName(subForm.extraData as FormItemSpec[]))) {
      return false;
    }
  }

  const unfulfilledFields: FormItemSpec[] = [];
  const getUnfulfilledFields = (form: FormItemSpec[]) => {
    return form.filter((spec) => {
      switch (spec.compType) {
        case 'associationForm':
          return !spec.data.associateForm.schemaCode;
        case 'associationAttribute':
          return !spec.data.assocAttrConfig.associateForm;
        case 'associationFormMultiSelect':
          return !spec.data.associateForm.schemaCode;
        case 'select': {
          if (spec.data.sourceFrom === 'assocForm') {
            return !spec.data.associateForm.schemaCode || !spec.data.mappingField;
          }
          return false;
        }
        default:
          return false;
      }
    });
  };

  unfulfilledFields.push(...getUnfulfilledFields(formItemSpecs));

  if (subForms.length > 0) {
    subForms.forEach((subForm) => {
      unfulfilledFields.push(...getUnfulfilledFields(subForm.extraData as FormItemSpec[]));
    });
  }
  if (unfulfilledFields.length > 0) {
    msgIntl.error({
      id: 'message.formtpl.assocformnotset',
      values: {
        name: unfulfilledFields[0].data.name,
      },
    });
    return false;
  }
  return true;
};

const FormTemplate: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch<Dva.Dispatch>();
  const { appId, templateId } = useParams();
  const [
    { formSpec, formItemSpecs },
    isSubmitting,
  ] = useSelector(({ formTemplate, loading: { effects } }) => [
    formTemplate,
    effects['formTemplate/createFormTpl'] || effects['formTemplate/updateFormTpl'],
  ]);

  useEffect(() => {
    if (templateId) {
      dispatch({
        type: 'formTemplate/getFormTpl',
        payload: {
          templateId,
        },
      });
      dispatch({ type: 'formTemplate/updateCursor', payload: { currentId: null } });
    } else {
      dispatch({
        type: 'formTemplate/updateTplName',
        payload: { newName: intl.formatMessage({ id: 'formtpl.schema.form.formname.default' }) },
      });
    }
  }, [templateId, appId]);

  const submitFormDesign = async () => {
    if (!validateForm(formItemSpecs, formSpec)) {
      return;
    }
    if (appId) {
      if (templateId) {
        await dispatch({
          type: 'formTemplate/updateFormTpl',
          payload: { templateId, appId },
        });
      } else {
        await dispatch({ type: 'formTemplate/createFormTpl', payload: { appId } });
        msgIntl.success({ id: 'msg.create.ok', key: LcpConst.antdMsgKey.FORM_TPL_SAVE });
      }
    }
  };

  return (
    <div>
      <FormDesignerBtnBar onSubmit={submitFormDesign} submitting={isSubmitting} />
      <DndProvider>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <Suspense fallback={<LoadingWave message={<FM id="loading.formtpl" />} filled />}>
              <FormItemPanel />
              <FormCanvas style={{ marginLeft: 8, flex: 1 }} />
              <FormControl
                style={{
                  marginLeft: 8,
                  width: 272,
                }}
              />
            </Suspense>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default FormTemplate;
