import en from 'assets/lang/en.json';
import zh from 'assets/lang/zh.json';
import ru from 'assets/lang/ru.json';
import ht from 'assets/lang/ht.json';
import bn from 'assets/lang/bn.json';
import ko from 'assets/lang/ko.json';
import es from 'assets/lang/es.json';

export const fallback = 'en';
export const defaultNamespace = 'common';
export const namespaces = ['common'];

export const supportedLocales = {
  en: {
    name: 'English',
    ...en
  },
  ru: {
    name: 'русский',
    ...ru
  },
  zh: {
    name: '中文',
    ...zh
  },
  ht: {
    name: 'Kreyòl ayisyen',
    ...ht
  },
  bn: {
    name: 'বাংলা',
    ...bn
  },
  ko: {
    name: '한국어',
    ...ko
  },
  es: {
    name: 'Español',
    ...es
  }
};
