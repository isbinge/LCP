import global from './_common/global';
import dict from './_common/dict';
import msg from './_common/msg';

import app from './app';
import invitation from './invitation';
import home from './home';
import page40x from './40x';

import formInst from './form/form-inst';
import formTpl from './form/form-tpl';
import org from './org';
import profile from './profile';
import role from './role';

export default {
  ...global,
  ...dict,
  ...msg,
  ...home,
  ...app,
  ...invitation,
  ...formInst,
  ...formTpl,
  ...page40x,
  ...org,
  ...role,
  ...profile,
};
