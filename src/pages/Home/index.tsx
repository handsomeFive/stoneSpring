import React, { useCallback, useState } from 'react';
import styles from './home.module.scss';
import welcome from '@img/welcome.jpeg';
import Modal from '@/components/Modal';

export default function () {
  const [visible, setVisible] = useState<boolean>(false);

  const shiftVisible = () => setVisible(!visible);

  return (
    <div className={styles.root} onClick={shiftVisible}>
      <img className={styles.img} src={welcome}></img>
      <Modal visible={visible} onClose={shiftVisible} tapMaskClose>
        <div className={styles.ad}></div>
      </Modal>
    </div>
  );
}
