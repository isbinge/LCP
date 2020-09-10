import { message as antMessage } from 'antd';
import { ArgsProps as MessageArgsProps, MessageType } from 'antd/lib/message';
import { MessageDescriptor } from 'react-intl';
import config from '@/config';
import { ReactNode } from 'react';
import LcpIntl from '@/utils/locale';

type Values = Record<string, PrimitiveType>;

interface MessageSpec
  extends Omit<MessageArgsProps, 'duration' | 'type' | 'content'>,
    MessageDescriptor {
  values?: Values;
  content?: ReactNode;
}

type NoticeType = MessageArgsProps['type'];

const messageIntlFactory = (type: NoticeType) => (msgIntlOptions: MessageSpec) => {
  const intType = type || 'info';
  const { intl } = LcpIntl;
  const { id, values, content, defaultMessage, description, ...params } = msgIntlOptions;
  if (id) {
    return antMessage.open({
      duration: config.antd.messageDurationProd,
      ...params,
      type: intType,
      content: intl.formatMessage({ id, defaultMessage, description }, values),
    });
  }
  return antMessage.open({
    duration: config.antd.messageDurationProd,
    ...params,
    type: intType,
    content,
  });
};

type MsgIntl = {
  [key in NoticeType]: (msgIntlOptions: MessageSpec) => MessageType;
};

/**
 * Antd.messasge i18n Wrapper (**workaround**)
 *
 * @deprecated 注：这是一个临时解决方案
 * 由于 antd.message 与 react-intl 之间的问题
 * 临时使用包装后的 antd.message 组件进行国际化
 * 未来将被移除
 * @author Kirk
 */

export const msgIntl: MsgIntl = {
  success: messageIntlFactory('success'),
  error: messageIntlFactory('error'),
  warning: messageIntlFactory('warning'),
  loading: messageIntlFactory('loading'),
  info: messageIntlFactory('info'),
};
