import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from 'theme';

export const Base: React.FC = ({children}) => {
  return (
    <View style={styles.container} testID="base">
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  }
});
