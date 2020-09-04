import {bn, enUS, es, ko, ru, zhCN} from 'date-fns/locale';

const fallback = enUS;
export const dateFnsLocales = {
  bn,
  en: enUS,
  es,
  ko,
  ru,
  zh: zhCN,
  ht: fallback
} as Record<string, any>;

interface I18n {
  language: string;
}

export const getDateLocaleOptions = (i18n: I18n) => {
  const locale = dateFnsLocales[i18n.language] || fallback;
  return {locale};
};
