import React, {useCallback} from 'react';
import {Text} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  useExposure,
  StatusState,
  AuthorisedStatus,
  StatusType
} from 'react-native-exposure-notification-service';
import {Card} from 'components/atoms/card';
import {CloseContactWarning} from 'components/molecules/close-contact-warning';
import {colors, text} from 'theme';
import {Spacing} from 'components/atoms/spacing';
import {useAppState} from 'hooks/app-state';

import {Active} from './active';
import {NotActive} from './not-active';
import {NoSupport} from './no-support';
import {CanSupport} from './can-support';
import {NotEnabled} from './not-enabled';
import {Scrollable} from 'components/templates/scrollable';
import {BubbleIcons} from 'assets/icons';

export const ContactTracing = ({navigation}) => {
  const {t} = useTranslation();
  const exposure = useExposure();
  const isFocused = useIsFocused();
  const [appState] = useAppState();

  const {supported, canSupport, status, enabled, isAuthorised} = exposure;

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
    exposureStatusCard = !canSupport ? <NoSupport /> : <CanSupport />;
    showCards = false;
  } else {
    if (status.state === StatusState.active && enabled) {
      exposureStatusCard = <Active />;
    } else if (isAuthorised === AuthorisedStatus.unknown) {
      exposureStatusCard = <NotEnabled />;
    } else {
      const type = status.type || [];
      exposureStatusCard = (
        <NotActive
          exposureOff={type.indexOf(StatusType.exposure) !== -1}
          bluetoothOff={type.indexOf(StatusType.bluetooth) !== -1}
        />
      );
    }
  }

  const hasCloseContact = exposure.contacts && exposure.contacts.length > 0;

  return (
    <Scrollable
      safeArea={false}
      heading={t('contactTracing:title')}
      accessibilityRefocus>
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
            onPress={() =>
              navigation.navigate(
                hasCloseContact ? 'closeContact' : 'closeContactInfo'
              )
            }
            icon={<BubbleIcons.TestedPositive />}
            padding={{r: 10}}>
            <Text style={text.defaultBold}>
              {t('contactTracing:closeContactCard:text')}
            </Text>
          </Card>
          <Spacing s={16} />
          <Card
            onPress={() => navigation.navigate('uploadKeys')}
            icon={
              <BubbleIcons.Info fill={colors.purple} width={56} height={57} />
            }
            padding={{r: 10}}>
            <Text style={text.defaultBold}>
              {t('contactTracing:uploadCard:text')}
            </Text>
          </Card>
          <Spacing s={16} />
        </>
      )}
    </Scrollable>
  );
};
