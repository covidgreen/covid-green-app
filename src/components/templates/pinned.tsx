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
  children: any;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const PinnedBottom: FC<LayoutProps> = ({
  children,
  heading,
  style,
  contentContainerStyle
}) => {
  const insets = useSafeArea();
  const content = React.Children.toArray(children);
  const bottom = content.pop();

  return (
    <View
      style={[
        styles.container,
        {paddingBottom: insets.bottom + SPACING_BOTTOM},
        style
      ]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="always">
        {heading && <Heading text={heading} />}
        {content}
      </ScrollView>
      <View>{bottom}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingTop: SPACING_TOP,
    paddingHorizontal: SPACING_HORIZONTAL
  },
  scroll: {
    flex: 1
  }
});
