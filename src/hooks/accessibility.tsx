import {useEffect, useCallback, useMemo, createRef, RefObject} from 'react';
import {findNodeHandle, AccessibilityInfo} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

interface FocusRefProps {
  accessibilityFocus?: boolean;
  accessibilityRefocus?: boolean;
}

export function setAccessibilityFocusRef(ref: RefObject<any>) {
  if (ref.current) {
    const tag = findNodeHandle(ref.current);
    tag &&
      setTimeout(
        () => ref.current && AccessibilityInfo.setAccessibilityFocus(tag),
        250
      );
  }
}

export function useFocusRef<T = any>(
  props: FocusRefProps = {accessibilityFocus: true, accessibilityRefocus: true},
  count: number = 1
): RefObject<T>[] {
  const {accessibilityFocus, accessibilityRefocus} = props;
  const refs = useMemo(
    () => Array.from({length: count}).map(() => createRef<any>()),
    [count]
  );
  const isFocused = useIsFocused();

  useEffect(() => {
    if (accessibilityFocus) {
      const firstRefIdx = refs.findIndex(
        (ref) => ref.current && findNodeHandle(ref.current)
      );
      if (firstRefIdx !== -1) {
        const firstRef = refs[firstRefIdx];
        const tag = findNodeHandle(firstRef.current);
        tag &&
          setTimeout(
            () =>
              firstRef.current && AccessibilityInfo.setAccessibilityFocus(tag),
            250
          );
      }
    }
  }, [accessibilityFocus, refs]);

  useFocusEffect(
    useCallback(() => {
      if (accessibilityFocus && accessibilityRefocus && isFocused) {
        const firstRef = refs.find(
          (ref) => ref.current && findNodeHandle(ref.current)
        );
        if (firstRef) {
          const tag = findNodeHandle(firstRef.current);
          tag &&
            setTimeout(
              () =>
                firstRef.current &&
                AccessibilityInfo.setAccessibilityFocus(tag),
              250
            );
        }
      }
    }, [accessibilityFocus, accessibilityRefocus, isFocused, refs])
  );

  return refs;
}
