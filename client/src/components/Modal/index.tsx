import { Modal as AntdModal } from 'antd';
import type { ModalProps } from 'antd';
import { noop } from 'lodash';
import React from 'react';
import * as ReactDOM from 'react-dom';

import Button from '../Button';
import styles from './index.less';

export type Props = ModalProps;
interface ConfirmProps extends Props {
  content?: React.ReactNode | string;
  onOk?: () => void | Promise<any>;
}

interface StaticComponents {
  confirm: (config: ConfirmProps) => void;
}

const Modal: React.FC<Props> & StaticComponents = (props) => {
  const { title, ...rest } = props;

  let defaultFooter = props.footer;

  if (props.footer === undefined) {
    defaultFooter = (
      <div className="flex just-between">
        <Button type="primary" btnType="ok" onClick={props.onOk} loading={props.confirmLoading} disabled={props.okButtonProps?.disabled}>
          确定
        </Button>
        <Button btnType="cancel" type="primary" onClick={props.onCancel}>
          取消
        </Button>
      </div>
    );
  }

  return (
    <AntdModal
      destroyOnClose
      {...rest}
      footer={defaultFooter}
      title={<div className={`tc ${styles.title}`}>{title}</div>}
      wrapClassName={`${styles.wrap} ${title === null && styles.notitle} ${rest.wrapClassName}`}
    >
      {props.children}
    </AntdModal>
  );
};

const confirm = (props: ConfirmProps = {}) => {
  const container = document.createDocumentFragment();
  const { onCancel = noop, onOk = noop, content, title, footer, closeIcon, wrapClassName } = props;
  const currentConfig: ConfirmProps = {
    visible: true,
    onCancel,
    onOk,
    content,
    title,
    footer,
    closeIcon,
    wrapClassName
  };

  function destroy(...args: any[]) {
    ReactDOM.unmountComponentAtNode(container);
  }

  function close(...args: any[]) {
    render({ visible: false });
  }

  function render(config: ConfirmProps) {
    const okFn = config.onOk;

    setTimeout(() => {
      ReactDOM.render(
        <Modal
          visible={config.visible}
          title={config.title}
          onCancel={close}
          onOk={() => {
            const p = okFn && okFn();
            if (p instanceof Promise) {
              p.then(() => {
                close();
              });
            } else {
              close();
            }
          }}
          afterClose={() => {
            destroy();
          }}
          footer={config.footer}
          wrapClassName={config.wrapClassName}
          closeIcon={config.closeIcon}
          // confirmLoading={isOkPromise}
        >
          {React.isValidElement(config.content) ? config.content : <div className="tc mt30 mb30 fb fs16">{config.content}</div>}
        </Modal>,
        container
      );
    });
  }
  render(currentConfig);
};

Modal.confirm = confirm;

export default Modal;
