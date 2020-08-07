import React, {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../../constants/colors';
import {text} from '../../theme';
import {Card} from '../atoms/card';

export const CloseContactWarning: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Card
      padding={{v: 0, h: 0}}
      type="warning"
      icon={{
        w: 107,
        h: 137,
        mr: -25,
        source: require('../../assets/images/exposure-alert/exposure-alert.png')
      }}
      onPress={() => navigation.navigate('closeContact')}>
      <Text style={styles.title}>{t('closeContactWarn:title')}</Text>
      <Text style={styles.notice}>{t('closeContactWarn:notice')}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.largeBlack,
    color: colors.white
  },
  notice: {
    ...text.default,
    color: colors.white,
    lineHeight: 21
  }
});
