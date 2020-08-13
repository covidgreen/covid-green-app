import React, {useState, useRef} from 'react';
import {Platform, ScrollView, Text, Linking, Alert} from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import {AppIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {colors, text} from 'theme';
import {KeyboardScrollable} from 'components/templates/keyboard-scrollable';
import {Markdown} from 'components/atoms/markdown';
import {Spacing, Separator} from 'components/atoms/layout';
import {Toast} from 'components/atoms/toast';
import {useAppState} from 'hooks/app-state';
import {useExposure, StatusState} from 'providers/exposure';
import {usePermissions} from 'providers/permissions';

export const ContactTracingSettings = () => {
  const {t} = useTranslation();
  const [appState] = useAppState();
  const isFocused = useIsFocused();
  const {readPermissions} = usePermissions();
  const {
    supported,
    status,
    enabled,
    supportsExposureApi,
    contacts,
    deleteExposureData,
    authoriseExposure
  } = useExposure();

  const [confirmedChanges, setConfirmedChanges] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const serviceStatus =
    status.state === StatusState.active && enabled ? 'active' : 'notActive';

  useFocusEffect(
    React.useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }

      readPermissions();
    }, [isFocused, appState, readPermissions])
  );

  const gotoSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:');
      } else {
        console.log('tracing supported:', supported);
        if (supported) {
          if (enabled) {
            await IntentLauncher.startActivityAsync(
              'com.google.android.gms.settings.EXPOSURE_NOTIFICATION_SETTINGS'
            );
          } else {
            await authoriseExposure();
          }
        } else {
          await IntentLauncher.startActivityAsync(
            IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
            {data: 'package:io.lfph.covidgreen'}
          );
        }
        await supportsExposureApi();
      }
    } catch (e) {
      console.log("Error opening app's settings", e);
    }
  };

  const clearDataHandler = async () => {
    Alert.alert(
      t('contactTracing:settings:clearData:confirmTitle'),
      t('contactTracing:settings:clearData:confirmText'),
      [
        {
          text: t('contactTracing:settings:clearData:cancel'),
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: t('contactTracing:settings:clearData:confirm'),
          onPress: async () => {
            try {
              await deleteExposureData();
            } catch (e) {
              console.log('Error deleting exposure data', e);
              Alert.alert(
                'Error',
                t('contactTracing:settings:clearData:error')
              );
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const successToast = confirmedChanges && (
    <Toast
      color="rgba(0, 207, 104, 0.16)"
      message={t('common:changesUpdated')}
      type="success"
      icon={<AppIcons.Success width={24} height={24} color={colors.success} />}
    />
  );

  return (
    <KeyboardScrollable
      toast={successToast}
      heading={t('contactTracing:title')}
      scrollViewRef={scrollViewRef}>
      <Text style={text.defaultBold}>
        {t('contactTracing:settings:status:title')}
      </Text>
      <Spacing s={12} />
      <Text style={text.largeBold}>
        {t(`contactTracing:settings:status:${serviceStatus}`)}
      </Text>
      <Spacing s={12} />
      <Text style={text.default}>
        {Platform.OS === 'ios' || enabled
          ? t('contactTracing:settings:status:intro')
          : t('contactTracing:settings:status:android:intro')}
      </Text>
      <Spacing s={12} />
      <Button type="empty" onPress={gotoSettings}>
        {Platform.OS === 'ios' || enabled
          ? t('contactTracing:settings:status:gotoSettings')
          : t('contactTracing:settings:status:android:gotoSettings')}
      </Button>

      {contacts && contacts.length > 0 && (
        <>
          <Separator />
          <Text style={text.defaultBold}>
            {t('contactTracing:settings:clearData:title')}
          </Text>
          <Spacing s={12} />
          <Markdown>{t('contactTracing:settings:clearData:intro')}</Markdown>
          <Spacing s={12} />
          <Button type="danger" onPress={clearDataHandler}>
            {t('contactTracing:settings:clearData:button')}
          </Button>
        </>
      )}
    </KeyboardScrollable>
  );
};
