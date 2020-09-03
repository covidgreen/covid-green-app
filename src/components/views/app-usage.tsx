import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import * as SecureStore from 'expo-secure-store';

import {DataProtectionLink} from './data-protection-policy';

import {Button} from 'components/atoms/button';
import {Link} from 'components/atoms/link';
import {Markdown} from 'components/atoms/markdown';
import {Quote} from 'components/molecules/quote';
import {Spacing} from 'components/atoms/spacing';
import {Scrollable} from 'components/templates/scrollable';
import {StorageKeys} from 'providers/context';

interface AppUsageProps {
  navigation: any;
}

export const AppUsage: FC<AppUsageProps> = ({navigation}) => {
  const {t} = useTranslation();

  const handleNext = async (consent: boolean) => {
    try {
      SecureStore.setItemAsync(StorageKeys.analytics, String(consent), {});
    } catch (e) {
      console.log(`Error storing "${StorageKeys.analytics}" securely`, e);
    }

    navigation.navigate('contactTracingInformation');
  };

  return (
    <Scrollable heading={t('appUsage:title')}>
      <Markdown markdownStyles={{block: {marginBottom: 16}}}>
        {t('appUsage:info')}
      </Markdown>
      <Spacing s={24} />
      <DataProtectionLink />
      <Spacing s={48} />
      <Quote text={t('appUsage:settingsInfo')} />
      <Spacing s={24} />
      <Button onPress={() => handleNext(true)}>
        {t('appUsage:yesButton')}
      </Button>
      <Spacing s={24} />
      <Link align="center" onPress={() => handleNext(false)}>
        {t('appUsage:noThanks')}
      </Link>
    </Scrollable>
  );
};
