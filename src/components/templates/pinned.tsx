import React, {FC} from 'react';
import {StyleSheet, View, ScrollView, ViewStyle} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';

import {
  SPACING_TOP,
  SPACING_BOTTOM,
  SPACING_HORIZONTAL
} from 'constants/shared';
import {colors} from 'theme';
import {Heading} from 'components/atoms/heading';

interface LayoutProps {
  heading?: string;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  children: any;
}

export const PinnedBottom: FC<LayoutProps> = ({
  children,
  heading,
  containerStyle,
  contentStyle
}) => {
  const insets = useSafeArea();
  const content = React.Children.toArray(children);
  const bottom = content.pop();

  const padHorizontal = {paddingHorizontal: SPACING_HORIZONTAL};

  return (
    <View
      style={[
        styles.container,
        {paddingBottom: insets.bottom + SPACING_BOTTOM},
        containerStyle
      ]}>
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="always">
        <View style={[padHorizontal, contentStyle]}>
          {heading && <Heading accessibilityFocus text={heading} />}
          {content}
        </View>
      </ScrollView>
      <View style={padHorizontal}>{bottom}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    paddingTop: SPACING_TOP
  },
  scroll: {
    flex: 1
  }
});
