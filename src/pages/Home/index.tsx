import React from 'react';
import styles from './home.scss';
import welcome from '@img/welcome.jpeg';

export default function () {
  return (
    <div className={styles.root}>
      <img className={styles.img} src={welcome}></img>
    </div>
  );
}
