import React, { CSSProperties, ReactNode } from 'react';
import { Tag } from 'antd';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './index.scss';

interface SearchableTagInputProps {
  /* tag data source */
  tags: { id: string; name?: ReactNode; icon?: ReactNode }[];
  /* callback when delete tag */
  onTagClose: (id: string) => void;

  searchName?: string;
  /* search callback */
  onSearch: (name: string) => void;
  /* search input placeholder */
  placeholder?: string;
  style?: CSSProperties;
  className?: string;
}
const SearchableTag: React.FC<SearchableTagInputProps> = (props) => {
  const { tags, onTagClose, onSearch, className, style, placeholder, searchName } = props;
  const intl = useIntl();

  return (
    <div className={classNames(styles.container, className ?? '')} style={style}>
      {tags.map((tag) => (
        <Tag
          closable
          onClose={() => {
            onTagClose(tag.id);
          }}
          icon={tag.icon}
          key={tag.id}
        >
          {tag.name}
        </Tag>
      ))}
      <input
        className={styles.input}
        value={searchName}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        placeholder={placeholder || intl.formatMessage({ id: 'dict.search' })}
      />
    </div>
  );
};

export default SearchableTag;
