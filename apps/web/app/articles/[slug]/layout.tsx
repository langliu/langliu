import React, { FC } from 'react';
import styles from './page.module.css';

interface Props {
  children: React.ReactElement;
}

const layout: FC<Props> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default layout;
