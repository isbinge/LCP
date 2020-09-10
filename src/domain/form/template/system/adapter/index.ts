import { v1 as uuidv1 } from 'uuid';
import { FormItemSpec } from '../../model';
import { checkControlType, systemDefaultSequenceNumberMap } from '../../common';

import { CreatTime } from './create-time';
import { Creator } from './creator';
import { UpdateTime } from './update-time';
import { SerialNo } from './serial-number';
import { Owner } from './owner';
import { OwnerDept } from './owner-dept';
import { SystemCtrlType } from '../../adapter-type.d';

const getDefaultCreateTimeCtrl = (formId: string) => ({
  id: uuidv1(),
  // 只作为占位，实际按当前语言显示，下同
  name: 'Created Time',
  code: 'CreateDateTime',
  formTemplateId: formId,
  subFormTemplateId: null,
  dataType: 5,
  controlGroupType: 3,
  controlType: 19,
  sequenceNumber: systemDefaultSequenceNumberMap.createTime,
  displayRule: null,
});
const getDefaultUpdateTimeCtrl = (formId: string) => ({
  id: uuidv1(),
  name: 'Updated Time',
  code: 'UpdateDateTime',
  formTemplateId: formId,
  subFormTemplateId: null,
  dataType: 5,
  controlGroupType: 3,
  controlType: 20,
  sequenceNumber: systemDefaultSequenceNumberMap.modifyTime,
  displayRule: null,
});
const getDefaultCreatorCtrl = (formId: string) => ({
  id: uuidv1(),
  name: 'Creator',
  code: 'CreateUserId',
  formTemplateId: formId,
  subFormTemplateId: null,
  dataType: 2,
  controlGroupType: 3,
  controlType: 18,
  sequenceNumber: systemDefaultSequenceNumberMap.creator,
  displayRule: null,
});
const getOwnerCtrl = (formId: string) => ({
  id: uuidv1(),
  name: 'Owner',
  code: 'OwnerId',
  formTemplateId: formId,
  subFormTemplateId: null,
  dataType: 2,
  controlGroupType: 3,
  controlType: 29,
  sequenceNumber: systemDefaultSequenceNumberMap.owner,
  displayRule: null,
});
const getOwnerDeptCtrl = (formId: string) => ({
  id: uuidv1(),
  name: 'Owner Dept',
  code: 'OwnerDeptId',
  formTemplateId: formId,
  subFormTemplateId: null,
  dataType: 2,
  controlGroupType: 3,
  controlType: 30,
  sequenceNumber: systemDefaultSequenceNumberMap.ownerDept,
  displayRule: null,
});
// const getDefaultSerialNoCtrl = (formId: string) => ({
//   id: uuidv1(),
//   name: 'Serial No.',
//   code: 'SerialNumber',
//   formTemplateId: formId,
//   subFormTemplateId: null,
//   dataType: 1,
//   controlGroupType: 3,
//   controlType: 17,
//   sequenceNumber: SystemDefaultSequenceNumber.serialNo,
//   SeqNoStructure:
//     'Type:1,Value:YYYY;Type:2,IncreNum:8,Value:1;Type:3,Value:f;Type:4,Value:F0000012,Label:课程',
// });
export function adaptSystemControlData(
  systemControlData: FormItemSpec[],
  { formId }: { formId: string },
) {
  const createTimeCtrl = systemControlData.find(checkControlType('createTime'));
  const creatorCtrl = systemControlData.find((controlItem) => controlItem.compType === 'creator');
  const updateTimeCtrl = systemControlData.find(checkControlType('modifyTime'));
  const serialNoCtrl = systemControlData.find(checkControlType('serialNo'));
  const ownerCtrl = systemControlData.find(checkControlType('owner'));
  const ownerDeptCtrl = systemControlData.find(checkControlType('ownerDept'));

  return {
    createDateTimeControlDto: createTimeCtrl
      ? new CreatTime().adapt(createTimeCtrl)
      : getDefaultCreateTimeCtrl(formId),
    creatorControlDto: creatorCtrl
      ? new Creator().adapt(creatorCtrl)
      : getDefaultCreatorCtrl(formId),
    updateDateTimeControlDto: updateTimeCtrl
      ? new UpdateTime().adapt(updateTimeCtrl)
      : getDefaultUpdateTimeCtrl(formId),
    serialNumberControlDto: serialNoCtrl ? new SerialNo().adapt(serialNoCtrl) : null,

    ownerControlDto: ownerCtrl ? new Owner().adapt(ownerCtrl) : getOwnerCtrl(formId),
    ownerDeptControlDto: ownerDeptCtrl
      ? new OwnerDept().adapt(ownerDeptCtrl)
      : getOwnerDeptCtrl(formId),
  };
}

export function parseSystemControlData(serverData: SystemCtrlType) {
  const parsedSystemControlData = [];
  if (serverData.createDateTimeControl) {
    parsedSystemControlData.push(new CreatTime().parse(serverData.createDateTimeControl));
  }
  if (serverData.creatorControl) {
    parsedSystemControlData.push(new Creator().parse(serverData.creatorControl));
  }
  if (serverData.updateDateTimeControl) {
    parsedSystemControlData.push(new UpdateTime().parse(serverData.updateDateTimeControl));
  }
  if (serverData.serialNumberControl) {
    parsedSystemControlData.push(new SerialNo().parse(serverData.serialNumberControl));
  }
  if (serverData.ownerControl) {
    parsedSystemControlData.push(new Owner().parse(serverData.ownerControl));
  }
  if (serverData.ownerDeptControl) {
    parsedSystemControlData.push(new OwnerDept().parse(serverData.ownerDeptControl));
  }
  return parsedSystemControlData;
}
