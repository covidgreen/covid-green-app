import React, {FC} from 'react';
import {View} from 'react-native';
import {
  useExposure,
  StatusState,
  AuthorisedStatus,
  StatusType
} from 'react-native-exposure-notification-service';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Spacing} from 'components/atoms/layout';
import {Scrollable} from 'components/templates/scrollable';
import {styles} from './styles';

import {ClosenessSensing} from 'components/molecules/closeness-sensing';

export const Completion: FC<any> = () => {
  const {t} = useTranslation();
  const nav = useNavigation();
  const {supported, canSupport, status, enabled, isAuthorised} = useExposure();

  const gotoDashboard = () =>
    nav.reset({
      index: 0,
      routes: [{name: 'main'}]
    });

  let closenessSensingStatusCard;
  let statusKey;

  if (!supported) {
    statusKey = !canSupport ? 'notSupported' : 'supported';
    closenessSensingStatusCard = !canSupport ? (
      <ClosenessSensing.NotSupported />
    ) : (
      <ClosenessSensing.Supported />
    );
  } else {
    if (isAuthorised === AuthorisedStatus.blocked) {
      statusKey = 'notEnabled';
      closenessSensingStatusCard = <ClosenessSensing.NotEnabled />;
    } else if (status.state === StatusState.active && enabled) {
      statusKey = 'active';
      closenessSensingStatusCard = <ClosenessSensing.Active share />;
    } else {
      statusKey = 'notActive';
      const type = status.type || [];
      closenessSensingStatusCard = (
        <ClosenessSensing.NotActive
          exposureOff={type.indexOf(StatusType.exposure) !== -1}
          bluetoothOff={type.indexOf(StatusType.bluetooth) !== -1}
        />
      );
    }
  }

  return (
    <Scrollable>
      <Spacing s={10} />
      <View style={styles.fill}>
        {closenessSensingStatusCard}
        <Spacing s={20} />
        <Button
          type={statusKey === 'active' ? 'default' : 'empty'}
          onPress={gotoDashboard}>
          {t(`closenessSensing:${statusKey}:next`)}
        </Button>
      </View>
    </Scrollable>
  );
};
