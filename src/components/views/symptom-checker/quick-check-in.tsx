import React from 'react';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useApplication} from 'providers/context';
import {useSymptomChecker} from 'hooks/symptom-checker';

import {Spacing} from 'components/atoms/spacing';
import {Card} from 'components/atoms/card';
import {Button} from 'components/atoms/button';

import {Scrollable} from 'components/templates/scrollable';
import {text, colors} from 'theme';
import {emptySymptomRecord} from 'constants/symptoms';

export function CheckInQuick() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const app = useApplication();
  const {getNextScreen} = useSymptomChecker();

  const onFeelingWell = async () => {
    try {
      app.checkIn(emptySymptomRecord, {feelingWell: true, quickCheckIn: false});
    } catch (err) {
      console.log(err);
    }
    navigation.reset({
      index: 0,
      routes: [{name: 'history', params: {feelingWell: true, symptoms: {}}}]
    });
  };

  const onNotFeelingWell = async () => {
    const nextScreen = getNextScreen('checker.quick', {skipQuickCheckIn: true});
    navigation.navigate(nextScreen);
  };

  return (
    <Scrollable
      safeArea={false}
      backgroundColor={colors.white}
      heading={t('checker:title')}>
      <Card>
        <Text style={text.largeBold}>{t('returning:subtitle')}</Text>
        <Spacing s={12} />
        <Button width="100%" type="empty" onPress={onFeelingWell}>
          {t('returning:action1')}
        </Button>
        <Spacing s={12} />
        <Button width="100%" type="empty" onPress={onNotFeelingWell}>
          {t('returning:action2')}
        </Button>
      </Card>
    </Scrollable>
  );
}
