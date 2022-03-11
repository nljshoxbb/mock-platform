import { useCallback, useMemo, useState } from 'react';

export declare type ModalType = 'add' | 'update' | 'info' | 'list';

export interface UseModalConfig {
  defaultVisible?: boolean;
  defaultType?: ModalType;
}

export default function useModal(config: UseModalConfig = {}) {
  const { defaultType = 'add', defaultVisible = false } = config;
  const [type, setType] = useState<ModalType>(defaultType);
  const [visible, setVisible] = useState<boolean>(defaultVisible);

  return {
    visible,
    type,
    ...useMemo(() => {
      return {
        setVisible: (val: boolean) => {
          setVisible(val);
        },
        toggle: () => {
          setVisible((oldState) => !oldState);
        },
        setType: (val: ModalType) => {
          setType(val);
        },
        setTypeWithVisible: (val: ModalType) => {
          setType(val);
          setVisible(true);
        },
      };
    }, [type, visible]),
  };
}
