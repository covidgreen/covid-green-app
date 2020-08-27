import React, {useEffect, useRef} from 'react';
import {
  Text,
  StyleSheet,
  View,
  findNodeHandle,
  AccessibilityInfo
} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import {Spacing} from './spacing';

import {text as textStyles, colors} from 'theme';

interface HeadingProps {
  text: string;
  lineWidth?: number;
  accessibilityFocus?: boolean;
  accessibilityRefocus?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  text,
  lineWidth,
  accessibilityFocus = false,
  accessibilityRefocus = false
}) => {
  const ref = useRef<any>();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (ref.current && accessibilityFocus) {
      const tag = findNodeHandle(ref.current);
      if (tag) {
        setTimeout(
          () => ref.current && AccessibilityInfo.setAccessibilityFocus(tag),
          200
        );
      }
    }
  }, []);

  useFocusEffect(() => {
    if (isFocused && accessibilityRefocus && ref.current) {
      const tag = findNodeHandle(ref.current);
      if (tag) {
        setTimeout(
          () => ref.current && AccessibilityInfo.setAccessibilityFocus(tag),
          200
        );
      }
    }
  });

  return (
    <>
      <Text importantForAccessibility="yes" ref={ref} style={styles.heading}>
        {text}
      </Text>
      <View style={[styles.line, !!lineWidth && {width: lineWidth}]}>
        <View style={[styles.lineThird, styles.lineOneColor]} />
      </View>
      <Spacing s={16} />
    </>
  );
};
const styles = StyleSheet.create({
  heading: {
    ...textStyles.xlargeBold,
    marginBottom: 18
  },
  line: {
    height: 6,
    flexDirection: 'row',
    marginBottom: 6
  },
  lineThird: {
    width: 56,
    height: 6
  },
  lineOneColor: {
    backgroundColor: colors.info.main
  }
});
