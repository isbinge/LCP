import './shared.global.scss';
import { CSSProperties } from 'react';

export interface PartialSkelotion {
  loading?: boolean;
  active?: boolean;
  style?: CSSProperties;
}

export { LoadingAvatar } from './Avatar';
export { LoadingParagraph } from './Paragraph';
export { LoadingTitle } from './Title';
