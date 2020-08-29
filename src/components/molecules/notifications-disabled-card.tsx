import React, {FC} from 'react';
import {View, Text, Platform, StyleSheet, Linking} from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

export const NotificationsDisabledCard: FC<{onboarding?: boolean}> = ({
  onboarding = false
}) => {
  const {t} = useTranslation();
  const nav = useNavigation();

  const gotoSettings = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else if (Platform.OS === 'android') {
      try {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
          {data: 'package:gov.ny.health.proximity'}
        );
      } catch (e) {
        console.log('Ther was an error opening app settings', e);
      }
    }
  };

  return (
    <>
      <Card padding={{h: 0, v: 0}}>
        <View style={styles.cardImage}>
          <StateIcons.ErrorENS height={144} width={144} />
        </View>
        <Spacing s={12} />
        <View style={styles.messageWrapper}>
          <Text style={text.defaultBold}>
            {t('notificationsDisabled:title')}
          </Text>
          <Spacing s={20} />
          <Text style={text.default}>{t('notificationsDisabled:text')}</Text>
          <Spacing s={24} />
          <View style={styles.buttonsWrapper}>
            <Button onPress={gotoSettings}>
              {t('notificationsDisabled:gotoSettings')}
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
            {t('common:continue')}
          </Button>
        </>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  messageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20
  },
  cardImage: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#ecdbe4'
  },
  buttonsWrapper: {
    width: '100%'
  }
});
