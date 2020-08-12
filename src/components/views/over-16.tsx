import React, {FC} from 'react';
import {StyleSheet, View, Text, Dimensions, Image} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';

import {Button} from 'components/atoms/button';
import {colors, text} from 'theme';
import {Link} from 'components/atoms/link';
import {Spacing} from 'components/atoms/spacing';

const width = Dimensions.get('window').width;
const SPLASH_WIDTH = 375;
const SPLASH_HEIGHT = 291;

export const Over16: FC<any> = ({navigation}) => {
  const {t} = useTranslation();
  const insets = useSafeArea();

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <View style={styles.bg} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.empty} />
        <Image
          style={{width, height: (width * SPLASH_HEIGHT) / SPLASH_WIDTH}}
          width={width}
          height={(width * SPLASH_HEIGHT) / SPLASH_WIDTH}
          resizeMode="contain"
          source={require('assets/age-bg.png')}
          accessible
          accessibilityRole="text"
          accessibilityHint={t('common:name')}
          accessibilityIgnoresInvertColors={false}
        />
        <View style={styles.bottom}>
          <Spacing s={32} />
          <Text style={[text.largeBold, styles.center]}>
            {t('ageRequirement:notice')}
          </Text>
          <Spacing s={24} />
          <Button onPress={() => navigation.replace('getStarted')}>
            {t('ageRequirement:over')}
          </Button>
          <Spacing s={24} />
          <Link
            align="center"
            large={true}
            onPress={() => navigation.replace('under16')}>
            {t('ageRequirement:under')}
          </Link>
          <Spacing s={24} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between'
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    height: 250,
    backgroundColor: colors.yellow
  },
  scroll: {
    flex: 1
  },
  empty: {
    flex: 1,
    backgroundColor: colors.yellow
  },
  bottom: {
    paddingHorizontal: 20
  },
  center: {
    textAlign: 'center'
  }
});
