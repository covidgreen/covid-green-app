import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {useFocusRef} from 'hooks/accessibility';

import {Spacing} from 'components/atoms/layout';

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
  accessibilityFocus = true,
  accessibilityRefocus = false
}) => {
  const [ref] = useFocusRef({accessibilityFocus, accessibilityRefocus});

  return (
    <>
      <Text accessibilityRole="header" ref={ref} style={styles.heading}>
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
