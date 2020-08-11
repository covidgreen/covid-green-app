import React, {FC} from 'react';
import {StyleSheet, Text, Image, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {colors, text} from 'theme';
import {Card} from 'components/atoms/card';

export const CloseContactWarning: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Card
      padding={{v: 0, h: 0}}
      type="warning"
      icon={
        <Image
          accessibilityIgnoresInvertColors
          style={styles.imageSize}
          width={styles.imageSize.width}
          height={styles.imageSize.height}
          source={require('assets/images/exposure-alert/exposure-alert.png')}
        />
      }
      onPress={() => navigation.navigate('closeContact')}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('closeContactWarn:title')}</Text>
        <Text style={styles.notice}>{t('closeContactWarn:notice')}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    marginLeft: -25
  },
  title: {
    ...text.largeBlack,
    color: colors.white
  },
  notice: {
    ...text.default,
    color: colors.white,
    lineHeight: 21
  },
  imageSize: {
    width: 107,
    height: 137
  }
});
