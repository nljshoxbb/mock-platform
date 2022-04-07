import { Button as AntdButton } from 'antd';
import type { ButtonProps } from 'antd';
import React from 'react';

import styles from './index.less';

export interface CustomButtonProps extends ButtonProps {
  btnType?: 'ok' | 'cancel';
}

const Button = (props: CustomButtonProps): React.ReactElement => {
  const { type, btnType, ...rest } = props;

  let className = styles.main;

  if (type === 'default') {
    className += ` ${styles.default}`;
  }

  if (btnType === 'ok') {
    className += ` ${styles.ok}`;
  }

  if (btnType === 'cancel') {
    className += ` ${styles.cancel}`;
  }

  return (
    <AntdButton {...rest} type={type} className={`${className} ${props.className}`}>
      {props.children}
    </AntdButton>
  );
};

export default Button;
