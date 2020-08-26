import React, {FC} from 'react';
import {View, Text, Platform, Linking} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import * as IntentLauncher from 'expo-intent-launcher';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

interface NotActiveProps {
  exposureOff?: boolean;
  bluetoothOff?: boolean;
}

export const NotActive: FC<NotActiveProps> = ({
  exposureOff = false,
  bluetoothOff = false
}) => {
  const {t} = useTranslation();
  const exposure = useExposure();

  const gotoPhoneSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:');
      } else if (Platform.OS === 'android') {
        await IntentLauncher.startActivityAsync(
          'com.google.android.gms.settings.EXPOSURE_NOTIFICATION_SETTINGS'
        );
        await exposure.supportsExposureApi();
      }
    } catch (e) {
      console.log("Error opening phone's settings", e);
    }
  };

  // android
  const enableExposures = async () => {
    try {
      if (exposure.supported) {
        if (exposure.enabled) {
          await IntentLauncher.startActivityAsync(
            'com.google.android.gms.settings.EXPOSURE_NOTIFICATION_SETTINGS'
          );
        } else {
          await exposure.authoriseExposure();
        }
      } else {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
          {data: 'package:gov.ny.health.proximity'}
        );
      }

      await exposure.supportsExposureApi();
    } catch (e) {
      console.log("Error opening app's settings (android)", e);
    }
  };

  const messageKey =
    Platform.OS === 'ios'
      ? exposureOff
        ? bluetoothOff
          ? 'text11'
          : 'text10'
        : bluetoothOff
        ? 'text01'
        : 'text00'
      : 'text';

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={sharedStyles.cardImageWarning}>
        {bluetoothOff ? (
          <StateIcons.ErrorBluetooth height={144} width={144} />
        ) : (
          <StateIcons.ErrorENS height={144} width={144} />
        )}
      </View>
      <Spacing s={12} />
      <View style={sharedStyles.messageWrapper}>
        <Text style={text.defaultBold}>
          {t('closenessSensing:notActive:title')}
        </Text>
        <Spacing s={20} />
        <Text style={text.default}>
          {t(`closenessSensing:notActive:${Platform.OS}:${messageKey}`)}
        </Text>
        <Spacing s={24} />
        <View style={sharedStyles.buttonsWrapper}>
          <Button
            onPress={
              Platform.OS === 'ios' ? gotoPhoneSettings : enableExposures
            }>
            {t(`closenessSensing:notActive:${Platform.OS}:ctaButton`)}
          </Button>
        </View>
      </View>
    </Card>
  );
};
