import React, {FC, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  useExposure,
  StatusState,
  PermissionStatus,
  StatusType
} from 'react-native-exposure-notification-service';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useApplication} from 'providers/context';
import {useAppState} from 'hooks/app-state';
import {useSymptomChecker} from 'hooks/symptom-checker';
import {setAccessibilityFocusRef, useFocusRef} from 'hooks/accessibility';

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
  const {
    status,
    readPermissions,
    tracingAvailable,
    enabled,
    permissions,
    contacts
  } = useExposure();
  const [ref1, ref2, ref3, ref4, ref5] = useFocusRef({
    accessibilityFocus: true,
    accessibilityRefocus: true,
    count: 5,
    timeout: 1000
  });
  const {getNextScreen} = useSymptomChecker();

  useFocusEffect(
    React.useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }
      readPermissions();
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
      icon={<AppIcons.ErrorWarning width={24} height={24} />}
      message={t('common:missingError')}
    />
  );

  return (
    <Scrollable
      safeArea={false}
      toast={errorToast}
      backgroundColor={colors.background}
      refresh={{refreshing, onRefresh}}>
      {tracingAvailable && (
        <>
          <TracingAvailable ref={ref1} />
          <Spacing s={16} />
        </>
      )}
      {contacts && contacts.length > 0 && (
        <>
          <CloseContactWarning ref={ref2} />
          <Spacing s={16} />
        </>
      )}
      {(!enabled ||
        status.state !== StatusState.active ||
        permissions.notifications.status !== PermissionStatus.Allowed) && (
        <>
          <AlertInformation
            ref={ref3}
            bluetoothOff={status.type?.indexOf(StatusType.bluetooth) !== -1}
          />
          <Spacing s={16} />
        </>
      )}
      {!completedChecker && (
        <>
          <CheckInCard
            ref={ref4}
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
            accessibilityFocus={false}
            lineWidth={75}
            text={t('dashboard:stats:title')}
          />
          <CountyDropdown
            ref={ref5}
            onValueChange={(option) => {
              setCountyScope(option.label as County);
              setAccessibilityFocusRef(ref5);
            }}
            value={county}
          />
          <Spacing s={20} />
          <Text maxFontSizeMultiplier={2} style={text.defaultBold}>
            {t('dashboard:stats:subtitle')}
          </Text>
          <Spacing s={18} />
          <TrackerCharts data={data} county={county.split('_')[0]} />
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
