import React from 'react';
import { LinkR } from '@lib/react-router-dom';
import { useParams } from 'dva';

import styles from './index.scss';

type BaseElementDescr = {
  title: string;
  image: string;
  desc: string;
  disabled?: boolean;
  isNew?: boolean;
  isBeta?: boolean;
};

type AnchorElementDescr = BaseElementDescr & {
  to?: string;
};

type ButtonElementDescr = BaseElementDescr & {
  onClick?: () => void;
};

type ElementDescr = AnchorElementDescr & ButtonElementDescr;

interface BlankCardGroupProps {
  elements?: ElementDescr[];
}
/**
 * 用于 AppDetail 无 Template 或 Home 无 Org
 */
const BlankCardGroup: React.FC<BlankCardGroupProps> = ({ elements }) => {
  const { appId } = useParams();

  return (
    <ul className={styles.cardList}>
      {elements?.map((el) => {
        const content = (
          <div className={styles.cardContainer} data-disabled={el.disabled}>
            <img src={el.image} className={el.to ? null : styles.adjustImg} alt="element" />
            {el.isNew && <span className={styles.indicatorNew}>New</span>}
            <div className={styles.title}>
              {el.title}
              {el.isBeta && <span>beta</span>}
            </div>
            <div className={styles.desc}>{el.desc}</div>
          </div>
        );
        return el.onClick ? (
          <li key={el.title} onClick={el.onClick}>
            {content}
          </li>
        ) : (
          <li key={el.title}>
            <LinkR
              to={el.to ?? '#no-href'}
              values={{ appId }}
              onClick={(e) => {
                if (el.disabled) {
                  e.preventDefault();
                }
              }}
            >
              {content}
            </LinkR>
          </li>
        );
      })}
    </ul>
  );
};

export default BlankCardGroup;
