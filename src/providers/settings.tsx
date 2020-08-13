import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import i18n, {TFunction} from 'i18next';
import {useTranslation} from 'react-i18next';
import {isObject} from 'formik';

import * as api from 'services/api';
import {fallback} from 'services/i18n/common';

export interface BasicItem {
  label: string;
  value: any;
}

export interface AppConfig {
  checkInMaxAge: number;
  callBackResetHrs: number;
}

export interface TraceConfiguration {
  exposureCheckInterval: number;
  storeExposuresFor: number;
  fileLimit: number;
  fileLimitiOS: number;
}

interface AgeOption extends BasicItem {
  riskGroup?: boolean;
}

interface CheckerThankYouText {
  noSymptomsWell?: string;
  noSymptomsNotWell?: string;
  riskGroup?: string;
  recovered?: string;
  virusIsolation?: string;
}

interface SettingsContextValue {
  loaded: boolean;
  appConfig: AppConfig;
  traceConfiguration: TraceConfiguration;
  user: string | null;
  consent: string | null;
  sexOptions: BasicItem[];
  ageRangeOptions: AgeOption[];
  dpinText: string;
  tandcText: string;
  checkerThankYouText: CheckerThankYouText;
}

const defaultValue: SettingsContextValue = {
  loaded: false,
  user: null,
  consent: null,
  appConfig: {
    checkInMaxAge: 28,
    callBackResetHrs: 72 // hours
  },
  traceConfiguration: {
    exposureCheckInterval: 120,
    storeExposuresFor: 14, // days
    fileLimit: 1,
    fileLimitiOS: 2
  },
  sexOptions: [],
  ageRangeOptions: [],
  dpinText: '',
  tandcText: '',
  checkerThankYouText: {}
};

const getDbText = (apiSettings: any, key: string): any => {
  const data =
    (apiSettings[key] &&
      (apiSettings[key][i18n.language] || apiSettings[key][fallback])) ||
    '';

  if (isObject(data)) {
    const item: any = {};
    Object.keys(data).forEach((k: string) => {
      item[k] = data[k]
        .replace(/\\n/g, '\n')
        .replace(/(^|[^\n])\n(?!\n)/g, '$1\n\n');
    });
    return item;
  } else {
    return data.replace(/\\n/g, '\n').replace(/(^|[^\n])\n(?!\n)/g, '$1\n\n');
  }
};

export const SettingsContext = createContext<SettingsContextValue>(
  defaultValue
);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = ({children}) => {
  const {t} = useTranslation();
  const [state, setState] = useState<SettingsContextValue>(defaultValue);

  useEffect(() => {
    const loadSettingsAsync = async () => {
      const [user, consent] = await AsyncStorage.multiGet([
        'covidApp.user',
        'covidApp.checkInConsent'
      ]);

      let apiSettings: Record<any, string>;
      try {
        apiSettings = await api.loadSettings();
      } catch (e) {
        console.log('Error loading settings: ', e);
        apiSettings = {};
      }

      const appConfig: AppConfig = {...defaultValue.appConfig};
      if (apiSettings.checkInMaxAge) {
        appConfig.checkInMaxAge = Number(apiSettings.checkInMaxAge);
      }
      if (apiSettings.callBackResetHrs) {
        appConfig.callBackResetHrs = Number(apiSettings.callBackResetHrs);
      }

      const tc: TraceConfiguration = {
        ...defaultValue.traceConfiguration
      };
      if (apiSettings.exposureCheckInterval) {
        tc.exposureCheckInterval = Number(apiSettings.exposureCheckInterval);
      }
      if (apiSettings.storeExposuresFor) {
        tc.storeExposuresFor = Number(apiSettings.storeExposuresFor);
      }
      if (apiSettings.fileLimit) {
        tc.fileLimit = Number(apiSettings.fileLimit);
      }
      if (apiSettings.fileLimitiOS) {
        tc.fileLimitiOS = Number(apiSettings.fileLimitiOS);
      }

      const dpinText =
        getDbText(apiSettings, 'dpinText') || t('dataProtectionPolicy:text');

      const tandcText =
        getDbText(apiSettings, 'tandcText') || t('tandcPolicy:text');

      const checkerThankYouText: CheckerThankYouText = Object.assign(
        {
          noSymptomsWell: t('checker:noSymptomsWell:message'),
          noSymptomsNotWell: t('checker:noSymptomsNotWell:message'),
          riskGroup: t('checker:riskGroup:warning'),
          recovered: t('checker:recovered'),
          virusIsolation: t('checker:virusIsolation')
        },
        getDbText(apiSettings, 'checkerThankYouText')
      );

      setState({
        loaded: true,
        user: user[1],
        consent: consent[1],
        appConfig,
        traceConfiguration: tc,
        sexOptions: getSexOptions(t),
        ageRangeOptions: getAgeRangeOptions(t),
        dpinText,
        tandcText,
        checkerThankYouText
      });
    };

    try {
      loadSettingsAsync();
    } catch (err) {
      console.log(err, 'Error loading settings');
      setState({...state, loaded: true});
    }
  }, []);

  return (
    <SettingsContext.Provider value={state}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

function getSexOptions(t: TFunction) {
  return [
    {label: t('sex:female'), value: 'f'},
    {label: t('sex:male'), value: 'm'},
    {label: t('common:preferNotToSay'), value: 'u'}
  ];
}

function getAgeRangeOptions(t: TFunction) {
  return [
    {label: t('common:preferNotToSay'), value: 'u'},
    {label: '16-39', value: '16-39'},
    {label: '40-59', value: '40-59'},
    {label: '60+', value: '60+', riskGroup: true}
  ];
}
