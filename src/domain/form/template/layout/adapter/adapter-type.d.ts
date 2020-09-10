import { CommonCtrlProperties } from '../../adapter-type.d';

export interface DescriptionControl extends CommonCtrlProperties {
  content: string;
}

export interface GroupTitleControl extends CommonCtrlProperties {
  alignment: string;
}

export interface SubFormControl extends CommonCtrlProperties {
  dataTitle: string;
  displayRule: string;
}
