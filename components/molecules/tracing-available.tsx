import React, {FC} from 'react';
import {StyleSheet, Text, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../../constants/colors';

import {text} from '../../theme';
import {Card} from '../atoms/card';

const TracingImage = require('../../assets/images/information/alt.png');

export const TracingAvailable: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Card
      padding={{h: 0}}
      icon={
        <Image
          accessibilityIgnoresInvertColors
          width={106}
          height={100}
          resizeMode="contain"
          source={TracingImage}
        />
      }
      onPress={() => navigation.navigate('tracing')}>
      <Text style={styles.title}>{t('tracingAvailable:title')}</Text>
      <Text style={[text.smallBold, {color: colors.teal}]}>
        {t('tracingAvailable:text')}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.largeBlack,
    marginBottom: 6
  }
});
