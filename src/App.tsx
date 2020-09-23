import React, {useEffect, useState} from 'react';
import {enableScreens} from 'react-native-screens';
import {Platform, StatusBar, Image, AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import PushNotification, {
  PushNotification as PN
} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import * as SecureStore from 'expo-secure-store';

import {
  ExposureProvider,
  TraceConfiguration,
  KeyServerType
} from 'react-native-exposure-notification-service';
import {getReadableVersion} from 'react-native-device-info';

import {Asset} from 'expo-asset';

import 'services/i18n';

import {
  ApplicationProvider,
  useApplication,
  StorageKeys
} from 'providers/context';
import {
  SettingsProvider,
  SettingsContext,
  useSettings
} from 'providers/settings';

import {Base} from 'components/templates/base';
import {NavBar} from 'components/atoms/navbar';
import {TabBarBottom} from 'components/organisms/tab-bar-bottom';
import {
  DataProtectionPolicy,
  TermsAndConditions
} from 'components/views/data-protection-policy';
import {Dashboard} from 'components/views/dashboard';
import {
  CheckInConsent,
  CheckInIntro,
  CheckInSymptoms,
  CheckInFinal
} from 'components/views/symptom-checker';
import {SymptomsHistory} from 'components/views/symptoms-history';
import {MyCovidAlerts} from 'components/views/my-covid-alerts';
import {CloseContactInfo} from 'components/views/close-contact-info';
import {CloseContactAlert} from 'components/views/close-contact-alert';

import {UploadKeys} from 'components/views/upload-keys';
import {Settings} from 'components/views/settings';
import {ContactTracingSettings} from 'components/views/settings/contact-tracing';
import {CheckInSettings} from 'components/views/settings/check-in';
import {Metrics} from 'components/views/settings/metrics';
import {Leave} from 'components/views/settings/leave';
import {Debug} from 'components/views/settings/debug';
import {
  covidAlertReset,
  isMountedRef,
  navigationRef,
  ScreenNames
} from 'navigation';
import {colors} from 'theme';
import {Loading} from 'components/views/loading';
import {useSymptomChecker} from 'hooks/symptom-checker';

import {
  Introduction,
  Permissions,
  Completion
} from 'components/views/onboarding';
import Tour from 'components/views/tour';

import {urls} from 'constants/urls';
import {PositiveResult} from 'components/views/positive-result';
import {Language} from 'components/views/settings/language';
import {Feedback} from 'components/views/settings/feedback';
import {AgeCheck} from 'components/views/onboarding/age-check';

enableScreens();

function cacheImages(images: (string | number)[]) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Screens = (t: TFunction) => {
  const standardProps = {
    headerShown: true,
    cardStyle: {
      backgroundColor: colors.background
    }
  };

  return [
    {
      name: ScreenNames.Introduction,
      component: Introduction,
      options: {
        title: t('viewNames:introduction'),
        headerShown: true,
        cardStyle: {
          backgroundColor: colors.background
        }
      }
    },
    {
      name: ScreenNames.Permissions,
      component: Permissions,
      options: {
        title: t('viewNames:permissions'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.Completion,
      component: Completion,
      options: {
        title: t('viewNames:completion'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.Tour,
      component: Tour,
      options: {
        headerShown: false,
        title: t('viewNames:howItWorks'),
        cardStyle: {
          backgroundColor: colors.white
        },
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.Dashboard,
      component: Dashboard,
      options: {
        title: t('viewNames:dashboard'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.CloseContactInfo,
      component: CloseContactInfo,
      options: {
        title: t('closeContactInfo:title'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.CloseContactAlert,
      component: CloseContactAlert,
      options: {
        title: t('closeContactAlert:title'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.Settings,
      component: Settings,
      options: {
        title: t('viewNames:settings'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.ContactTracingSettings,
      component: ContactTracingSettings,
      options: {
        title: t('viewNames:settingsContactTracing'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.HealthLogSettings,
      component: CheckInSettings,
      options: {
        title: t('viewNames:settingsCheckin'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.LanguageSetttings,
      component: Language,
      options: {
        title: t('viewNames:settingsLanguage'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.PrivacySettings,
      component: DataProtectionPolicy,
      options: {
        title: t('viewNames:dataPolicy'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.TermsSettings,
      component: TermsAndConditions,
      options: {
        title: t('viewNames:terms'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.UsageSettings,
      component: Metrics,
      options: {
        title: t('viewNames:metrics'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.LeaveSettings,
      component: Leave,
      options: {
        title: t('viewNames:leave'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.DebugSettings,
      component: Debug,
      options: {
        ...standardProps
      }
    },
    {
      name: ScreenNames.FeedbackSettings,
      component: Feedback,
      options: {
        ...standardProps
      }
    },
    {
      name: ScreenNames.Privacy,
      component: DataProtectionPolicy,
      options: {
        title: t('viewNames:dataPolicy'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.Terms,
      component: TermsAndConditions,
      options: {
        title: t('viewNames:terms'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.UploadKeys,
      component: UploadKeys,
      options: {
        title: t('viewNames:uploadKeys'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.PositiveResult,
      component: PositiveResult,
      options: {
        title: t('viewNames:positiveResult'),
        ...standardProps
      }
    },
    {
      name: ScreenNames.AgeCheck,
      component: AgeCheck,
      options: {
        ...standardProps,
        headerShown: false
      }
    }
  ];
};

const SymptomsStack = () => {
  const app = useApplication();
  const {t} = useTranslation();
  const {getNextScreen} = useSymptomChecker();

  const initialRouteName = app.checks.length
    ? ScreenNames.History
    : getNextScreen();

  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true
      }}
      initialRouteName={initialRouteName}
      headerMode="none">
      <Stack.Screen
        name={ScreenNames.History}
        component={SymptomsHistory}
        options={{
          title: t('viewNames:symptomchecker'),
          cardStyle: {
            backgroundColor: colors.background
          }
        }}
      />
      <Stack.Screen
        name="checker.consent"
        component={CheckInConsent}
        options={{
          title: t('viewNames:symptomchecker'),
          cardStyle: {
            backgroundColor: colors.background
          }
        }}
      />
      <Stack.Screen
        name="checker.intro"
        component={CheckInIntro}
        options={{
          title: t('viewNames:symptomchecker'),
          cardStyle: {
            backgroundColor: colors.background
          }
        }}
      />
      <Stack.Screen
        name="checker.symptoms.1"
        component={CheckInSymptoms}
        initialParams={{page: 1, back: true}}
        options={{
          title: t('viewNames:symptomchecker'),
          cardStyle: {
            backgroundColor: colors.background
          }
        }}
      />
      <Stack.Screen
        name="checker.final"
        component={CheckInFinal}
        options={{
          title: t('viewNames:symptomchecker'),
          cardStyle: {
            backgroundColor: colors.background
          }
        }}
      />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName="dashboard"
      tabBar={(props: any) => <TabBarBottom {...props} />}>
      <Tab.Screen
        name={ScreenNames.Dashboard}
        component={Dashboard}
        options={{title: t('viewNames:updates')}}
      />
      <Tab.Screen
        name="symptoms"
        component={SymptomsStack}
        options={{
          title: t('viewNames:symptomchecker')
        }}
      />
      <Tab.Screen
        name={ScreenNames.MyCovidAlerts}
        component={MyCovidAlerts}
        options={{title: t('viewNames:contactTracing')}}
      />
      <Tab.Screen
        name={ScreenNames.Settings}
        component={Settings}
        options={{title: t('viewNames:contactTracing')}}
      />
    </Tab.Navigator>
  );
};

function Navigation({
  notification,
  exposureNotificationClicked,
  setState
}: {
  traceConfiguration: TraceConfiguration;
  notification: PN | null;
  exposureNotificationClicked: Boolean | null;
  setState: (value: React.SetStateAction<State>) => void;
}) {
  const app = useApplication();
  const {t} = useTranslation();
  const initialScreen = app.user ? 'main' : ScreenNames.AgeCheck;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    if (navigationRef.current && notification) {
      navigationRef.current.reset(covidAlertReset);

      setState((s) => ({...s, notification: null}));
    }
  }, [app, notification]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    if (navigationRef.current && exposureNotificationClicked) {
      console.log('exposureNotificationClicked', exposureNotificationClicked);
      navigationRef.current.reset(covidAlertReset);
      setState((s) => ({...s, exposureNotificationClicked: null}));
    }
  }, [app, exposureNotificationClicked]);

  if (app.initializing) {
    return <Loading />;
  }

  return (
    <NavigationContainer
      ref={(e) => {
        navigationRef.current = e;
      }}>
      <Spinner animation="fade" visible={!!app.loading} />
      <Stack.Navigator
        screenOptions={() => ({
          header: (props) => <NavBar {...props} />,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: {backgroundColor: colors.purple},
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animationEnabled: true,
          headerShown: false
        })}
        mode="modal"
        initialRouteName={initialScreen}>
        {Screens(t).map((screen, index) => (
          // @ts-ignore
          <Stack.Screen {...screen} key={`screen-${index}`} />
        ))}
        <Stack.Screen
          name="main"
          component={MainStack}
          options={{
            headerShown: true,
            title: t('viewNames:introduction'),
            cardStyle: {
              backgroundColor: colors.background
            },
            // @ts-ignore
            showSettings: true
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const ExposureApp: React.FC = ({children}) => {
  const {t} = useTranslation();
  const [tokens, setTokens] = useState<{
    authToken: string;
    refreshToken: string;
  }>({authToken: '', refreshToken: ''});

  const settings = useSettings();
  const app = useApplication();

  useEffect(() => {
    async function getTokens() {
      try {
        const storedAuthToken = await SecureStore.getItemAsync(
          StorageKeys.token
        );
        const storedRefreshToken = await SecureStore.getItemAsync(
          StorageKeys.refreshToken
        );
        setTokens({
          authToken: storedAuthToken || '',
          refreshToken: storedRefreshToken || ''
        });
      } catch (err) {
        console.error('error getting tokens', err);
      }
    }

    getTokens();
  }, [app.user]);

  const version = getReadableVersion();

  return (
    <ExposureProvider
      isReady={Boolean(
        app.user?.valid && tokens.authToken && tokens.refreshToken
      )}
      traceConfiguration={settings.traceConfiguration}
      appVersion={version}
      serverUrl={urls.api}
      keyServerUrl={urls.keyDownload}
      keyServerType={KeyServerType.google}
      authToken={tokens.authToken}
      refreshToken={tokens.refreshToken}
      notificationTitle={t('closeContactNotification:title')}
      notificationDescription={t('closeContactNotification:description')}>
      {children}
    </ExposureProvider>
  );
};

interface State {
  loading: boolean;
  token?: {os: string; token: string};
  notification: PN | null;
  exposureNotificationClicked: Boolean | null;
}

export default function App(props: {
  exposureNotificationClicked: Boolean | null;
}) {
  const [state, setState] = React.useState<State>({
    loading: false,
    notification: null,
    exposureNotificationClicked: props.exposureNotificationClicked
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        const imageAssets = cacheImages([]);
        await Promise.all([...imageAssets]);
      } catch (e) {
        console.warn(e);
      } finally {
        setState({...state, loading: false});
      }
    }

    PushNotification.configure({
      onRegister: function () {},
      onNotification: async function (notification) {
        let requiresHandling = false;
        if (Platform.OS === 'ios') {
          if (
            (notification && notification.userInteraction) ||
            (AppState.currentState === 'active' && notification)
          ) {
            PushNotification.setApplicationIconBadgeNumber(0);
            requiresHandling = true;
            setTimeout(() => {
              notification.finish(
                Platform.OS === 'ios'
                  ? PushNotificationIOS.FetchResult.NoData
                  : ''
              );
            }, 3000);
          }
        }
        if (requiresHandling) {
          setTimeout(() => setState((s) => ({...s, notification})), 500);
        }
      },
      senderID: '1087125483031',
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: false
    });

    loadResourcesAndDataAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <Base>
        <SettingsProvider>
          <SettingsContext.Consumer>
            {(settingsValue) => {
              if (!settingsValue.loaded) {
                return <Loading />;
              }
              return (
                <ApplicationProvider
                  user={settingsValue.user}
                  consent={settingsValue.consent}
                  appConfig={settingsValue.appConfig}>
                  <ExposureApp>
                    <StatusBar barStyle="default" />
                    <Navigation
                      traceConfiguration={settingsValue.traceConfiguration}
                      notification={state.notification}
                      exposureNotificationClicked={
                        state.exposureNotificationClicked
                      }
                      setState={setState}
                    />
                  </ExposureApp>
                </ApplicationProvider>
              );
            }}
          </SettingsContext.Consumer>
        </SettingsProvider>
      </Base>
    </SafeAreaProvider>
  );
}
