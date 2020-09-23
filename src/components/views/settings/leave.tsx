import React from 'react';
import {Alert, View, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import * as Haptics from 'expo-haptics';

import {Button} from 'components/atoms/button';
import {DataProtectionLink} from 'components/views/data-protection-policy';
import {forget, networkError} from 'services/api';
import {Markdown} from 'components/atoms/markdown';
import {Spacing} from 'components/atoms/spacing';
import {useApplication} from 'providers/context';
import {useExposure} from 'react-native-exposure-notification-service';
import {PinnedBottom} from 'components/templates/pinned';
import {ScreenNames} from 'navigation';

export const Leave = ({navigation}) => {
  const {t} = useTranslation();
  const app = useApplication();
  const exposure = useExposure();
  const confirmed = async () => {
    app.showActivityIndicator();
    try {
      try {
        await exposure.deleteAllData();
        exposure.stop();
      } catch (err) {
        console.log(err);
      }
      await forget();
      await app.clearContext();

      app.hideActivityIndicator();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      navigation.reset({
        index: 0,
        routes: [{name: ScreenNames.AgeCheck}]
      });
    } catch (e) {
      app.hideActivityIndicator();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Error',
        e.message === networkError ? t('common:networkError') : t('leave:error')
      );
    }
  };

  const confirm = () => {
    Alert.alert(t('leave:confirmTitle'), t('leave:confirmText'), [
      {
        text: t('leave:cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: t('leave:confirm'),
        onPress: () => confirmed(),
        style: 'destructive'
      }
    ]);
  };

  return (
    <PinnedBottom heading={t('leave:title')}>
      <View>
        <Markdown style={{}}>{t('leave:info')}</Markdown>
        <Spacing s={32} />
        <DataProtectionLink />
        <Spacing s={32} />
        <Markdown style={{}}>{t(`leave:summary.${Platform.OS}`)}</Markdown>
        <Spacing s={32} />
      </View>
      <Button type="danger" onPress={confirm}>
        {t('leave:button')}
      </Button>
    </PinnedBottom>
  );
};
