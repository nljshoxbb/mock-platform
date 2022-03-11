import { useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

function useDeepCompare(value: any) {
  const ref = useRef();
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

function useDeepCompareEffect(callback: () => void, deps: any[]) {
  useEffect(callback, useDeepCompare(deps));
}

export { useDeepCompare };

export default useDeepCompareEffect;
