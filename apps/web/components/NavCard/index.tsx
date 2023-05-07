import React, { FC } from 'react';
import styles from './index.module.css';

type Props = {
  href: string;
  title: string;
  tags?: string[];
  description: string;
  iconUrl: string;
};

const NavCard: FC<Props> = ({
  href,
  title,
  tags = [],
  description,
  iconUrl,
}) => {
  return (
    <div className={styles.card}>
      <a href={href} title={title} className={styles.cardBody}>
        <div>
          <img
            data-src={iconUrl}
            className={styles.icon}
            alt={title}
            src={iconUrl}
            loading="lazy"
          ></img>
        </div>
        <div className={styles.content}>
          <h5>{title}</h5>
          <p className={styles.tags}>
            {tags.map((tag) => (
              <span className={styles.tag} key={tag}>
                {tag}
              </span>
            ))}
          </p>
          <p className={styles.desc}>{description}</p>
        </div>
      </a>
    </div>
  );
};

export default NavCard;
