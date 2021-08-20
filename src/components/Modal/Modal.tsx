import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Modal.module.scss';
import cn from 'classnames';

export interface Props {
  visible: boolean;
  archor?: 'top' | 'bottom' | 'center';
  children?: React.ReactElement;
  tapMaskClose?: boolean;
  animationDuration?: number;
  onClose: () => void;
  onClosed?: () => void;
}

export default function Modal(props: Props) {
  const [show, setShow] = useState<boolean>(false);
  const prevState = useRef<boolean>();
  const el = useRef<HTMLDivElement>(null);
  const maskEl = useRef<HTMLDivElement>(null);
  const handleTouchClose = useCallback(function () {
    props.tapMaskClose && props.onClose();
  }, []);
  const handleStopPropagation = useCallback(function (e) {
    e.stopPropagation();
  }, []);
  const open = useCallback(function () {
    // 打开弹窗 蒙层先上 再动画
    switch (props.archor) {
      case 'top':
        break;
      case 'center':
        //  = `transition  ${animationDuration}s`;
        break;
      case 'bottom':
        break;
    }
    setShow(true);
  }, []);
  const close = useCallback(function () {
    // 关闭弹窗 动画结束 再关闭蒙层
    setTimeout(function () {
      setShow(false);
      props.onClosed && props.onClosed();
    }, props.animationDuration);
  }, []);

  useEffect(
    function () {
      if (prevState.current === props.visible) return;
      if (props.visible) {
        close();
      } else {
        open();
      }
      prevState.current = props.visible;
    },
    [props.visible]
  );

  return (
    <div className={cn({ [styles.modalWrapper]: true, [styles.open]: show })}>
      <div className={styles.modalMask} ref={maskEl} />
      <div
        className={cn(styles.modalContent, styles['archor_' + props.archor])}
        onClick={handleTouchClose}
        ref={el}
      >
        <div
          className={styles.modalContentWrapper}
          onClick={handleStopPropagation}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}

Modal.defaultProps = {
  archor: 'center',
  tapMaskClose: false,
  animationDuration: 300,
};
