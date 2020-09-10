import { FormItemSpec } from '../../model';
import { checkControlType } from '../../common';

import { Input } from './input';
import { Checkbox } from './checkbox';
import { DateTime } from './date';
import { Number as NumberCtrl } from './number';
import { Radio } from './radio';
import { Select } from './select';
import { Switch } from './switch';
import { Textarea } from './textarea';
import { StaffSingleSelect } from './staffSingleSelect';
import { StaffMultiSelect } from './staffMultiSelect';
import { DeptSelect } from './deptSelect';

import { BasicCtrlType } from '../../adapter-type.d';

export function adaptBasicControlData(basicControlData: FormItemSpec[]) {
  const adaptedInputData = new Input().adapt(basicControlData.filter(checkControlType('input')));
  const adaptedCheckboxGroupData = new Checkbox().adapt(
    basicControlData.filter(checkControlType('checkbox')),
  );
  const adaptedDateTimeData = new DateTime().adapt(
    basicControlData.filter(checkControlType('date')),
  );
  const adaptedNumberData = new NumberCtrl().adapt(
    basicControlData.filter(checkControlType('number')),
  );
  const adaptedRadioData = new Radio().adapt(basicControlData.filter(checkControlType('radio')));
  const adaptedSelectData = new Select().adapt(basicControlData.filter(checkControlType('select')));
  const adaptedSwitchData = new Switch().adapt(basicControlData.filter(checkControlType('switch')));
  const adaptedTextareaData = new Textarea().adapt(
    basicControlData.filter(checkControlType('textarea')),
  );
  const adaptedStaffSingleSelectData = new StaffSingleSelect().adapt(
    basicControlData.filter(checkControlType('staffSingleSelect')),
  );
  const adaptedStaffMultiSelectData = new StaffMultiSelect().adapt(
    basicControlData.filter(checkControlType('staffMultiSelect')),
  );
  const adaptedDeptSingleSelectData = new DeptSelect().adapt(
    basicControlData.filter(checkControlType('deptSingleSelect')),
  );
  const adaptedDeptMultiSelectData = new DeptSelect().adapt(
    basicControlData.filter(checkControlType('deptMultiSelect')),
  );
  return {
    singleLineInputControlDtos: adaptedInputData.length > 0 ? adaptedInputData : null,
    checkboxGroupControlDtos: adaptedCheckboxGroupData.length > 0 ? adaptedCheckboxGroupData : null,
    dateTimeControlDtos: adaptedDateTimeData.length > 0 ? adaptedDateTimeData : null,
    numberInputControlDtos: adaptedNumberData.length > 0 ? adaptedNumberData : null,
    checkboxControlDtos: adaptedRadioData.length > 0 ? adaptedRadioData : null,
    selectControlDtos: adaptedSelectData.length > 0 ? adaptedSelectData : null,
    switchControlDtos: adaptedSwitchData.length > 0 ? adaptedSwitchData : null,
    textAreaInputControlDtos: adaptedTextareaData.length > 0 ? adaptedTextareaData : null,
    staffSingleSelectControlDtos:
      adaptedStaffSingleSelectData.length > 0 ? adaptedStaffSingleSelectData : null,
    staffMultiSelectControlDtos:
      adaptedStaffMultiSelectData.length > 0 ? adaptedStaffMultiSelectData : null,
    deptSingleSelectControlDtos:
      adaptedDeptSingleSelectData.length > 0 ? adaptedDeptSingleSelectData : null,
    deptMultiSelectControlDtos:
      adaptedDeptMultiSelectData.length > 0 ? adaptedDeptMultiSelectData : null,
  };
}

export function parseBasicControlData(serverData: BasicCtrlType) {
  return [
    ...new Input().parse(serverData.singleLineInputControls),
    ...new Checkbox().parse(serverData.checkboxGroupControls),
    ...new DateTime().parse(serverData.dateTimeControls),
    ...new NumberCtrl().parse(serverData.numberInputControls),
    ...new Radio().parse(serverData.checkboxControls),
    ...new Select().parse(serverData.selectControls),
    ...new Switch().parse(serverData.switchControls),
    ...new Textarea().parse(serverData.textAreaInputControls),
    ...new StaffSingleSelect().parse(serverData.staffSingleSelectControls),
    ...new StaffMultiSelect().parse(serverData.staffMultiSelectControls),
    ...new DeptSelect().parse(serverData.deptSingleSelectControls),
    ...new DeptSelect().parse(serverData.deptMultiSelectControls),
  ];
}
