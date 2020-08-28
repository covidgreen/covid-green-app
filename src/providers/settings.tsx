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
import {counties} from 'assets/counties';

export interface BasicItem {
  label: string;
  value: any;
  freeText?: boolean;
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
  noSymptomsFeelingWell?: string;
  noSymptomsNotFeelingWell?: string;
  riskGroup?: string;
  coronavirus?: string;
}

interface SettingsContextValue {
  loaded: boolean;
  appConfig: AppConfig;
  traceConfiguration: TraceConfiguration;
  user: string | null;
  consent: string | null;
  genderOptions: BasicItem[];
  raceOptions: BasicItem[];
  ethnicityOptions: BasicItem[];
  ageRangeOptions: AgeOption[];
  countiesOptions: BasicItem[];
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
  genderOptions: [],
  raceOptions: [],
  ethnicityOptions: [],
  ageRangeOptions: [],
  countiesOptions: [],
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
          noSymptomsFeelingWell: t('checker:results:noSymptomsFeelingWell'),
          noSymptomsNotFeelingWell: t(
            'checker:results:noSymptomsNotFeelingWell'
          ),
          coronavirus: t('checker:results:coronavirus')
        },
        getDbText(apiSettings, 'checkerThankYouText')
      );

      setState({
        loaded: true,
        user: user[1],
        consent: consent[1],
        appConfig,
        traceConfiguration: tc,
        genderOptions: getGenderOptions(t),
        raceOptions: getRaceOptions(t),
        ethnicityOptions: getEthnicityOptions(t),
        ageRangeOptions: getAgeRangeOptions(t),
        countiesOptions: getCountiesOptions(t),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SettingsContext.Provider value={state}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

function getGenderOptions(t: TFunction): BasicItem[] {
  return [
    {label: t('gender:female'), value: 'f'},
    {label: t('gender:male'), value: 'm'},
    {label: t('gender:nonBinary'), value: 'nb'},
    {label: t('gender:other'), value: 'other'},
    {label: t('common:preferNotToSay'), value: 'u'}
  ];
}

function getRaceOptions(t: TFunction): BasicItem[] {
  return [
    {label: t('race:american'), value: 'american'},
    {label: t('race:asian'), value: 'asian'},
    {label: t('race:black'), value: 'black'},
    {label: t('race:hawaiian'), value: 'hawaiian'},
    {label: t('race:white'), value: 'white'},
    {label: t('race:other'), value: 'unknown'},
    {label: t('common:preferNotToSay'), value: 'u'}
  ];
}

function getEthnicityOptions(t: TFunction): BasicItem[] {
  return [
    {label: t('ethnicity:hispanic'), value: 'hispanic'},
    {label: t('ethnicity:not_hispanic'), value: 'not_hispanic'},
    {label: t('common:preferNotToSay'), value: 'u'}
  ];
}

function getAgeRangeOptions(t: TFunction): AgeOption[] {
  return [
    {label: '0-17', value: '0-17'},
    {label: '18-34', value: '18-34'},
    {label: '35-49', value: '35-49'},
    {label: '50-69', value: '50-69', riskGroup: true},
    {label: '70-79', value: '70-79', riskGroup: true},
    {label: '80+', value: '80+', riskGroup: true},
    {label: t('common:preferNotToSay'), value: 'u'}
  ];
}

function getCountiesOptions(t: TFunction): BasicItem[] {
  return [
    {label: t('county:notinny'), value: 'u'},
    ...counties.map((c) => ({label: c.county, value: c.code}))
  ];
}
