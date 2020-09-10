const common = {
  'loading.formtpl': 'Loading form template builder',
  'loading.formtpl.compdata': 'Loading components data',
  'loading.formtpl.canvas': 'Loading',
  'message.formtpl.assocformnotset': 'No associated form config found for {name}',
  'message.formtpl.fieldsnotset': 'Please add at least one field',
  'message.formtpl.formnotest': 'Please fill in the form name',
  'message.formtpl.fieldnameno': 'Please fill in the control name',
  'message.formtpl.datatitlenotset': 'Please fill in the data title',
};

const componentName = {
  // DO NOT extract IDs below into dict.
  // Baisc
  'formtpl.comp.input': 'Input',
  'formtpl.comp.textarea': 'Text Area',
  'formtpl.comp.date': 'Date',
  'formtpl.comp.num': 'Number',
  'formtpl.comp.radio': 'Radio',
  'formtpl.comp.checkbox': 'Checkbox',
  'formtpl.comp.select': 'Select',
  'formtpl.comp.switch': 'Switch',
  'formtpl.comp.member-single-select': 'Member Single-select',
  'formtpl.comp.member-multi-select': 'Member Multi-select',
  'formtpl.comp.dept-single-select': 'Department Multi-select',
  'formtpl.comp.dept-multi-select': 'Department Multi-select',
  // Layout
  'formtpl.comp.grouptitle': 'Group Title',
  'formtpl.comp.inlinesplit': 'Row Split',
  'formtpl.comp.description': 'Description',
  'formtpl.comp.subform': 'Subform',
  // System
  'formtpl.comp.sn': 'Serial No.',
  'formtpl.comp.creator': 'Creator',
  'formtpl.comp.createtime': 'Created Time',
  'formtpl.comp.owner': 'Owner',
  'formtpl.comp.ownerdept': 'Department',
  'formtpl.comp.modtime': 'Modified Time',
  // Advanced
  'formtpl.comp.assocform': 'Associated Form',
  'formtpl.comp.assocform.abbr': 'Assoc. Form',
  'formtpl.comp.assocfield': 'Associated Field',
  'formtpl.comp.assocfield.abbr': 'Assoc. Field',
  'formtpl.comp.assocform.multiselect': 'Multi-Select Associated Form',
  'formtpl.comp.assocform.multiselect.abbr': 'MSAF',
  'formtpl.comp.assocform.multiselect.abbr.panel': 'Multi-select Assoc. Form',
};

const panel = {
  'formtpl.panel.title.basic': 'Basic',
  'formtpl.panel.title.layout': 'Layout',
  'formtpl.panel.title.system': 'System',
  'formtpl.panel.title.advanced': 'Advanced',
};

const canvas = {
  'formtpl.canvas.placeholder':
    'Drag in or click the components on the left side to start designing your form',
  'formtpl.canvas.message.onlycomp':
    'This type of component can only exist one in a single form template',
  'formtpl.canvas.subform.ph': 'Drag and drop from the panel to add the field',
  'formtpl.canvas.subform.drag-error':
    'Subtable does not support this type of control, please drag other controls',
  // Common
  'formtpl.canvas.common.select.ph': 'Please select',
  'formtpl.canvas.common.input.ph': 'Please input',
  'formtpl.canvas.common.gen-by-sys': 'Auto generated by system',
  // Layout
  'formtpl.canvas.comp.inlinesplit.ph': 'Please drag a component from the panel',
  // Advanced
  'formtpl.canvas.comp.assocfield.ph': 'For Associated Form Field display without being saved',
};

const control = {
  'formtpl.control.tab.compspec': 'Comp Spec',
  'formtpl.control.tab.formspec': 'Form Spec',
  'formtpl.control.tab.placeholder': 'Drag a component and see',

  // schema common
  'formtpl.schema.common.comptitle': 'Component title',
  'formtpl.schema.common.hidecond': 'Hidding condition',
  'formtpl.schema.common.hidecond.desc': 'Component will hide when meeting the condition above',
  'formtpl.schema.common.defval.formula': 'Computing formula',
  'formtpl.schema.common.defval.datalinkage': 'Data linkage',
  'formtpl.schema.common.tips': 'Tips',
  'formtpl.schema.common.convert': 'Convert to another type',
  'formtpl.schema.common.options.placeholder': 'Please select',
  'formtpl.schema.common.datarange': 'Data range distriction',
  'formtpl.schema.common.datarange.desc':
    'Distict the assoc. form can only have data meeting conditions below',
  'formtpl.schema.common.option': 'option{order}',
  'formtpl.schema.common.prohibitdel': 'Last item, not allowed to delete',
  'formtpl.schema.common.keepone': 'Keep at least one',
  'formtpl.schema.common.addoption': 'Add option',
  'formtpl.schema.common.massedit': 'Mass edit',
  'formtpl.schema.common.buildoption': 'Build options',
  'formtpl.schema.common.linedsc': 'One option per line',
  'formtpl.schema.common.addrule': 'Add rule',

  // schema form
  'formtpl.schema.form.formname': 'Form name',
  'formtpl.schema.form.formname.default': 'Unnamed form',
  'formtpl.schema.form.datatitle': 'Data Title',
  'formtpl.schema.form.datatitle.desc':
    "Data title is used for identifing a record fast, and it's good for showing lists on mobile, and showing lists, index page titles, assoc. form data on Web, etc.",
  'formtpl.schema.form.formactivities': 'Form activities',

  // schema basic
  'formtpl.schema.input.format.text': 'Common text',
  'formtpl.schema.input.format.phone': 'Phone/Cellphone',
  'formtpl.schema.input.valid': 'Validation',
  'formtpl.schema.input.valid.norepeat': 'No repeat',

  'formtpl.schema.textarea.rows': 'Visible rows',

  'formtpl.schema.date.format': 'Data format',
  'formtpl.schema.date.format.ymd': 'YYYY-MM-DD',
  'formtpl.schema.date.format.ym': 'YYYY-MM',
  'formtpl.schema.date.format.ymdhm': 'YYYY-MM-DD HH:mm',
  'formtpl.schema.date.format.hm': 'HH:mm',

  'formtpl.schema.num.format.decimal': 'Decimal',
  'formtpl.schema.num.format.groupsep': 'Show group seperator',

  'formtpl.schema.select.datasource': 'Data source',
  'formtpl.schema.select.datasource.assocform': 'Associate with existed form data',
  'formtpl.schema.select.datasource.fromfields': 'Option will be with fields below',

  'form.schema.member.current': 'Default current user',
  'form.schema.member.allow-access': 'The selected members will have the access to the data',

  // schema layout
  'formtpl.schema.grouptitle.align': 'Alignment',
  'formtpl.schema.subform.fields': 'Subform fields',

  // schema system
  'formtpl.schema.owner.personscope': 'Staff range',
  'formtpl.schema.owner.modal.title': 'Selection range',
  'formtpl.schema.owner.modal.dept': 'Department',
  'formtpl.schema.owner.modal.dept.search': 'Search department',
  'formtpl.schema.owner.modal.role': 'Role',
  'formtpl.schema.owner.modal.role.search': 'Search role',
  'formtpl.schema.owner.modal.deptctrl': 'Department Control',
  'formtpl.schema.owner.modal.other': 'Other',
  'formtpl.schema.owner.modal.other.option': "Current user's department",
  'formtpl.schema.owner.staffinfo': 'Staff info filling',
  'formtpl.schema.owner.staffinfo.dept': 'Fill the value of *Department* in',
  'formtpl.schema.owner.staffinfo.sex': 'Fill the value of *Sex* in',
  'formtpl.schema.owner.staffinfo.email': 'Fill the value of *Mail* in',
  'formtpl.schema.owner.staffinfo.phone': 'Fill the value of *Phone* in',

  'formtpl.schema.department.deptscope': 'Department range distriction',
  'formtpl.schema.department.modal.title': 'Select Department',

  // schema advanced
  'formtpl.schema.assocform.datafillrule': 'Data filling rules',
  'formtpl.schema.assocform.datafillrule.desc':
    'Fill the value of assoc. form field in the current form field',
  'formtpl.schema.assocform.selectform': 'Please select the form to associate',
  'formtpl.schema.assocform.configform': 'Please configure the association form first',
  'formtpl.schema.assocform.datafilldesc':
    'After selecting specific data, the current form fields will be filled with data according to the following rules',
  'formtpl.schema.assocform.currentfield': 'Current form field',
  'formtpl.schema.assocform.valuepopu': 'is populated to',
  'formtpl.schema.assocform.fillcount': '{count} items filled',

  'formtpl.schema.assocattr.desc':
    'p.s. Associating with another form field, the value will change correspondingly as the original changes',
  'formtpl.schema.assocattr.config': 'Assoc. form field',
  'formtpl.schema.assocattr.formdefault': 'Select association form',
  'formtpl.schema.assocattr.fielddefault': 'Select association field',
  'formtpl.schema.assocattr.setcontent': 'Set as association form drop-down search term',
  'formtpl.schema.assocattr.tips':
    'When selected, supports quick search of this field when searching related form data',

  // schema datalinkage
  'formtpl.schema.datalinkage.setting': 'Data linkage settings',
  'formtpl.schema.datalinkage.selectformfirst': 'Please select the linkage form first',
  'formtpl.schema.datalinkage.emptycond': 'Condition field cannot be empty',
  'formtpl.schema.datalinkage.contrlselect': 'Please select the linkage control name first',
  'formtpl.schema.datalinkage.hasset': 'Data linkage has been set',
  'formtpl.schema.datalinkage.targetform': 'Linkage target form',
  'formtpl.schema.datalinkage.formselect': 'Please select the linkage form',
  'formtpl.schema.datalinkage.currentcontrl': 'The current form control',
  'formtpl.schema.datalinkage.linkedcontrl': 'Linked form controls',
  'formtpl.schema.datalinkage.equal': 'is equal to',
  'formtpl.schema.datalinkage.linkcond': 'Linkage conditions',
  'formtpl.schema.datalinkage.linkdesc':
    'When the value entered in the current form is equal to the value of the target form, a linked fill is performed',
  'formtpl.schema.datalinkage.linkfill': 'Linked filling',
  'formtpl.schema.datalinkage.linkfilldesc':
    'Fill the target form control values into the current control',
};

export default {
  ...common,
  ...componentName,
  ...panel,
  ...canvas,
  ...control,
};