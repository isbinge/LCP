import React from 'react';

interface EmojiProps {
  label?: string;
  symbol: string;
  style?: React.CSSProperties;
}

const Emoji: React.FC<EmojiProps> = ({ symbol, label, style }) => (
  <span
    className="emoji"
    role="img"
    aria-label={label ?? ''}
    aria-hidden={label ? 'false' : 'true'}
    style={style}
  >
    {symbol}
  </span>
);

export default Emoji;
