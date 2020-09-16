import React, {FC} from 'react';
import {Platform, Text, Linking, Alert} from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import {
  useExposure,
  StatusState,
  AuthorisedStatus
} from 'react-native-exposure-notification-service';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Markdown} from 'components/atoms/markdown';
import {Spacing, Separator} from 'components/atoms/layout';
import {KeyboardScrollable} from 'components/templates/keyboard-scrollable';

import {colors, text} from 'theme';

export const ContactTracingSettings: FC = () => {
  const {t} = useTranslation();
  const {
    canSupport,
    supported,
    isAuthorised,
    status,
    enabled,
    initialised,
    contacts,
    deleteExposureData,
    askPermissions
  } = useExposure();

  const gotoSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:');
      } else if (Platform.OS === 'android') {
        await IntentLauncher.startActivityAsync(
          'com.google.android.gms.settings.EXPOSURE_NOTIFICATION_SETTINGS'
        );
      }
    } catch (e) {
      console.log("Error opening app's settings", e);
    }
  };

  const clearDataHandler = async () => {
    Alert.alert(
      t('settings:clearData:confirmTitle'),
      t('settings:clearData:confirmText'),
      [
        {
          text: t('settings:clearData:cancel'),
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: t('settings:clearData:confirm'),
          onPress: async () => {
            try {
              await deleteExposureData();
            } catch (e) {
              console.log('Error deleting exposure data', e);
              Alert.alert('Error', t('settings:clearData:error'));
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const isServiceActive = status.state === StatusState.active && enabled;
  const ensNotAuthorised =
    !isServiceActive &&
    (Platform.OS === 'android' || isAuthorised === AuthorisedStatus.unknown);

  return (
    <KeyboardScrollable
      heading={t('myCovidAlerts:title')}
      backgroundColor={colors.background}>
      <Text style={text.defaultBold}>{t('settings:status:title')}</Text>
      <Spacing s={12} />
      {initialised && (
        <Text style={text.largeBold}>
          {t(`settings:status:${isServiceActive ? 'active' : 'notActive'}`)}
        </Text>
      )}
      {canSupport && supported && (
        <>
          <Spacing s={24} />
          <Text style={text.default}>
            {ensNotAuthorised
              ? t(`closenessSensing:notAuthorised:${Platform.OS}:text`)
              : t('settings:status:intro')}
          </Text>
          <Spacing s={12} />
          <Button
            type="empty"
            onPress={
              ensNotAuthorised
                ? async () => await askPermissions()
                : gotoSettings
            }>
            {ensNotAuthorised
              ? t(`closenessSensing:notAuthorised:${Platform.OS}:setup`)
              : t('settings:status:gotoSettings')}
          </Button>
        </>
      )}

      {contacts && contacts.length > 0 && (
        <>
          <Separator />
          <Text style={text.defaultBold}>{t('settings:clearData:title')}</Text>
          <Spacing s={30} />
          <Markdown style={{background: colors.white}}>
            {t('settings:clearData:intro')}
          </Markdown>
          <Spacing s={30} />
          <Button type="danger" onPress={clearDataHandler}>
            {t('settings:clearData:button')}
          </Button>
        </>
      )}
    </KeyboardScrollable>
  );
};
