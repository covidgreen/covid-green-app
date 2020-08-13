import React, {FC, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useExposure} from 'react-native-exposure-notification-service';

import {AppIcons} from 'assets/icons';
import {AppStats} from 'components/organisms/app-stats';
import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {CheckInCard} from 'components/molecules/check-in-card';
import {CloseContactWarning} from 'components/molecules/close-contact-warning';
import {CovidStats} from 'components/organisms/covid-stats';
import {QuickCheckIn} from 'components/molecules/quick-checkin';
import {Scrollable} from 'components/templates/scrollable';
import {Spacing} from 'components/atoms/spacing';
import {StatsSource} from 'components/molecules/stats-source';
import {Toast} from 'components/atoms/toast';
import {TracingAvailable} from 'components/molecules/tracing-available';
import {TrackerAreaChart} from 'components/molecules/area-chart';
import {TransmissionChart} from 'components/molecules/transmission-chart';
import {useApplication} from 'providers/context';
import {useAppState} from 'hooks/app-state';
import {useSymptomChecker} from 'hooks/symptom-checker';

export const Dashboard: FC<any> = ({navigation}) => {
  const app = useApplication();
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [quickCheckInDismissed, setQuickCheckInDismissed] = useState(false);
  const [appState] = useAppState();
  const isFocused = useIsFocused();
  const exposure = useExposure();
  const {getNextScreen} = useSymptomChecker();

  const {verifyCheckerStatus} = app;
  const {checkInConsent, quickCheckIn, checks} = app;

  const displayQuickCheckIn =
    !quickCheckInDismissed &&
    (quickCheckIn ||
      (checkInConsent && checks.length > 0 && !app.completedChecker));

  useFocusEffect(
    React.useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }
      exposure.readPermissions();
      verifyCheckerStatus();
    }, [isFocused, appState, verifyCheckerStatus])
  );

  const onRefresh = () => {
    setRefreshing(true);
    app.loadAppData().then(() => setRefreshing(false));
  };

  useEffect(onRefresh, []);

  const appStats = () => {
    const total =
      app.data && app.data.checkIns ? Number(app.data.checkIns.total) : 0;
    const ok = app.data && app.data.checkIns ? Number(app.data.checkIns.ok) : 0;
    const okPercentage = total && Math.round((ok / total) * 100);
    return {
      totalCheckins: total,
      noSymptoms: (total && okPercentage) || 0,
      someSymptoms: (total && 100 - okPercentage) || 0
    };
  };

  const errorToast = app.data === null && (
    <Toast
      type="error"
      icon={<AppIcons.Alert width={24} height={24} />}
      message={t('common:missingError')}
    />
  );

  return (
    <Scrollable
      safeArea={false}
      toast={errorToast}
      backgroundColor="#FAFAFA"
      refresh={{refreshing, onRefresh}}>
      {exposure.tracingAvailable && (
        <>
          <TracingAvailable />
          <Spacing s={16} />
        </>
      )}
      {exposure.contacts && exposure.contacts.length > 0 && (
        <>
          <CloseContactWarning />
          <Spacing s={16} />
        </>
      )}
      {!checkInConsent && (
        <>
          <CheckInCard
            onPress={() =>
              navigation.navigate('symptoms', {screen: getNextScreen()})
            }
          />
          <Spacing s={16} />
        </>
      )}
      {displayQuickCheckIn && (
        <QuickCheckIn
          onDismissed={() => setQuickCheckInDismissed(true)}
          nextHandler={() =>
            navigation.navigate('symptoms', {
              screen: getNextScreen('checker.quick')
            })
          }
        />
      )}
      {app.data === null && (
        <>
          <View style={styles.empty}>
            <Button type="empty" onPress={onRefresh}>
              {t('common:missingDataAction')}
            </Button>
          </View>
        </>
      )}
      {app.data && (
        <>
          <AppStats data={appStats()} />
          {app.data && app.data.statistics && (
            <>
              <Spacing s={16} />
              <CovidStats
                data={app.data.statistics}
                onCountyBreakdown={() => navigation.navigate('casesByCounty')}
              />
            </>
          )}
          {app.data && app.data.chart && (
            <>
              <Spacing s={16} />
              <Card padding={{h: 12}}>
                <TrackerAreaChart
                  title={t('confirmedChart:title')}
                  hint={t('confirmedChart:hint')}
                  yesterday={t('confirmedChart:yesterday')}
                  data={app.data.chart}
                />
              </Card>
            </>
          )}
          {app.data && app.data.statistics && (
            <>
              <Spacing s={16} />
              <TransmissionChart
                title={t('transmissionChart:title')}
                data={[
                  [
                    t('transmissionChart:community'),
                    app.data.statistics.transmission.community
                  ],
                  [
                    t('transmissionChart:contact'),
                    app.data.statistics.transmission.closeContact
                  ],
                  [
                    t('transmissionChart:travel'),
                    app.data.statistics.transmission.travelAbroad
                  ]
                ]}
              />
            </>
          )}
          {app.data && app.data.statistics && (
            <>
              <Spacing s={16} />
              <StatsSource
                lastUpdated={{
                  stats: new Date(app.data.statistics.lastUpdated.stats),
                  profile: new Date(app.data.statistics.lastUpdated.profile)
                }}
              />
            </>
          )}
        </>
      )}
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  }
});
