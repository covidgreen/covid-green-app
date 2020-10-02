import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import * as SecureStore from 'expo-secure-store';

import {ScreenNames} from 'navigation';
import {register} from 'services/api';
import {useApplication, StorageKeys} from 'providers/context';
import {useFocusRef} from 'hooks/accessibility';

import {Button} from 'components/atoms/button';
import {Markdown} from 'components/atoms/markdown';
import {Spacing} from 'components/atoms/layout';
import {Scrollable} from 'components/templates/scrollable';
import {LearnHowItWorks} from 'components/views/tour/learn-how-it-works';

import {text, colors} from 'theme';
import {AppIcons, StateIcons} from 'assets/icons';

import {styles} from './styles';

enum RegistrationError {
  'INVALID' = 'Invalid verification',
  'TIMESTAMP' = 'Invalid timestamp'
}

export const Permissions: FC<any> = () => {
  const {t} = useTranslation();
  const nav = useNavigation();
  const app = useApplication();
  const exposure = useExposure();
  const [ref] = useFocusRef();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<{title: string; message: string}>({
    title: t('common:tryAgain:title'),
    message: t('common:tryAgain:description')
  });

  useEffect(() => {
    if (!exposure.supported && exposure.canSupport) {
      SecureStore.setItemAsync(StorageKeys.canSupportENS, 'true');
    }
  }, []);

  const handleRegistration = async (skip: boolean) => {
    try {
      app.showActivityIndicator();
      const analyticsOptIn = true;

      const {token, refreshToken} = await register();
      console.log(token, refreshToken);

      await SecureStore.setItemAsync(StorageKeys.token, token);
      await SecureStore.setItemAsync(
        StorageKeys.refreshToken,
        refreshToken,
        {}
      );
      await SecureStore.setItemAsync(StorageKeys.analytics, String(analyticsOptIn), {});

      await app.setContext({
        user: {
          new: true,
          valid: true
        },
        analyticsOptIn
      });

      app.hideActivityIndicator();

      if (skip) {
        nav.reset({
          index: 0,
          routes: [{name: 'main'}]
        });
      } else {
        return true;
      }
    } catch (err) {
      app.hideActivityIndicator();
      console.log('Error registering device: ', err, err.message);
      try {
        const response = err.text && JSON.parse(await err.text());
        if (response && RegistrationError.TIMESTAMP === response.message) {
          setAlertInfo({
            title: t('common:tryAgain:timestampTitle'),
            message: t('common:tryAgain:timestamp')
          });
        }
        setShowAlert(true);
        return false;
      } catch (e) {
        console.log('Error processing response');
        return false;
      }
    }
  };

  useEffect(() => {
    if (showAlert) {
      Alert.alert(alertInfo.title, alertInfo.message, [
        {
          text: t('common:ok:label'),
          style: 'default',
          onPress: (): void => setShowAlert(false)
        }
      ]);
    }
  }, [showAlert]);

  const handlePermissionsRequest = async () => {
    await exposure.askPermissions();
    const result = await handleRegistration(false);
    if (result) {
      nav.reset({
        index: 0,
        routes: [{name: ScreenNames.Completion}]
      });
    }
  };

  return (
    <Scrollable>
      <Spacing s={10} />
      <View>
        <Text
          ref={ref}
          accessible
          accessibilityRole="header"
          style={styles.title}
          maxFontSizeMultiplier={1.7}>
          {t('onboarding:permissions:title')}
        </Text>
        <Text style={styles.text}>{t('onboarding:permissions:line1')}</Text>
        <Spacing s={10} />
        <View style={styles.list}>
          <View style={styles.listIcon}>
            <StateIcons.AppENS
              width={32}
              height={32}
              color={colors.icons.gray}
            />
          </View>
          <View accessible style={styles.listContent}>
            <Markdown markdownStyles={MarkdownStyles}>
              {t('onboarding:permissions:track')}
            </Markdown>
          </View>
        </View>

        <View style={styles.list}>
          <View style={styles.listIcon}>
            <AppIcons.Notification
              width={32}
              height={24}
              color={colors.icons.gray}
            />
          </View>
          <View accessible style={styles.listContent}>
            <Markdown markdownStyles={MarkdownStyles}>
              {t('onboarding:permissions:notifications')}
            </Markdown>
          </View>
        </View>
        <View style={styles.statement}>
          <Text maxFontSizeMultiplier={1.7} style={styles.text}>
            {t('onboarding:permissions:statement')}
          </Text>
        </View>
        <Spacing s={30} />
      </View>

      <View>
        <Button onPress={handlePermissionsRequest}>
          {t('onboarding:permissions:continueAction')}
        </Button>
        <Spacing s={12} />
        <Button onPress={() => handleRegistration(true)} type="link">
          {t('onboarding:permissions:skipAction')}
        </Button>
        <Spacing s={12} />
        <LearnHowItWorks />
      </View>
      <Spacing s={30} />
    </Scrollable>
  );
};

const MarkdownStyles = StyleSheet.create({
  text: {
    ...text.default
  },
  strong: {
    ...text.defaultBold
  }
});
