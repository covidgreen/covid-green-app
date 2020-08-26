import React, {FC} from 'react';
import {View, Text, Linking, Platform} from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import {useExposure} from 'react-native-exposure-notification-service';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

export const NotEnabled: FC = () => {
  const {t} = useTranslation();
  const exposure = useExposure();

  const gotoAppSettings = async () => {
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
      console.log("Error opening app's settings", e);
    }
  };

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={sharedStyles.cardImageWarning}>
        <StateIcons.ErrorENS height={144} width={144} />
      </View>
      <Spacing s={12} />
      <View style={sharedStyles.messageWrapper}>
        <Text style={text.defaultBold}>
          {t('closenessSensing:notEnabled:title')}
        </Text>
        <Spacing s={20} />
        <Text style={text.default}>
          {t('closenessSensing:notEnabled:text')}
        </Text>
        <Spacing s={24} />
        <View style={sharedStyles.buttonsWrapper}>
          <Button onPress={gotoAppSettings}>
            {t('closenessSensing:notEnabled:gotoSettings')}
          </Button>
        </View>
      </View>
    </Card>
  );
};
