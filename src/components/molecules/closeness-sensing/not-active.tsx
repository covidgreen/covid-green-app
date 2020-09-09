import React, {forwardRef} from 'react';
import {View, Text, Linking, Platform} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import * as IntentLauncher from 'expo-intent-launcher';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';
import {Markdown} from 'components/atoms/markdown';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

interface NotActiveProps {
  onboarding?: boolean;
  exposureOff?: boolean;
  bluetoothOff?: boolean;
}

export const NotActive = forwardRef<any, NotActiveProps>(
  ({onboarding = false, exposureOff = false, bluetoothOff = false}, ref) => {
    const {t} = useTranslation();
    const exposure = useExposure();
    const nav = useNavigation();

    const gotoSettings = async () => {
      try {
        if (Platform.OS === 'ios') {
          Linking.openURL(exposureOff ? 'app-settings:' : 'App-Prefs:');
        } else {
          if (bluetoothOff) {
            await IntentLauncher.startActivityAsync(
              bluetoothOff
                ? IntentLauncher.ACTION_SETTINGS
                : 'com.google.android.gms.settings.EXPOSURE_NOTIFICATION_SETTINGS'
            );
          }
          await exposure.supportsExposureApi();
        }
      } catch (e) {
        console.log("Error opening app's settings", e);
      }
    };

    return (
      <>
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
            <Text ref={ref} accessibilityRole="header" style={text.defaultBold}>
              {t('closenessSensing:notActive:title')}
            </Text>
            <Spacing s={20} />
            <Markdown style={{}}>
              {t(
                `closenessSensing:notActive:${Platform.OS}:${
                  exposureOff ? 'ens' : bluetoothOff ? 'bt' : 'text'
                }`
              )}
            </Markdown>
            <Spacing s={24} />
            <View style={sharedStyles.buttonsWrapper}>
              <Button onPress={gotoSettings}>
                {t(`closenessSensing:notActive:${Platform.OS}:gotoSettings`)}
              </Button>
            </View>
          </View>
        </Card>
        {onboarding && (
          <>
            <Spacing s={20} />
            <Button
              type="empty"
              onPress={() =>
                nav.reset({
                  index: 0,
                  routes: [{name: 'main'}]
                })
              }>
              {t('closenessSensing:notActive:next')}
            </Button>
          </>
        )}
      </>
    );
  }
);
