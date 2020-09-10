const org = {
  'org.name': '组织机构',

  'org.create': '创建组织',
  'org.switch': '切换组织',
  'org.dissolve': '解散组织',
  'org.click-in': '点击进入',
  'org.current': '当前所在组织',

  // 创建
  'org.create.ph': '请输入 2-20 个字',
  'org.create.validation': '组织名必须在 2-20 个字之间',

  // 解散
  'org.dissolve.confirm': '确认解散组织?',
  'org.dissolve.confirm.statement1': '确认后将进入解散流程, 您组织的以下数据将会<b>全部丢失</b>:',
  'org.dissolve.confirm.statement2': '组织机构及所有员工信息',
  'org.dissolve.confirm.statement3': '所有应用/表单模板/表单数据/工作流/报表',
  'org.dissolve.confirm.checkbox': '我已知晓: 上述数据会被删除且无法恢复',

  // 问卷
  'org.questionnaire.title': '解散成功! 请选择解散原因, 以帮助我们做的更好:',
  'org.questionnaire.question1': '不知如何使用',
  'org.questionnaire.question2': '有重复的组织',
  'org.questionnaire.question3': '创建错误',
  'org.questionnaire.question4': '公司业务变动',
  'org.questionnaire.question5': '信息/广告过多',
  'org.questionnaire.question6': '使用其他的代码开发平台',
  'org.questionnaire.question7': '其他',
  'org.questionnaire.help': '其他想要告诉我们的',
};

const schema = {
  'org.dept.add': '添加部门',
  'org.dept.add.ph': '请输入部门名称',

  'org.dept.addsubdept': '添加子部门',
  'org.dept.editname': '修改名称',
  'org.dept.select': '选择部门',
  'org.dept.manager': '部门主管',
  'org.dept.setmgmt': '设置部门主管',
  'org.dept.name': '部门',
  'org.dept.name.validation': '部门名必须在 2-20 个字之间',
  'org.dept.select.validation': '请至少选择一个部门',
  'org.dept.search-empty': '没有搜索到相关部门',

  'org.dept.delete.title': '删除部门',
  'org.dept.delete.head': '确认删除部门?',
  'org.dept.delete.first-line': '若一些表单数据引用了该部门, 删除部门后:',
  'org.dept.delete.content1': '这些表单数据将丢失改部门信息',
  'org.dept.delete.content2': '若这些表单依部门控制访问权限, 那么这些数据将只对管理员及拥有者可见',

  'org.member.add': '手动添加成员',
  'org.member.all': '所有成员',
  'org.member.invite': '邀请成员',
  'org.member.invite.success': '邀请成功',
  'org.member.invite.failed': '邀请失败',

  'org.member.delete': '删除',
  'org.member.delete-confirm': '确定删除以下人员?',
  'org.member.name': '成员',
  'org.member.name.validation': '成员名必须在 2-15 个字之间',
  'org.member.email.validation': '不是一个有效的邮箱',
  'org.member.email.ph': '请输入',
  'org.member.adjust-dept': '转移部门',
  'org.member.input.name.placeholder': '必填, 不能超过12个字符',
  'org.member.loading': '正在加载成员列表',
  'org.member.unJoined-members': '有{count}名成员未加入',
  'org.member.invite-again': '再次邀请',
  'org.member.invite-all-again': '全部再次邀请',
  'org.member.joined': '已加入',
  'org.member.pagination.total': '共{count}项',

  // common
  'org.common.invite': '邀请',
  'org.common.clear': '清空',
  'org.common.mobile': '手机',
  'org.common.name': '名称',
  'org.common.operation': '操作',
  'org.common.inviting': '邀请中',
  'org.common.joined': '已加入',
  'org.common.input.name.placeholder': '请输入名称',
};

const msg = {
  'org.msg.addmember.tips1': '成员加入时无法更改您输入的内容, 请输入正确的信息',
  'org.msg.addmember.tips2': '按输入的联系方式发送邀请; 同时输入手机和邮箱, 只发送手机邀请',
  'org.msg.deletedept.title': '您确定要删除 {deptName} ?',
  'org.msg.deletedept.description': '删除部门会将部门所关联的权限一并删除, 此操作不可逆',
  'org.msg.cannotdept.title': '不能执行此操作',
  'org.msg.cannotdept.description': '不能直接删除拥有子部门或成员的部门',
};

export default {
  ...schema,
  ...msg,
  ...org,
};
