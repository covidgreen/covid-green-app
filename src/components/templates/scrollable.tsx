import React, {FC, MutableRefObject} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  ViewStyle
} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';

import {
  SPACING_TOP,
  SPACING_BOTTOM,
  SPACING_HORIZONTAL
} from 'constants/shared';
import {Heading} from 'components/atoms/heading';
import {Spacing} from 'components/atoms/layout';

interface LayoutProps {
  toast?: React.ReactNode;
  heading?: string;
  headingShort?: boolean;
  backgroundColor?: string;
  refresh?: {
    refreshing: boolean;
    onRefresh: () => void;
  };
  scrollViewRef?: MutableRefObject<ScrollView | null>;
  safeArea?: boolean;
  children: React.ReactNode;
  accessibilityRefocus?: boolean;
  scrollStyle?: ViewStyle;
}

export const Scrollable: FC<LayoutProps> = ({
  toast,
  heading,
  headingShort = false,
  backgroundColor,
  refresh,
  scrollViewRef,
  safeArea = true,
  children,
  accessibilityRefocus = true,
  scrollStyle
}) => {
  const insets = useSafeArea();
  const refreshControl = refresh && <RefreshControl {...refresh} />;

  return (
    <View style={[styles.container, !!backgroundColor && {backgroundColor}]}>
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={[
          styles.scrollView,
          {paddingBottom: (safeArea ? insets.bottom : 0) + SPACING_BOTTOM},
          {...scrollStyle}
        ]}
        refreshControl={refreshControl}>
        {toast && (
          <>
            {toast}
            <Spacing s={8} />
          </>
        )}
        {heading && (
          <Heading
            accessibilityRefocus={accessibilityRefocus}
            lineWidth={headingShort ? 75 : undefined}
            text={heading}
          />
        )}
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  scrollView: {
    paddingTop: SPACING_TOP,
    paddingHorizontal: SPACING_HORIZONTAL
  }
});
