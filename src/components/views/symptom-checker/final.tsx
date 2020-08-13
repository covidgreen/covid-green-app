import React, {useState, useEffect, FC} from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';
import {useExposure} from 'react-native-exposure-notification-service';

import {useApplication} from 'providers/context';
import {useSettings} from 'providers/settings';
import {useAppState} from 'hooks/app-state';
import {useSymptomChecker} from 'hooks/symptom-checker';

import {Spacing, SingleRow} from 'components/atoms/layout';
import {Card} from 'components/atoms/card';
import {Heading} from 'components/atoms/heading';
import {CheckInCard} from 'components/molecules/check-in-card';
import {ResultCard} from 'components/molecules/result-card';
import {Scrollable} from 'components/templates/scrollable';

import {Symptom, SymptomRecord, SymptomsCheckResult} from 'constants/symptoms';
import {text, colors} from 'theme';
import {BubbleIcons} from 'assets/icons';

interface SymptomListItem {
  value: Symptom;
  label: string;
}

function countSymptoms(symptoms: SymptomRecord): number {
  return Object.values(symptoms).reduce((t: number, r: number) => t + r, 0);
}

export const CheckInFinal: FC<any> = ({route}) => {
  const [
    checkInResult,
    setCheckInResult
  ] = useState<SymptomsCheckResult | null>(null);

  const {t} = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [appState] = useAppState();

  const {ageRangeOptions, checkerThankYouText} = useSettings();
  const {
    user,
    completedChecker,
    checks,
    verifyCheckerStatus
  } = useApplication();
  const {readPermissions} = useExposure();

  useFocusEffect(
    React.useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }

      readPermissions();
      verifyCheckerStatus();
    }, [isFocused, appState, verifyCheckerStatus])
  );

  useEffect(() => {
    const {symptoms, feelingWell} = route.params?.feelingWell
      ? route.params
      : checks[0];
    let result: SymptomsCheckResult;

    const symptomsCount = countSymptoms(symptoms);
    if (!symptomsCount) {
      if (
        ageRangeOptions.find((g) => g.value === user?.ageRange && g.riskGroup)
      ) {
        result = 'riskGroup';
      } else {
        result = feelingWell
          ? 'noSymptomsFeelingWell'
          : 'noSymptomsNotFeelingWell';
      }
    } else {
      result = 'coronavirus';
    }
    setCheckInResult(result);
  }, []);

  return (
    <Scrollable safeArea={false} backgroundColor={colors.white}>
      {completedChecker && checkInResult && (
        <>
          <Heading
            accessibilityRefocus
            accessibilityFocus
            text={t('checker:results:title')}
          />
          <ResultCard
            message={checkerThankYouText[checkInResult]}
            buttonText={t('checker:results:viewLog')}
            onButtonPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {name: 'history', params: {feelingWell: true, symptoms: {}}}
                ]
              })
            }
            markdownProps={{
              style: {},
              warningList: true
            }}
          />
        </>
      )}
    </Scrollable>
  );
};
