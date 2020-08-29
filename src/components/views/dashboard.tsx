import React, {FC, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useApplication} from 'providers/context';
import {useAppState} from 'hooks/app-state';
import {useSymptomChecker} from 'hooks/symptom-checker';

import {Button} from 'components/atoms/button';
import {Heading} from 'components/atoms/heading';
import {Spacing} from 'components/atoms/layout';
import {Toast} from 'components/atoms/toast';
import {AlertInformation} from 'components/molecules/alert-information';
import {CheckInCard} from 'components/molecules/check-in-card';
import {CloseContactWarning} from 'components/molecules/close-contact-warning';
import {CountyDropdown} from 'components/molecules/county-dropdown';
import {TracingAvailable} from 'components/molecules/tracing-available';
import {TrackerCharts} from 'components/organisms/tracker-charts';
import {Scrollable} from 'components/templates/scrollable';

import {colors, text} from 'theme';
import {AppIcons} from 'assets/icons';
import {County} from 'assets/counties';

export const Dashboard: FC<any> = ({navigation}) => {
  const {
    completedChecker,
    verifyCheckerStatus,
    loadAppData,
    data,
    county,
    setCountyScope
  } = useApplication();
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [appState] = useAppState();
  const isFocused = useIsFocused();
  const exposure = useExposure();
  const {getNextScreen} = useSymptomChecker();

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
    loadAppData().then(() => setRefreshing(false));
  };

  useEffect(onRefresh, []);

  const errorToast = data === null && (
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
      backgroundColor={colors.background}
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
      {exposure.initialised && !exposure.enabled && (
        <>
          <AlertInformation />
          <Spacing s={16} />
        </>
      )}
      {!completedChecker && (
        <>
          <CheckInCard
            onPress={() =>
              navigation.navigate('symptoms', {screen: getNextScreen()})
            }
          />
          <Spacing s={16} />
        </>
      )}
      {data === null && (
        <>
          <View style={styles.empty}>
            <Button type="empty" onPress={onRefresh}>
              {t('common:missingDataAction')}
            </Button>
          </View>
        </>
      )}
      {data && (
        <>
          <Heading
            accessibilityFocus
            lineWidth={75}
            text={t('dashboard:stats:title')}
          />
          <CountyDropdown
            onValueChange={(option) => {
              setCountyScope(option.label as County);
            }}
            value={county}
          />
          <Spacing s={20} />
          <Text style={text.defaultBold}>{t('dashboard:stats:subtitle')}</Text>
          <Spacing s={18} />
          <TrackerCharts data={data} county={county} />
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
