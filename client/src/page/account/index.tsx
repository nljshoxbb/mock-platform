import React, { useEffect, useState } from 'react';

import { Button } from 'antd';
import Edit from './modal/index';
import { LocalStorage } from "@/utils/LocalStorage";

import { UserLoginResponse } from '@/services';
import styles from './index.less';
import useModal from '@/hooks/useModal';

const SystemAccount = () => {
  const editModal = useModal();
  const [data, setData] = useState<UserLoginResponse>();
  useEffect(() => {
    setData(JSON.parse(localStorage.getItem(LocalStorage.MOCK_USER_INFO) || '{}'));
  }, []);
  const config = [
    {
      label: '用户名：',
      name: data?.username,
    }
  ];
  return (
    <div style={{padding:30}}>
    <div style={{ marginBottom: 50, }}>
      {config.map((item, i) => {
        return (
          <div className="flex " key={i}>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.name}>{item.name}</div>
          </div>
        );
      })}
    </div>
    <Button
      className="mb16"
      type="primary"
      onClick={() => {
        editModal.setVisible(true);
      }}
    >
      修改密码
    </Button>
    <Edit
      title="修改密码"
      visible={editModal.visible}
      onCancel={() => {
        editModal.setVisible(false);
      }}
      // onSuccess={(audioId) => {
      //   console.log(audioId, 'value');
      //   setSelAudio(audioId);
      //   reqViodeData();
      // }}
      // currentItem={currentItem}
      type={editModal.type}
      width={560}
    />
  </div>
    
  );
};

export default SystemAccount;
