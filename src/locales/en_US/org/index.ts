const org = {
  'org.name': 'Organization',

  'org.create': 'Create Organization',
  'org.switch': 'Switch Organization',
  'org.dissolve': 'Dissolve Organization',

  'org.click-in': 'Click In',
  'org.current': 'Current organization',

  // 创建
  'org.create.validation': 'Organization name must be between 2-20 characters',
  'org.create.ph': 'Please input 2-20 chars',

  // 解散
  'org.dissolve.confirm': 'Confirm to dissolve organization?',
  'org.dissolve.confirm.statement1':
    'If proceed, all the data of your organization listed below will be <b>DELETED</b>:',
  'org.dissolve.confirm.statement2': 'Organization and all employee information',
  'org.dissolve.confirm.statement3': 'All applications/form templates/form data/workflow/reports',
  'org.dissolve.confirm.checkbox':
    "I'm aware of that all the data listed above will be removed and can't be restored",

  // 问卷
  'org.questionnaire.title':
    'Dissolution succeed, Please select the reason of dissolution, to make us do better:',
  'org.questionnaire.question1': "Don't know how to use it",
  'org.questionnaire.question2': 'There are duplicate enterprises',
  'org.questionnaire.question3': 'Met errors',
  'org.questionnaire.question4': 'Business changes',
  'org.questionnaire.question5': 'Too much information/advertising',
  'org.questionnaire.question6': "I'm using other low-code platforms",
  'org.questionnaire.question7': 'Other reasons',
  'org.questionnaire.help': 'Anything you want to tell us',
};

const schema = {
  'org.dept.add': 'Add department',
  'org.dept.add.ph': 'Please input a department name',
  'org.dept.addsubdept': 'Add sub department',
  'org.dept.editname': 'Edit name',
  'org.dept.name': 'Department',
  'org.dept.name.validation': 'Department name must be between 2-20 characters',
  'org.dept.select': 'Select Department',
  'org.dept.manager': 'Department manager',
  'org.dept.setmgmt': 'Set management',
  'org.dept.select.validation': 'Please select at least one department',
  'org.dept.search-empty': 'No departments were found',

  'org.dept.delete.title': 'Delete Department',
  'org.dept.delete.head': 'Confirm to delete department?',
  'org.dept.delete.first-line': 'If any form records refer to this department, after deletion:',
  'org.dept.delete.content1': 'Form records will lose the department information',
  'org.dept.delete.content2':
    'If form accessing policies are managed by departments, the records will be visible only to administrators and the owner',

  'org.member.add': 'Add member manually',
  'org.member.all': 'All members',
  'org.member.invite': 'Invite member',
  'org.member.invite.success': 'Invite success',
  'org.member.invite.failed': 'Invite failed',
  'org.member.delete': 'Delete',
  'org.member.delete-confirm': 'Are you sure you want to delete these members?',
  'org.member.name': 'Members',
  'org.member.name.validation': 'Member name must be between 2-15 characters',
  'org.member.email.validation': 'Not a valid email',
  'org.member.email.ph': 'Please input',
  'org.member.adjust-dept': 'Adjust department',
  'org.member.input.name.placeholder': 'Required, up to 12 characters',
  'org.member.loading': 'Loading the list of members',

  'org.member.unJoined-members':
    "{count,plural, one {1 member hasn't} other{{count} members haven't}} joined",
  'org.member.invite-again': 'Invite again',
  'org.member.invite-all-again': 'Invite all again',
  'org.member.joined': 'joined',
  'org.member.pagination.total': 'Total {count,plural, one{1 item} other{{count} items}}',

  // common
  'org.common.invite': 'Invite',
  'org.common.clear': 'Clear',
  'org.common.mobile': 'Mobile',
  'org.common.name': 'Name',
  'org.common.operation': 'Operation',
  'org.common.inviting': 'Inviting',
  'org.common.joined': 'Joined',
  'org.common.input.name.placeholder': 'Please enter name',
};

const msg = {
  'org.msg.addmember.tips1':
    'Fields below cannot be modified after the invitation is accepted, so please provide them properly',
  'org.msg.addmember.tips2':
    'Send the invitation according to the contact information, if both cellphone and email are provided, only the former will recieve the message',
  'org.msg.cannotdept.title': 'Unable to perform this operation',
  'org.msg.cannotdept.description':
    'Departments with subdivisions or members cannot be deleted directly',
};

export default {
  ...schema,
  ...msg,
  ...org,
};
