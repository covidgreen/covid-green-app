import React, {FC} from 'react';
import {View, Text, Platform, Linking} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

export const Supported: FC = () => {
  const {t} = useTranslation();
  const exposure = useExposure();

  const checkForUpgradeHandler = async () => {
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:');
      } else {
        await exposure.triggerUpdate();
        await exposure.supportsExposureApi();
      }
    } catch (err) {
      console.log('Error handling check for upgrade', err);
    }
  };

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={sharedStyles.cardImageWarning}>
        <StateIcons.ErrorUpgrade height={144} width={144} />
      </View>
      <Spacing s={12} />
      <View style={sharedStyles.messageWrapper}>
        <Text style={text.defaultBold}>
          {t(`closenessSensing:supported:title:${Platform.OS}`)}
        </Text>
        <Spacing s={20} />
        <Text style={text.default}>
          {t(`closenessSensing:supported:text:${Platform.OS}`)}
        </Text>
        <Spacing s={24} />
        <View style={sharedStyles.buttonsWrapper}>
          <Button onPress={checkForUpgradeHandler}>
            {t('closenessSensing:supported:checkForUpgrade')}
          </Button>
        </View>
      </View>
    </Card>
  );
};
