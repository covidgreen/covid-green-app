import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ScreenNames} from 'navigation';
import {useFocusRef} from 'hooks/accessibility';

import {Button} from 'components/atoms/button';
import {Spacing} from 'components/atoms/layout';

import {colors, text} from 'theme';
import Icons from 'assets/icons';
import {SPACING_HORIZONTAL} from 'constants/shared';

const HealthLogo = require('assets/images/healthStateLogo/image.png');

export const AgeCheck: FC<{}> = () => {
  const {t} = useTranslation();
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const [ref] = useFocusRef({accessibilityRefocus: true, timeout: 1250});

  return (
    <View style={[style.container, {paddingTop: insets.top}]}>
      <View style={style.page}>
        <View
          style={style.appLogoWrapper}
          accessible
          accessibilityRole="image"
          accessibilityLabel={t('common:longName')}>
          <Icons.Logo width={106} height={121} />
        </View>
        <View style={style.contentWrapper}>
          <Text style={style.text} maxFontSizeMultiplier={1.7} ref={ref}>
            {t('ageCheck:intro')}
          </Text>
          <Spacing s={20} />
          <Button
            type="empty"
            width="100%"
            fontSizeMultiplier={1.7}
            onPress={() => nav.navigate(ScreenNames.Introduction)}>
            {t('ageCheck:confirm')}
          </Button>
        </View>
      </View>
      <View style={style.stateLogoWrapper}>
        <Image accessibilityIgnoresInvertColors source={HealthLogo} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple,
    paddingBottom: 30
  },
  page: {
    flexGrow: 1
  },
  appLogoWrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentWrapper: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING_HORIZONTAL
  },
  text: {
    ...text.xlarge,
    color: colors.white
  },
  stateLogoWrapper: {
    alignItems: 'center'
  }
});
