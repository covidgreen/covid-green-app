import React, {FC} from 'react';
import {View, Text, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

interface NotActiveIOSProps {
  onboarding?: boolean;
  exposureOff?: boolean;
  bluetoothOff?: boolean;
}

export const NotActiveIOS: FC<NotActiveIOSProps> = ({
  onboarding = false,
  exposureOff = false,
  bluetoothOff = false
}) => {
  const {t} = useTranslation();
  const nav = useNavigation();

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
          <Text style={text.defaultBold}>
            {t('closenessSensing:notActiveIOS:title')}
          </Text>
          <Spacing s={20} />
          <Text style={text.default}>
            {t(
              `closenessSensing:notActiveIOS:${
                exposureOff ? 'ens' : bluetoothOff ? 'bt' : 'text'
              }`
            )}
          </Text>
          <Spacing s={24} />
          <View style={sharedStyles.buttonsWrapper}>
            <Button
              onPress={() =>
                Linking.openURL(exposureOff ? 'app-settings:' : 'App-Prefs:')
              }>
              {t('closenessSensing:notActiveIOS:gotoSettings')}
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
            {t('closenessSensing:notActiveIOS:continue')}
          </Button>
        </>
      )}
    </>
  );
};
