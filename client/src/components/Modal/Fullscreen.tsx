import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import Modal from '.';
import type { Props } from '.';
import styles from './index.less';

const Fullscreen: React.FC<Props> = ({ title, width, children, ...rest }) => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  return (
    <Modal
      wrapClassName={fullscreen && styles.full}
      width={fullscreen ? '100%' : width}
      title={
        <div className="tc" style={{ position: 'relative' }}>
          {title}
          <div style={{ position: 'absolute', right: 35, top: 1 }}>
            {fullscreen ? (
              <FullscreenExitOutlined
                onClick={() => {
                  setFullscreen(false);
                }}
              />
            ) : (
              <FullscreenOutlined
                onClick={() => {
                  setFullscreen(true);
                }}
              />
            )}
          </div>
        </div>
      }
      centered
      {...rest}
    >
      <div style={{ overflowX: 'auto', height: fullscreen ? 'calc(100vh - 110px)' : '780px' }}>
        {children}
      </div>
    </Modal>
  );
};

export default Fullscreen;
