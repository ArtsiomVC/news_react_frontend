import React from 'react';
import { getDateFormat } from '../../utils';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, name, additionalText }) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={name} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{name}</span>
        <span className={styles.additional}>{getDateFormat(additionalText)}</span>
      </div>
    </div>
  );
};
