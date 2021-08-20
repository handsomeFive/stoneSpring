import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import Modal, { Props } from './Modal';

export default class ModalPortals extends React.PureComponent<Props> {
  el?: HTMLDivElement;

  // static alert = ;

  componentDidMount() {
    this.el = document.createElement('div');
    this.el.className = '__modal__';
    document.body.appendChild(this.el);
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.el && document.body.removeChild(this.el);
  }

  render() {
    if (!this.el) {
      return null;
    }

    return ReactDOM.createPortal(<Modal {...this.props} />, this.el);
  }
}
