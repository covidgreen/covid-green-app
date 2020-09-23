import React, {FC} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import {colors} from 'theme';
import Icons from 'assets/icons';

const HealthLogo = require('assets/images/healthStateLogo/image.png');

export const Loading: FC = () => {
  return (
    <View style={[styles.container]}>
      <Spinner animation="fade" overlayColor="transparent" visible />
      <View style={styles.appLogo}>
        <Icons.Logo width={173} height={198} />
      </View>
      <View style={styles.stateLogo}>
        <Image accessibilityIgnoresInvertColors source={HealthLogo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple
  },
  appLogo: {
    position: 'absolute',
    top: 99,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  stateLogo: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center'
  }
});
