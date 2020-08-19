import React, {FC} from 'react';
import {Platform, Linking, View, Text} from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import {useTranslation} from 'react-i18next';

import {StateIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {text} from 'theme';
import {Markdown} from 'components/atoms/markdown';
import {Spacing} from 'components/atoms/layout';
import {useExposure} from 'react-native-exposure-notification-service';
import {styles as cardStyles} from './active';

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

  const gotoSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        if (exposureOff) {
          Linking.openURL('app-settings:');
        } else {
          Linking.openURL('App-Prefs:');
        }
      } else {
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
      }
    } catch (e) {
      console.log("Error opening app's settings", e);
    }
  };

  const messageKey = exposureOff
    ? bluetoothOff
      ? 'message11'
      : 'message10'
    : bluetoothOff
    ? 'message01'
    : 'message00';

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={[cardStyles.cardImage, {backgroundColor: '#ecdbe4'}]}>
        {exposureOff && <StateIcons.ErrorENS height={144} width={144} />}
        {bluetoothOff && <StateIcons.ErrorBluetooth height={144} width={144} />}
      </View>
      <Spacing s={4} />
      <View style={cardStyles.row}>
        <View style={cardStyles.messageWrapper}>
          <Text style={text.defaultBold}>
            {t('contactTracing:notActive:title')}
          </Text>
          <Spacing s={16} />
          <Markdown style={text.default}>
            {Platform.OS === 'ios'
              ? t(`contactTracing:notActive:${messageKey}`)
              : t('contactTracing:notActive:android:message')}
          </Markdown>
          <Spacing s={12} />
          <Button style={cardStyles.button} onPress={gotoSettings}>
            {Platform.OS === 'ios'
              ? t('contactTracing:notActive:button')
              : t('contactTracing:notActive:android:button')}
          </Button>
        </View>
      </View>
    </Card>
  );
};
