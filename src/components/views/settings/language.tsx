import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';

import {Scrollable} from 'components/templates/scrollable';
import {supportedLocales, fallback} from 'services/i18n/common';
import {Markdown} from 'components/atoms/markdown';
import {SelectList} from 'components/atoms/select-list';
import {Spacing} from 'components/atoms/layout';
import {StorageKeys} from 'providers/context';

interface LanguageType {
  value: string;
  label: string;
}

export const Language = () => {
  const {t, i18n} = useTranslation();

  const languages: LanguageType[] = Object.entries(supportedLocales).map(
    ([langCode, langData]) => ({
      value: langCode,
      label: langData.name
    })
  );
  const currentLanguage =
    languages.find(({value}) => value === i18n.language) ||
    languages.find(({value}) => value === fallback);

  return (
    <Scrollable heading={t('languageSettings:title')}>
      <View accessibilityElementsHidden>
        <Markdown>{t('languageSettings:intro')}</Markdown>
      </View>
      <Spacing s={20} />
      <SelectList
        title={t('languageSettings:intro')}
        items={languages}
        selectedValue={currentLanguage!.value}
        onItemSelected={(lang) => {
          AsyncStorage.setItem(StorageKeys.language, lang);
          i18n.changeLanguage(lang);
        }}
      />
    </Scrollable>
  );
};
