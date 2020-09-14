import React, {forwardRef} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {colors, text} from 'theme';
import {Card} from 'components/atoms/card';
import {StateIcons, AppIcons} from 'assets/icons';
import {ScreenNames} from 'navigation';

interface AlertInformationProps {
  bluetoothOff?: boolean;
}

export const AlertInformation = forwardRef<
  TouchableWithoutFeedback,
  AlertInformationProps
>(({bluetoothOff}, ref) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Card
      ref={ref}
      padding={{h: 10, r: 16}}
      onPress={() => navigation.navigate(ScreenNames.MyCovidAlerts)}
      type="info"
      arrowColor={colors.black}>
      <View style={styles.row}>
        {bluetoothOff ? (
          <AppIcons.BluetoothOff width={40} height={30} color={colors.text} />
        ) : (
          <StateIcons.ExposureUnset
            width={40}
            height={40}
            color={colors.text}
          />
        )}
        <Text style={styles.notice}>
          {bluetoothOff
            ? t('alertsUnavailablePrompt:bluetoothOff')
            : t('alertsUnavailablePrompt:title')}
        </Text>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notice: {
    ...text.defaultBold,
    color: colors.black,
    paddingRight: 35,
    paddingLeft: 10
  }
});
