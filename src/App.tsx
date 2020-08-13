import React, {useEffect, useState} from 'react';
import {enableScreens} from 'react-native-screens';
import {Platform, StatusBar, Image, View, AppState} from 'react-native';
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
import NetInfo from '@react-native-community/netinfo';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import * as SecureStore from 'expo-secure-store';

import {
  ExposureProvider,
  TraceConfiguration
} from 'react-native-exposure-notification-service';
import {BUILD_VERSION} from '@env';

import {Asset} from 'expo-asset';

import 'services/i18n';

import {ApplicationProvider, useApplication} from 'providers/context';
import {
  SettingsProvider,
  SettingsContext,
  useSettings
} from 'providers/settings';

import {Base} from 'components/templates/base';
import {NavBar} from 'components/atoms/navbar';
import {TabBarBottom} from 'components/organisms/tab-bar-bottom';
import {GetStarted} from 'components/views/get-started';
import {YourData} from 'components/views/your-data';
import {AppUsage} from 'components/views/app-usage';
import {ContactTracingInformation} from 'components/views/contact-tracing-information';
import {FollowUpCall} from 'components/views/follow-up-call';
import {Sorry} from 'components/views/sorry';
import {
  DataProtectionPolicy,
  TermsAndConditions
} from 'components/views/data-protection-policy';
import {Dashboard} from 'components/views/dashboard';
import {SymptomChecker} from 'components/views/symptom-checker';
import {SymptomsHistory} from 'components/views/symptoms-history';
import {ContactTracing} from 'components/views/contact-tracing';
import {CountyBreakdown} from 'components/views/county-breakdown';
import {CloseContact} from 'components/views/close-contact';
import {UploadKeys} from 'components/views/upload-keys';
import {Settings} from 'components/views/settings';
import {ContactTracingSettings} from 'components/views/settings/contact-tracing';
import {CheckInSettings} from 'components/views/settings/check-in';
import {Metrics} from 'components/views/settings/metrics';
import {Leave} from 'components/views/settings/leave';
import {Debug} from 'components/views/settings/debug';
import {isMountedRef, navigationRef, ScreenNames} from 'navigation';
import {colors} from 'theme';
import {Loading} from 'components/views/loading';

import {Introduction, Permissions, Completion} from 'components/views/onboarding';
import Tour from 'components/views/tour';

import { urls } from 'constants/urls';

enableScreens();

try {
  NetInfo.fetch().then((state) => console.log(state));
} catch (err) {
  console.log(err);
}

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

const Screens = (t: TFunction, user: User | undefined) => {
  const header = () => null;
  return [
    {
      name: ScreenNames.Introduction,
      component: Introduction,
      options: {
        headerShown: true,
        title: t('viewNames:introduction'),
        cardStyle: {
          backgroundColor: colors.background
        }
      }
    },
    {
      name: ScreenNames.Permissions,
      component: Permissions,
      options: {
        headerShown: true,
        title: t('viewNames:permissions'),
        cardStyle: {
          backgroundColor: colors.background
        }
      }
    },
    {
      name: ScreenNames.Completion,
      component: Completion,
      options: {
        headerShown: true,
        title: t('viewNames:completion'),
        cardStyle: {
          backgroundColor: colors.background
        }
      }
    },
    {
      name: ScreenNames.Tour,
      component: Tour,
      options: {
        headerShown: false,
        title: t('viewNames:completion'),
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
        headerShown: true,
        title: t('viewNames:dashboard'),
        cardStyle: {
          backgroundColor: colors.background
        }
      }
    }
  ];
};

const SymptomsStack = () => {
  const app = useApplication();
  const {t} = useTranslation();

  const initialRouteName = app.checks.length
    ? 'symptoms.history'
    : 'symptoms.checker';

  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true
        //   header: props => <NavBar hideSettings={!app.user || !app.user.id} {...props} />
      }}
      initialRouteName={initialRouteName}
      headerMode="none">
      <Stack.Screen
        name="symptoms.history"
        component={SymptomsHistory}
        options={{title: t('viewNames:symptomchecker')}}
      />
      <Stack.Screen
        name="symptoms.checker"
        component={SymptomChecker}
        options={{title: t('viewNames:symptomchecker')}}
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
        name="dashboard"
        component={Dashboard}
        options={{title: t('viewNames:updates')}}
      />
      <Tab.Screen
        name="symptoms"
        component={SymptomsStack}
        options={{title: t('viewNames:symptomchecker')}}
      />
      <Tab.Screen
        name="tracing"
        component={ContactTracing}
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
  const initialScreen = app.user ? 'main' : ScreenNames.Introduction;

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
      navigationRef.current.navigate('closeContact');

      setState((s) => ({...s, notification: null}));
    }
  }, [app, notification]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    if (navigationRef.current && exposureNotificationClicked) {
      console.log('exposureNotificationClicked', exposureNotificationClicked);
      navigationRef.current.navigate('closeContact');
      setState((s) => ({...s, exposureNotificationClicked: null}));
    }
  }, [app, exposureNotificationClicked]);

  if (app.initializing) {
    return (
      <View>
        <Spinner visible />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={(e) => {
        navigationRef.current = e;
      }}>
      <Spinner animation="fade" visible={!!app.loading} />
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
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
        {Screens(t, app.user).map((screen, index) => (
          // @ts-ignore
          <Stack.Screen {...screen} key={`screen-${index}`} />
        ))}

        {/* <Stack.Screen
          name="over16"
          component={Over16}
          options={{
            title: t('viewNames:age'),
            header: () => null,
            cardStyle: {backgroundColor: colors.purple}
          }}
        />
        <Stack.Screen name="under16" component={Under16} />
        <Stack.Screen
          name="getStarted"
          component={GetStarted}
          options={{
            title: t('viewNames:getStarted'),
            header: () => null,
            cardStyle: {backgroundColor: colors.purple}
          }}
        />
        <Stack.Screen
          name="yourData"
          component={YourData}
          options={{title: t('yourData:title')}}
        />
        <Stack.Screen
          name="appUsage"
          component={AppUsage}
          options={{title: t('appUsage:title')}}
        />
        <Stack.Screen
          name="contactTracingInformation"
          component={ContactTracingInformation}
          options={{title: t('tabBar:contactTracing')}}
        />
        <Stack.Screen
          name="followUpCall"
          component={FollowUpCall}
          options={{title: t('followUpCall:contactTracing')}}
        />

        <Stack.Screen
          name="main"
          component={MainStack}
          options={{showSettings: true}}
        />
        <Stack.Screen
          name="casesByCounty"
          component={CountyBreakdown}
          options={{title: t('viewNames:casesByCounty')}}
        />
        <Stack.Screen
          name="closeContact"
          component={CloseContact}
          options={{title: t('viewNames:closeContact')}}
        />
        <Stack.Screen
          name="uploadKeys"
          component={UploadKeys}
          options={{title: t('viewNames:uploadKeys')}}
        />

        <Stack.Screen
          name="settings"
          component={Settings}
          options={{title: t('viewNames:settings')}}
        />
        <Stack.Screen
          name="settings.contactTracing"
          component={ContactTracingSettings}
          options={{title: t('viewNames:settingsContactTracing')}}
        />
        <Stack.Screen
          name="settings.checkIn"
          component={CheckInSettings}
          options={{title: t('viewNames:settingsCheckin')}}
        />
        <Stack.Screen
          name="settings.privacy"
          component={DataProtectionPolicy}
          options={{title: t('viewNames:dataPolicy')}}
        />
        <Stack.Screen
          name="settings.terms"
          component={TermsAndConditions}
          options={{title: t('viewNames:terms')}}
        />
        <Stack.Screen
          name="settings.metrics"
          component={Metrics}
          options={{title: t('viewNames:metrics')}}
        />
        <Stack.Screen
          name="settings.leave"
          component={Leave}
          options={{title: t('viewNames:leave')}}
        />
        <Stack.Screen name="settings.debug" component={Debug} />

        <Stack.Screen name="sorry" component={Sorry} />
        <Stack.Screen
          name="privacy"
          component={DataProtectionPolicy}
          options={{title: t('viewNames:dataPolicy')}}
        />
        <Stack.Screen
          name="terms"
          component={TermsAndConditions}
          options={{title: t('viewNames:terms')}}
        />
        */}
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
        const storedAuthToken = await SecureStore.getItemAsync('token');
        const storedRefreshToken = await SecureStore.getItemAsync(
          'refreshToken'
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

  return (
    <ExposureProvider
      isReady={Boolean(
        app.user?.valid && tokens.authToken && tokens.refreshToken
      )}
      traceConfiguration={settings.traceConfiguration}
      appVersion={BUILD_VERSION}
      serverUrl={urls.api}
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
