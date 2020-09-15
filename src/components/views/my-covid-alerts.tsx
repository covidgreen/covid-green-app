import React, {useCallback} from 'react';
import {Text, Platform} from 'react-native';
import {
  AuthorisedStatus,
  StatusState,
  StatusType,
  useExposure,
  PermissionStatus
} from 'react-native-exposure-notification-service';
import {useTranslation} from 'react-i18next';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ScreenNames} from 'navigation';
import {useAppState} from 'hooks/app-state';

import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/spacing';
import {CloseContactWarning} from 'components/molecules/close-contact-warning';
import {ClosenessSensing} from 'components/molecules/closeness-sensing';
import {NotificationsDisabledCard} from 'components/molecules/notifications-disabled-card';
import {Scrollable} from 'components/templates/scrollable';

import {colors, text} from 'theme';
import {BubbleIcons} from 'assets/icons';

export const MyCovidAlerts = () => {
  const {t} = useTranslation();
  const navigation: StackNavigationProp<any> = useNavigation();
  const exposure = useExposure();
  const isFocused = useIsFocused();
  const [appState] = useAppState();

  const {
    supported,
    canSupport,
    status,
    enabled,
    isAuthorised,
    permissions
  } = exposure;

  useFocusEffect(
    useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }

      async function onFocus() {
        await exposure.readPermissions();
        exposure.getCloseContacts();
      }

      onFocus();
    }, [isFocused, appState])
  );

  let showCards = true;
  let exposureStatusCard;
  if (!supported) {
    exposureStatusCard = !canSupport ? (
      <ClosenessSensing.NotSupported />
    ) : (
      <ClosenessSensing.Supported />
    );
    showCards = false;
  } else {
    if (status.state === StatusState.active && enabled) {
      exposureStatusCard =
        permissions.notifications.status !== PermissionStatus.Allowed ? (
          <NotificationsDisabledCard />
        ) : (
          <ClosenessSensing.Active />
        );
    } else if (Platform.OS === 'android') {
      exposureStatusCard =
        status.state === StatusState.disabled &&
        status.type?.indexOf(StatusType.bluetooth) !== -1 ? (
          <ClosenessSensing.NotActive bluetoothOff />
        ) : (
          <ClosenessSensing.NotAuthorized />
        );
    } else if (Platform.OS === 'ios') {
      if (isAuthorised === AuthorisedStatus.unknown) {
        exposureStatusCard = <ClosenessSensing.NotAuthorized />;
      } else if (isAuthorised === AuthorisedStatus.blocked) {
        exposureStatusCard = <ClosenessSensing.NotEnabledIOS />;
      } else {
        const type = status.type || [];
        exposureStatusCard = (
          <ClosenessSensing.NotActive
            exposureOff={type.indexOf(StatusType.exposure) !== -1}
            bluetoothOff={type.indexOf(StatusType.bluetooth) !== -1}
          />
        );
      }
    }
  }

  const hasCloseContact = exposure.contacts && exposure.contacts.length > 0;

  return (
    <Scrollable
      safeArea={false}
      heading={t('myCovidAlerts:title')}
      backgroundColor={colors.background}>
      {hasCloseContact && (
        <>
          <CloseContactWarning />
          <Spacing s={16} />
        </>
      )}
      {exposureStatusCard}
      {showCards && (
        <>
          <Spacing s={16} />
          <Card
            onPress={() => navigation.navigate(ScreenNames.PositiveResult)}
            icon={<BubbleIcons.TestedPositive />}
            padding={{r: 10}}>
            <Text style={text.defaultBold}>
              {t('myCovidAlerts:closeContactCard:text')}
            </Text>
          </Card>
          <Spacing s={16} />
          <Card
            onPress={() => navigation.navigate(ScreenNames.CloseContactInfo)}
            icon={
              <BubbleIcons.Info fill={colors.purple} width={56} height={57} />
            }
            padding={{r: 10}}>
            <Text style={text.defaultBold}>
              {t('myCovidAlerts:uploadCard:text')}
            </Text>
          </Card>
          <Spacing s={16} />
        </>
      )}
    </Scrollable>
  );
};
