import en from 'assets/lang/en.json';
import zh from 'assets/lang/zh.json';
import ru from 'assets/lang/ru.json';
import ht from 'assets/lang/ru.json';
import bn from 'assets/lang/ru.json';
import ko from 'assets/lang/ru.json';

export const fallback = 'en';
export const defaultNamespace = 'common';
export const namespaces = ['common'];

export const supportedLocales = {
  en: {
    name: 'English',
    ...en
  },
  ru: {
    name: 'Russian',
    ...ru
  },
  zh: {
    name: 'Chinese',
    ...zh
  },
  ht: {
    name: 'Haitian Creole',
    ...ht
  },
  bn: {
    name: 'Bengali',
    ...bn
  },
  ko: {
    name: 'Korean',
    ...ko
  }
};
