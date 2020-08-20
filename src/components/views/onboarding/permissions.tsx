import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import * as SecureStore from 'expo-secure-store';

import {text, colors} from 'theme';

import {Scrollable} from 'components/templates/scrollable';
import {Button} from 'components/atoms/button';
import {Spacing} from 'components/atoms/spacing';
import {Markdown} from 'components/atoms/markdown';
import {AppIcons, TabBarIcons} from 'assets/icons';
import {ScreenNames} from 'navigation';
import {useApplication} from 'providers/context';
import {register} from 'services/api';

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

  useEffect(() => {
    if (!exposure.supported && exposure.canSupport) {
      SecureStore.setItemAsync('supportPossible', 'true');
    }
  }, []);

  const list: string[] = t('onboarding:permissions:list', {
    returnObjects: true
  });

  const handleRegistration = async (skip: boolean) => {
    try {
      app.showActivityIndicator();

      await app.clearContext();
      const {token, refreshToken} = await register();
      console.log(token, refreshToken);

      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken, {});

      await app.setContext({
        user: {
          new: true,
          valid: true
        }
      });

      app.hideActivityIndicator();

      if (skip) {
        nav.reset({
          index: 0,
          routes: [{name: ScreenNames.Dashboard}]
        });
      } else {
        return true;
      }
    } catch (err) {
      app.hideActivityIndicator();
      console.log('Error registering device: ', err, err.message);
      let title = t('common:tryAgain:title');
      let message = t('common:tryAgain:description');
      try {
        const response = err.text && JSON.parse(await err.text());
        if (response && RegistrationError.TIMESTAMP === response.message) {
          title = t('common:tryAgain:timestampTitle');
          message = t('common:tryAgain:timestamp');
        }
        Alert.alert(title, message, [
          {
            text: t('common:ok:label'),
            style: 'default',
            onPress: () => {}
          }
        ]);
        return false;
      } catch (e) {
        console.log('Error processing response');
        return false;
      }
    }
  };

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
        <Text style={styles.title}>{t('onboarding:permissions:title')}</Text>
        <Text style={styles.text}>{t('onboarding:permissions:line1')}</Text>

        <View style={styles.list}>
          <View style={styles.listIcon}>
            <TabBarIcons.ContactTracing.On
              width={32}
              height={32}
              color={colors.icons.gray}
            />
          </View>
          <View style={styles.listContent}>
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
          <View style={styles.listContent}>
            <Markdown markdownStyles={MarkdownStyles}>
              {t('onboarding:permissions:notifications')}
            </Markdown>
          </View>
        </View>
        <View style={styles.statement}>
          <Text style={styles.text}>
            {t('onboarding:permissions:statement')}
          </Text>
        </View>
        <Spacing s={30} />
      </View>

      <View>
        <Button onPress={() => nav.navigate(ScreenNames.Tour)} type="secondary">
          {t('onboarding:permissions:learnAction')}
        </Button>
        <Spacing s={12} />
        <Button onPress={() => handleRegistration(true)} type="secondary">
          {t('onboarding:permissions:skipAction')}
        </Button>
        <Spacing s={12} />
        <Button onPress={handlePermissionsRequest}>
          {t('onboarding:permissions:continueAction')}
        </Button>
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
