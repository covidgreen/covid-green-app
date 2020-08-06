import React, {FC} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {SingleRow} from '../atoms/layout';

import {colors} from '../../constants/colors';

import {shadows, text} from '../../theme';
import { AppIcons } from '../../assets/icons';

const TracingImage = require('../../assets/images/information/alt.png');

export const TracingAvailable: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('tracing')}>
      <View style={styles.card}>
        <Image
          accessibilityIgnoresInvertColors
          width={106}
          height={100}
          resizeMode="contain"
          source={TracingImage}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{t('tracingAvailable:title')}</Text>
          <Text style={[text.smallBold, {color: colors.teal}]}>
            {t('tracingAvailable:text')}
          </Text>
        </View>
        <SingleRow>
          <AppIcons.ArrowRight width={24} height={24} color={colors.teal}/>
        </SingleRow>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    ...shadows.default,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16
  },
  icon: {
    width: 88
  },
  content: {
    flex: 1,
    marginLeft: 8
  },
  title: {
    ...text.largeBlack,
    marginBottom: 6
  },
  iconSize: {
    width: 24,
    height: 24
  }
});
