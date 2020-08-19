import React, {FC} from 'react';
import {Platform, Text, Linking, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {StateIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {text} from 'theme';
import {Spacing} from 'components/atoms/layout';
import {useExposure} from 'react-native-exposure-notification-service';
import {styles} from '../get-started';
import {styles as cardStyles} from './active';

export const CanSupport: FC = () => {
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
      <View style={[cardStyles.cardImage, {backgroundColor: '#ecdbe4'}]}>
        <StateIcons.ErrorENS height={144} width={144} />
      </View>
      <Spacing s={4} />
      <View style={styles.row}>
        <View style={cardStyles.messageWrapper}>
          <Text style={text.defaultBold}>
            {t('contactTracing:canSupport:title')}
          </Text>
          <Spacing s={8} />
          <Text style={text.default}>
            {t(`contactTracing:canSupport:message:${Platform.OS}`)}
          </Text>
          <Spacing s={12} />
          <Button onPress={checkForUpgradeHandler} style={cardStyles.button}>
            {t('contactTracing:canSupport:button')}
          </Button>
        </View>
      </View>
    </Card>
  );
};
