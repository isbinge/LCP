const common = {
  'loading.formtpl': '设计器载入中',
  'loading.formtpl.compdata': '获取控件数据',
  'loading.formtpl.canvas': '加载中',
  'message.formtpl.assocformnotset': '{name}没有配置关联表单',
  'message.formtpl.fieldsnotset': '请先设置字段',
  'message.formtpl.formnotest': '请先填写表单名称',
  'message.formtpl.fieldnameno': '请先填写控件名称',
  'message.formtpl.datatitlenotset': '请先设置数据标题',
};

const componentName = {
  // DO NOT extract IDs below into dict.
  // Baisc
  'formtpl.comp.input': '单行文本',
  'formtpl.comp.textarea': '多行文本',
  'formtpl.comp.date': '日期',
  'formtpl.comp.num': '数字',
  'formtpl.comp.radio': '单选框',
  'formtpl.comp.checkbox': '复选框',
  'formtpl.comp.select': '下拉框',
  'formtpl.comp.switch': '是/否',
  'formtpl.comp.member-single-select': '人员单选',
  'formtpl.comp.member-multi-select': '人员多选',
  'formtpl.comp.dept-single-select': '部门单选',
  'formtpl.comp.dept-multi-select': '部门多选',
  // Layout
  'formtpl.comp.grouptitle': '分组标题',
  'formtpl.comp.inlinesplit': '一行两列',
  'formtpl.comp.description': '描述说明',
  'formtpl.comp.subform': '子表',
  // System
  'formtpl.comp.sn': '流水号',
  'formtpl.comp.creator': '创建人',
  'formtpl.comp.createtime': '创建时间',
  'formtpl.comp.owner': '拥有者',
  'formtpl.comp.ownerdept': '所属部门',
  'formtpl.comp.modtime': '修改时间',
  // Advanced
  'formtpl.comp.assocform': '关联表单',
  'formtpl.comp.assocform.abbr': '关联表单',
  'formtpl.comp.assocfield': '关联属性',
  'formtpl.comp.assocfield.abbr': '关联属性',
  'formtpl.comp.assocform.multiselect': '关联表单多选',
  'formtpl.comp.assocform.multiselect.abbr': '关联表单多选',
  'formtpl.comp.assocform.multiselect.abbr.panel': '关联表单多选',
};

const panel = {
  'formtpl.panel.title.basic': '基础控件',
  'formtpl.panel.title.layout': '布局控件',
  'formtpl.panel.title.system': '系统控件',
  'formtpl.panel.title.advanced': '高级控件',
};

const canvas = {
  'formtpl.canvas.placeholder': '拖入或点击添加左侧控件绘制表单',
  'formtpl.canvas.message.onlycomp': '该类型控件在表单内唯一，不支持添加多个',
  'formtpl.canvas.subform.ph': '从左侧拖拽来添加字段',
  'formtpl.canvas.subform.drag-error': '子表不支持此类型控件，请添加其他控件',

  // Common
  'formtpl.canvas.common.select.ph': '请选择',
  'formtpl.canvas.common.input.ph': '请输入',
  'formtpl.canvas.common.gen-by-sys': '系统自动生成',
  // Layout
  'formtpl.canvas.comp.inlinesplit.ph': '请从控件区拖入组件',
  // Advanced
  'formtpl.canvas.comp.assocfield.ph': '用于展示关联表单的属性,且数据不会保存',
};

const control = {
  'formtpl.control.tab.compspec': '控件属性',
  'formtpl.control.tab.formspec': '表单属性',
  'formtpl.control.tab.placeholder': '请先拖入或选中控件',

  // schema common
  'formtpl.schema.common.comptitle': '控件名称',
  'formtpl.schema.common.hidecond': '隐藏条件',
  'formtpl.schema.common.hidecond.desc': '当满足以上条件时此控件隐藏',
  'formtpl.schema.common.defval.formula': '计算公式',
  'formtpl.schema.common.defval.datalinkage': '数据联动',
  'formtpl.schema.common.tips': '提示语',
  'formtpl.schema.common.convert': '转换为其他类型控件',
  'formtpl.schema.common.options.placeholder': '请选择',
  'formtpl.schema.common.datarange': '数据范围限定',
  'formtpl.schema.common.datarange.desc': '限定关联表单只能满足以下条件的数据',
  'formtpl.schema.common.option': '选项{order}',
  'formtpl.schema.common.prohibitdel': '最后一项，不允许删除',
  'formtpl.schema.common.keepone': '至少保留一项',
  'formtpl.schema.common.addoption': '添加选项',
  'formtpl.schema.common.massedit': '批量编辑',
  'formtpl.schema.common.buildoption': '生成选项',
  'formtpl.schema.common.linedsc': '每行对应一个选项',
  'formtpl.schema.common.addrule': '添加规则',

  // schema form
  'formtpl.schema.form.formname': '表单名称',
  'formtpl.schema.form.formname.default': '未命名的表单',
  'formtpl.schema.form.datatitle': '数据标题',
  'formtpl.schema.form.datatitle.desc':
    '数据标题用于快速辨别一条数据，适用于移动端列表显示，Web 列表首页标题，关联表单数据显示等场景中',
  'formtpl.schema.form.formactivities': '表单动态',

  // schema basic
  'formtpl.schema.input.format.text': '普通文本',
  'formtpl.schema.input.format.phone': '固话/手机',
  'formtpl.schema.input.valid': '校验',
  'formtpl.schema.input.valid.norepeat': '不允许重复输入',

  'formtpl.schema.textarea.rows': '可见行数',

  'formtpl.schema.date.format': '显示格式',
  'formtpl.schema.date.format.ymd': '年-月-日',
  'formtpl.schema.date.format.ym': '年-月',
  'formtpl.schema.date.format.ymdhm': '年-月-日 时:分',
  'formtpl.schema.date.format.hm': '时:分',

  'formtpl.schema.num.format.decimal': '小数位数',
  'formtpl.schema.num.format.groupsep': '显示千位分隔符',

  'formtpl.schema.select.datasource': '数据来源',
  'formtpl.schema.select.datasource.assocform': '关联已有表单数据',
  'formtpl.schema.select.datasource.fromfields': '将根据以下表单字段生成选项',

  'form.schema.member.current': '默认当前用户',
  'form.schema.member.allow-access': '允许控件中所选的人员查看数据',
  'form.schema.member.allow-access.allow': '允许',
  'form.schema.member.allow-access.refuse': '不允许',
  // schema layout
  'formtpl.schema.grouptitle.align': '对齐',
  'formtpl.schema.subform.fields': '子表字段',

  // schema system
  'formtpl.schema.owner.personscope': '人员范围限定',
  'formtpl.schema.owner.modal.title': '选人范围',
  'formtpl.schema.owner.modal.dept': '部门',
  'formtpl.schema.owner.modal.dept.search': '搜索部门',
  'formtpl.schema.owner.modal.role': '角色',
  'formtpl.schema.owner.modal.role.search': '搜索角色',
  'formtpl.schema.owner.modal.deptctrl': '部门控件',
  'formtpl.schema.owner.modal.other': '其他参数',
  'formtpl.schema.owner.modal.other.option': '当前用户所在部门',
  'formtpl.schema.owner.staffinfo': '人员信息填充',
  'formtpl.schema.owner.staffinfo.dept': '部门 的值填充到',
  'formtpl.schema.owner.staffinfo.sex': '性别 的值填充到',
  'formtpl.schema.owner.staffinfo.email': '邮件 的值填充到',
  'formtpl.schema.owner.staffinfo.phone': '手机 的值填充到',

  'formtpl.schema.department.deptscope': '部门范围限定',
  'formtpl.schema.department.modal.title': '选部门范围',

  // schema advanced
  'formtpl.schema.assocform.datafillrule': '数据填充规则',
  'formtpl.schema.assocform.datafillrule.desc': '将关联表单字段的值填充到当前表单字段',
  'formtpl.schema.assocform.selectform': '请选择需要关联的表单',
  'formtpl.schema.assocform.configform': '请先配置关联表单',
  'formtpl.schema.assocform.datafilldesc': '当选择具体数据后，将按如下规则给当前表单字段填充数据',
  'formtpl.schema.assocform.currentfield': '当前表单字段',
  'formtpl.schema.assocform.valuepopu': '的值填充到',
  'formtpl.schema.assocform.fillcount': '已填充{count}项',

  'formtpl.schema.assocattr.desc':
    '注：关联其他表单的某个字段，且会跟随关联表单对应的字段值实时变化',
  'formtpl.schema.assocattr.config': '关联表单字段',
  'formtpl.schema.assocattr.formdefault': '选择关联表单',
  'formtpl.schema.assocattr.fielddefault': '选择关联字段',
  'formtpl.schema.assocattr.setcontent': '设置为关联表单下拉搜索项',
  'formtpl.schema.assocattr.tips': '选择后，在搜索关联表单数据时支持此字段的快速搜索',

  // schema datalinkage
  'formtpl.schema.datalinkage.setting': '数据联动设置',
  'formtpl.schema.datalinkage.selectformfirst': '请先选择联动表单',
  'formtpl.schema.datalinkage.emptycond': '条件字段不能为空',
  'formtpl.schema.datalinkage.contrlselect': '请先选择联动控件名称',
  'formtpl.schema.datalinkage.hasset': '已设置数据联动',
  'formtpl.schema.datalinkage.targetform': '联动目标表单',
  'formtpl.schema.datalinkage.formselect': '请选择联动表单',
  'formtpl.schema.datalinkage.currentcontrl': '当前表单控件',
  'formtpl.schema.datalinkage.linkedcontrl': '联动表单控件',
  'formtpl.schema.datalinkage.equal': '值等于',
  'formtpl.schema.datalinkage.linkcond': '联动条件',
  'formtpl.schema.datalinkage.linkdesc': '当前表单输入的值等于目标表单的值时，执行联动填充',
  'formtpl.schema.datalinkage.linkfill': '联动填充',
  'formtpl.schema.datalinkage.linkfilldesc': '将目标表单控件值填充到当前控件',
};

export default {
  ...common,
  ...componentName,
  ...panel,
  ...canvas,
  ...control,
};
