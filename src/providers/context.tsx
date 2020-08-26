import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback
} from 'react';
import {AccessibilityInfo} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as SecureStore from 'expo-secure-store';
import {format, compareDesc, startOfDay, subDays, isBefore} from 'date-fns';

import {AppConfig} from './settings';
import {loadData, StatsData, checkIn as apiCheckIn} from 'services/api';
import {SymptomRecord} from 'constants/symptoms';
import {County} from 'assets/counties';

export interface UserLocation {
  county?: string;
  locality?: string;
}

interface CheckInParams {
  feelingWell: boolean;
  quickCheckIn?: boolean;
}

export interface Accessibility {
  reduceMotionEnabled: boolean;
  screenReaderEnabled: boolean;
}

export interface User {
  valid: boolean;
  gender?: string;
  race?: string;
  ethnicity?: string;
  ageRange?: string;
  county?: string;
  tracking?: any[];
}

export interface Check {
  timestamp: number;
  symptoms: SymptomRecord;
  feelingWell: boolean;
}

type CallBackQueuedTs = number | undefined;

interface State {
  initializing: boolean;
  loading: boolean | string;
  user?: User;
  data?: StatsData | null;
  checkInConsent: boolean;
  completedChecker: boolean;
  completedCheckerDate: string | null;
  checkerSymptoms: SymptomRecord;
  quickCheckIn: boolean;
  checks: Check[];
  callBackQueuedTs?: CallBackQueuedTs;
  accessibility: Accessibility;
  county: County | 'u';
}

export interface ApplicationContextValue extends State {
  uploadRequired?: boolean;
  setContext: (data: any) => Promise<void>;
  clearContext: () => Promise<void>;
  showActivityIndicator: (message?: string) => void;
  hideActivityIndicator: () => void;
  loadAppData: () => Promise<void>;
  checkIn: (symptoms: SymptomRecord, params: CheckInParams) => Promise<void>;
  verifyCheckerStatus: () => void;
  setCountyScope: (county: County | 'u') => void;
}

const initialState = {
  initializing: true,
  loading: false,
  user: undefined,
  accessibility: {
    reduceMotionEnabled: false,
    screenReaderEnabled: false
  }
};

export const ApplicationContext = createContext(
  initialState as ApplicationContextValue
);

export interface API {
  user: string | null;
  consent: string | null;
  appConfig: AppConfig;
  children: any;
}

export const AP = ({appConfig, user, consent, children}: API) => {
  const [state, setState] = useState<State>({
    initializing: true,
    loading: false,
    checkInConsent: consent === 'y',
    completedChecker: false,
    completedCheckerDate: null,
    checkerSymptoms: {} as SymptomRecord,
    quickCheckIn: false,
    checks: [],
    user: (user && JSON.parse(user as string)) || null,
    accessibility: {
      reduceMotionEnabled: false,
      screenReaderEnabled: false
    },
    county: 'u'
  });

  const handleReduceMotionChange = (reduceMotionEnabled: boolean): void => {
    setState((s) => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        reduceMotionEnabled: reduceMotionEnabled
      }
    }));
  };

  const handleScreenReaderChange = (screenReaderEnabled: boolean): void => {
    setState((s) => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        screenReaderEnabled
      }
    }));
  };

  useEffect(() => {
    AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      handleReduceMotionChange
    );
    AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      handleScreenReaderChange
    );

    AccessibilityInfo.isReduceMotionEnabled().then(handleReduceMotionChange);
    AccessibilityInfo.isScreenReaderEnabled().then(handleScreenReaderChange);

    return () => {
      AccessibilityInfo.removeEventListener(
        'reduceMotionChanged',
        handleReduceMotionChange
      );
      AccessibilityInfo.removeEventListener(
        'screenReaderChanged',
        handleScreenReaderChange
      );
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      let callBackQueuedTs: CallBackQueuedTs;
      let checks: Check[] = [];
      let completedCheckerDate: string | null = null;
      let completedChecker = false;

      if (state.user) {
        const checksData = await SecureStore.getItemAsync('covidApp.checks');
        checks = checksData ? JSON.parse(checksData) : [];
        checks.sort((a, b) => compareDesc(a.timestamp, b.timestamp));

        if (checks.length) {
          const today = format(new Date(), 'dd/MM/yyyy');
          completedCheckerDate = format(checks[0].timestamp, 'dd/MM/yyy');
          completedChecker = today === completedCheckerDate;
        }
      }

      try {
        const storedCallBackQueuedTs = await SecureStore.getItemAsync(
          'covidApp.callBackQueuedTs'
        );
        if (storedCallBackQueuedTs) {
          callBackQueuedTs = Number(storedCallBackQueuedTs);
        }
      } catch (err) {
        console.log(
          'Error reading "covidApp.callBack" from async storage:',
          err
        );
      }

      const county = await AsyncStorage.getItem('nysCounty');

      setState((s) => ({
        ...s,
        initializing: false,
        completedChecker,
        completedCheckerDate,
        checks,
        callBackQueuedTs,
        county: county ? (county as County | 'u') : 'u'
      }));
    };

    try {
      load();
    } catch (err) {
      console.log('App init error:', err);
    } finally {
      setState((s) => ({...s, initializing: false}));
    }
  }, []);

  const loadAppData = async () => {
    try {
      const data = await loadData();
      setState((s) => ({...s, loading: false, data}));
      return true;
    } catch (err) {
      setState((s) => ({...s, loading: false, data: null}));
      console.log('Error loading app data: ', err);
      console.log(err);
      return err;
    }
  };
  const loadAppDataRef = useCallback(loadAppData, [loadData]);

  const setContext = async (data: Partial<State>) => {
    setState((s) => ({...s, ...data}));
    if (data.user) {
      await AsyncStorage.setItem('covidApp.user', JSON.stringify(data.user));
    }
    if (data.checkInConsent) {
      await AsyncStorage.setItem('covidApp.checkInConsent', 'y');
    }
    if (data.callBackQueuedTs) {
      await SecureStore.setItemAsync(
        'covidApp.callBackQueuedTs',
        JSON.stringify(data.callBackQueuedTs)
      );
    }
  };

  const clearContext = async (): Promise<void> => {
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('covidApp.checks');
    await SecureStore.deleteItemAsync('uploadToken');
    await SecureStore.deleteItemAsync('covidApp.callBackQueuedTs');
    await SecureStore.deleteItemAsync('appLanguage');
    await AsyncStorage.removeItem('covidApp.user');
    await AsyncStorage.removeItem('covidApp.checkInConsent');
    await AsyncStorage.removeItem('covidApp.showDebug');
    await AsyncStorage.removeItem('analyticsConsent');
    await AsyncStorage.removeItem('nysCounty');

    setState((s) => ({
      ...s,
      data: undefined,
      checkInConsent: false,
      completedChecker: false,
      completedCheckerDate: null,
      checkerSymptoms: {} as SymptomRecord,
      quickCheckIn: false,
      checks: [],
      user: undefined,
      callBackQueuedTs: undefined
    }));
  };

  const showActivityIndicator = (message?: string) => {
    setState((s) => ({...s, loading: message || true}));
  };
  const showActivityIndicatorRef = useCallback(showActivityIndicator, []);

  const hideActivityIndicator = () => setState((s) => ({...s, loading: false}));
  const hideActivityIndicatorRef = useCallback(hideActivityIndicator, []);

  const checkIn = async (
    symptoms: SymptomRecord,
    {feelingWell, quickCheckIn = false}: CheckInParams
  ) => {
    const timestamp = Date.now();

    const currentCheck: Check = {
      timestamp,
      symptoms,
      feelingWell
    };

    const checks = [currentCheck, ...state.checks];

    try {
      const lastAllowedDate = startOfDay(
        subDays(new Date(), appConfig.checkInMaxAge)
      );

      // remove checks that are old before storing them on the device
      let check = checks.length > 0;
      while (check) {
        const lastItem = checks[checks.length - 1];
        check = isBefore(lastItem.timestamp, lastAllowedDate);
        if (check) {
          checks.pop();
        }
      }

      await setContext({
        checks,
        completedChecker: true,
        completedCheckerDate: format(timestamp, 'dd/MM/yyyy'),
        checkerSymptoms: {} as SymptomRecord,
        quickCheckIn
      });

      SecureStore.setItemAsync('covidApp.checks', JSON.stringify(checks));

      apiCheckIn(checks, {
        gender: state.user!.gender!,
        race: state.user!.race!,
        ethnicity: state.user!.ethnicity!,
        ageRange: state.user!.ageRange!,
        county: state.user!.county!,
        ok: Object.values(checks[0].symptoms).every((r) => r === 0)
      });
    } catch (err) {
      console.log('Context checkIn error: ', err);
    }
  };

  const verifyCheckerStatus = () => {
    console.log('verifyCheckerStatus');
    const {completedChecker, completedCheckerDate} = state;

    if (completedChecker) {
      const today = format(new Date(), 'dd/MM/yyyy');
      console.log(`checker last completed on ${today}`);
      if (today !== completedCheckerDate) {
        setState((s) => ({...s, completedChecker: false}));
      }
    }
  };

  const setCountyScope = (county: County | 'u') => {
    AsyncStorage.setItem('nysCounty', county);
    setState((s) => ({...s, county}));
  };

  const verifyCheckerStatusRef = useCallback(verifyCheckerStatus, [
    state.completedChecker,
    state.completedCheckerDate
  ]);

  const value: ApplicationContextValue = {
    ...state,
    setContext,
    clearContext,
    showActivityIndicator: showActivityIndicatorRef,
    hideActivityIndicator: hideActivityIndicatorRef,
    loadAppData: loadAppDataRef,
    checkIn,
    verifyCheckerStatus: verifyCheckerStatusRef,
    setCountyScope
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const ApplicationProvider = AP;

export const useApplication = () => useContext(ApplicationContext);
