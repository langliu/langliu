import React, { FC } from 'react';
import styles from './page.module.css';

type Props = {
  children: React.ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  return <div className={styles.page}>{children}</div>;
};

export default Layout;
