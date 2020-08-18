import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {Card} from 'components/atoms/card';
import {colors, text} from 'theme';
import {StateIcons} from 'assets/icons';

export const TracingAvailable: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Card
      padding={{h: 10, r: 16}}
      onPress={() => navigation.navigate('tracing')}
      type="info">
      <View style={styles.row}>
        <StateIcons.ExposureUnset width={40} height={40} color={colors.text} />
        <Text style={styles.notice}>{t('tracingAvailable:text')}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notice: {
    ...text.defaultBold,
    paddingRight: 30,
    paddingLeft: 10
  }
});
