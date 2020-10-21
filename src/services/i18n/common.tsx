import {I18nManager} from 'react-native';
import {TOptionsBase} from 'i18next';

import en from 'assets/lang/en.json';
import zh from 'assets/lang/zh.json';
import ru from 'assets/lang/ru.json';
import ht from 'assets/lang/ht.json';
import bn from 'assets/lang/bn.json';
import ko from 'assets/lang/ko.json';
import es from 'assets/lang/es.json';
import yi from 'assets/lang/yi.json';

export const fallback = 'en';
export const defaultNamespace = 'common';
export const namespaces = ['common'];

const rtlMarkerChar = '‏';
const ltrMarkerChar = '‎';
const directionChar = I18nManager.isRTL ? rtlMarkerChar : ltrMarkerChar;

export const supportedLocales = Object.entries({
  bn: {
    name: 'বাংলা (Bengali)',
    ...bn
  },
  zh: {
    name: '中文 (Chinese)',
    ...zh
  },
  en: {
    name: 'English',
    ...en
  },
  ht: {
    name: 'Kreyòl ayisyen (Haitian Creole)',
    ...ht
  },
  ko: {
    name: '한국어 (Korean)',
    ...ko
  },
  ru: {
    name: 'русский (Russian)',
    ...ru
  },
  es: {
    name: 'Español (Spanish)',
    ...es
  },
  yi: {
    name: 'אידיש (Yiddish)',
    ...yi
  }
}).reduce(
  // Add listName forced to line up as LTR in LTR langs and RTL in RTL langs
  (locales, [langCode, {name, ...translations}]) => ({
    ...locales,
    [langCode]: {
      name,
      listName: `${directionChar}${name}${directionChar}`,
      ...translations
    }
  }),
  {}
);

// i18next is missing pluralisation rules for these and incorrectly treats all counts as singular
const langsMissingPluralRules = ['yi', 'ht'];

export const pluralize = (count: number, langCode: string): TOptionsBase => {
  const options = {count} as TOptionsBase;
  if (langsMissingPluralRules.includes(langCode) && count !== 1) {
    options.context = 'plural';
  }
  return options;
};
