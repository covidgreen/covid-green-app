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
  riskGroupMinAge: number;
  hsePhoneNumber: string;
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
  exposedTodo: string;
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
    riskGroupMinAge: 60,
    hsePhoneNumber: 'XXXX-XXXXXX'
  },
  traceConfiguration: {
    exposureCheckInterval: 120,
    storeExposuresFor: 14,
    fileLimit: 1,
    fileLimitiOS: 2
  },
  genderOptions: [],
  raceOptions: [],
  ethnicityOptions: [],
  ageRangeOptions: [],
  countiesOptions: [],
  exposedTodo: '',
  dpinText: '',
  tandcText: '',
  checkerThankYouText: {}
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
        'cti.user',
        'cti.checkInConsent'
      ]);

      let apiSettings;
      try {
        apiSettings = await api.loadSettings();
      } catch (e) {
        console.log('Error loading settings: ', e);
        apiSettings = {};
      }

      const appConfig = Object.assign({}, defaultValue.appConfig, {
        checkInMaxAge: Number(apiSettings.checkInMaxAge),
        riskGroupMinAge: Number(apiSettings.riskGroupMinAge),
        hsePhoneNumber: apiSettings.hsePhoneNumber
      });

      const traceConfiguration = Object.assign(
        {},
        defaultValue.traceConfiguration,
        {
          exposureCheckInterval: Number(apiSettings.exposureCheckInterval),
          storeExposuresFor: Number(apiSettings.storeExposuresFor),
          fileLimit: Number(apiSettings.fileLimit),
          fileLimitiOS: Number(apiSettings.fileLimitiOS)
        }
      );
      const getDbText = (apiSettings: any, key: string): any => {
        let data =
          (apiSettings[key] &&
            (apiSettings[key][i18n.language] || apiSettings[key][fallback])) ||
          '';

        if (isObject(data)) {
          const item: any = {};
          Object.keys(data).forEach((key: string) => {
            item[key] = data[key]
              .replace(/\\n/g, '\n')
              .replace(/(^|[^\n])\n(?!\n)/g, '$1\n\n');
          });
          return item;
        } else {
          return data
            .replace(/\\n/g, '\n')
            .replace(/(^|[^\n])\n(?!\n)/g, '$1\n\n');
        }
      };

      const exposedTodo =
        getDbText(apiSettings, 'exposedTodoList') ||
        t('closeContact:todo:list');

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
          riskGroup: t('checker:results:riskGroup'),
          coronavirus: t('checker:results:coronavirus')
        },
        getDbText(apiSettings, 'checkerThankYouText')
      );

      setState({
        loaded: true,
        user: user[1],
        consent: consent[1],
        appConfig,
        traceConfiguration,
        genderOptions: getGenderOptions(t),
        raceOptions: getRaceOptions(t),
        ethnicityOptions: getEthnicityOptions(t),
        ageRangeOptions: getAgeRangeOptions(t),
        countiesOptions: getCountiesOptions(t),
        exposedTodo,
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
    {label: t('common:preferNotToSay'), value: 'u'},
    {label: t('gender:male'), value: 'm'},
    {label: t('gender:female'), value: 'f'},
    {label: t('gender:nonBinary'), value: 'nb'},
    {label: t('gender:other'), value: 'other'}
  ];
}

function getRaceOptions(t: TFunction): BasicItem[] {
  return [
    {label: t('common:preferNotToSay'), value: 'u'},
    {label: t('race:white'), value: 'white'},
    {label: t('race:black'), value: 'black'},
    {label: t('race:american'), value: 'american'},
    {label: t('race:asian'), value: 'asian'},
    {label: t('race:hawaiian'), value: 'hawaiian'},
    {label: t('race:other'), value: 'unknown'}
  ];
}

function getEthnicityOptions(t: TFunction): BasicItem[] {
  return [
    {label: t('common:preferNotToSay'), value: 'u'},
    {label: t('ethnicity:hispanic'), value: 'hispanic'},
    {label: t('ethnicity:not_hispanic'), value: 'not_hispanic'}
  ];
}

function getAgeRangeOptions(t: TFunction): AgeOption[] {
  return [
    {label: t('common:preferNotToSay'), value: 'u'},
    {label: '0-17', value: '0-17'},
    {label: '18-34', value: '18-34'},
    {label: '35-49', value: '35-49'},
    {label: '50-69', value: '50-69', riskGroup: true},
    {label: '70-79', value: '70-79', riskGroup: true},
    {label: '80+', value: '80+', riskGroup: true}
  ];
}

function getCountiesOptions(t: TFunction): BasicItem[] {
  return [
    {label: t('common:preferNotToSay'), value: 'u'},
    ...counties.map((c) => ({label: c.county, value: c.code}))
  ];
}
