import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useSafeArea} from 'react-native-safe-area-context';

import {colors} from 'theme';

export const Loading: FC = () => {
  const insets = useSafeArea();
  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <Spinner animation="fade" visible />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple,
    justifyContent: 'space-between'
  }
});
