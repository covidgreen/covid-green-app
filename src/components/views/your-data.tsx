import React, {FC, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import {useTranslation} from 'react-i18next';

import {DataProtectionLink} from './data-protection-policy';

import {useApplication, StorageKeys} from 'providers/context';
import {register} from 'services/api';
import {Spacing} from 'components/atoms/layout';
import {Markdown} from 'components/atoms/markdown';
import {Button} from 'components/atoms/button';
import {Quote} from 'components/molecules/quote';
import {Toast} from 'components/atoms/toast';
import {Scrollable} from 'components/templates/scrollable';
import {AppIcons} from 'assets/icons';

interface YourDataProps {
  navigation: StackNavigationProp<any>;
}

export const YourData: FC<YourDataProps> = ({navigation}) => {
  const {t} = useTranslation();
  const app = useApplication();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const onContinue = async () => {
    try {
      app.showActivityIndicator();
      await app.clearContext();
      const {token, refreshToken} = await register();

      await SecureStore.setItemAsync(StorageKeys.token, token);
      await SecureStore.setItemAsync(
        StorageKeys.refreshToken,
        refreshToken,
        {}
      );

      await app.setContext({
        user: {
          new: true,
          valid: true
        }
      });

      app.hideActivityIndicator();
      navigation.reset({
        index: 0,
        routes: [{name: 'appUsage'}]
      });
    } catch (err) {
      app.hideActivityIndicator();
      console.log('Error registering device: ', err, typeof err, err.message);
      setRegisterError(t('common:networkError'));
    }
  };

  const errorToast = !!registerError && (
    <Toast
      type="error"
      icon={<AppIcons.Alert width={24} height={24} />}
      message={registerError}
    />
  );

  return (
    <Scrollable toast={errorToast} heading={t('yourData:title')}>
      <Markdown markdownStyles={{block: {marginBottom: 16}}}>
        {t('yourData:info')}
      </Markdown>
      <Spacing s={8} />
      <DataProtectionLink />
      <Spacing s={12} />
      <Quote text={t('yourData:viewInSettings')} />
      <Spacing s={36} />
      <Button onPress={onContinue}>{t('yourData:continue')}</Button>
    </Scrollable>
  );
};
