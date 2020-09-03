import React, {FC} from 'react';
import {View, Platform} from 'react-native';
import {
  useExposure,
  StatusState,
  AuthorisedStatus,
  StatusType,
  PermissionStatus
} from 'react-native-exposure-notification-service';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import {useAppState} from 'hooks/app-state';
import {useFocusRef} from 'hooks/accessibility';

import {Spacing} from 'components/atoms/layout';
import {ClosenessSensing} from 'components/molecules/closeness-sensing';
import {NotificationsDisabledCard} from 'components/molecules/notifications-disabled-card';
import {Scrollable} from 'components/templates/scrollable';

import {styles} from './styles';

export const Completion: FC<any> = () => {
  const {
    permissions,
    supported,
    canSupport,
    status,
    enabled,
    isAuthorised,
    readPermissions
  } = useExposure();
  const [appState] = useAppState();
  const isFocused = useIsFocused();
  const [ref] = useFocusRef();

  useFocusEffect(
    React.useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }
      readPermissions();
    }, [isFocused, appState, readPermissions])
  );

  let closenessSensingStatusCard;
  if (!supported) {
    closenessSensingStatusCard = !canSupport ? (
      <ClosenessSensing.NotSupported onboarding />
    ) : (
      <ClosenessSensing.Supported onboarding />
    );
  } else {
    if (status.state === StatusState.active && enabled) {
      closenessSensingStatusCard =
        permissions.notifications.status !== PermissionStatus.Allowed ? (
          <NotificationsDisabledCard onboarding />
        ) : (
          <ClosenessSensing.Active ref={ref} onboarding />
        );
    } else if (Platform.OS === 'android') {
      closenessSensingStatusCard = (
        <ClosenessSensing.NotAuthorized onboarding />
      );
    } else if (Platform.OS === 'ios') {
      if (isAuthorised === AuthorisedStatus.unknown) {
        closenessSensingStatusCard = (
          <ClosenessSensing.NotAuthorized onboarding />
        );
      } else if (isAuthorised === AuthorisedStatus.blocked) {
        closenessSensingStatusCard = (
          <ClosenessSensing.NotEnabledIOS onboarding />
        );
      } else {
        const type = status.type || [];
        closenessSensingStatusCard = (
          <ClosenessSensing.NotActiveIOS
            onboarding
            exposureOff={type.indexOf(StatusType.exposure) !== -1}
            bluetoothOff={type.indexOf(StatusType.bluetooth) !== -1}
          />
        );
      }
    }
  }

  return (
    <Scrollable>
      <Spacing s={10} />
      <View style={styles.fill}>{closenessSensingStatusCard}</View>
    </Scrollable>
  );
};
