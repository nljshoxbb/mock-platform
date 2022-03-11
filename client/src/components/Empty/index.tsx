import React from 'react';
import styles from './index.less';

import EmptyIcon from '@/assets/empty.png';

type Style = {
  [key: string]: string;
};

interface Props {
  title?: string;
  style?: Style;
}

const Empty = (props: Props) => (
  <div className={styles.emptyWrapper} style={props.style}>
    <img src={EmptyIcon} alt="" />
    <div className={styles.title}>{props.title || '暂无数据'}</div>
  </div>
);

export default Empty;
