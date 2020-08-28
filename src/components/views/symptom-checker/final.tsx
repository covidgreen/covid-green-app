import React, {useState, useEffect, FC} from 'react';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation
} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useExposure} from 'react-native-exposure-notification-service';

import {useApplication} from 'providers/context';
import {useDbText} from 'providers/settings';
import {useAppState} from 'hooks/app-state';
import {Heading} from 'components/atoms/heading';
import {ResultCard} from 'components/molecules/result-card';
import {Scrollable} from 'components/templates/scrollable';

import {SymptomRecord, SymptomsCheckResult} from 'constants/symptoms';
import {colors} from 'theme';
import {CoronavirusCard} from 'components/molecules/coronavirus-card';
import {ScreenNames} from 'navigation';

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

  const {checkerThankYouText} = useDbText();
  const {completedChecker, checks, verifyCheckerStatus} = useApplication();
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
    result =
      !symptomsCount || feelingWell ? 'noSymptomsFeelingWell' : 'coronavirus';

    setCheckInResult(result);
  }, []);

  return (
    <Scrollable
      safeArea={false}
      headingShort
      backgroundColor={colors.background}>
      {completedChecker && checkInResult && (
        <>
          <Heading
            accessibilityRefocus
            accessibilityFocus
            text={t('checker:results:title')}
          />
          <ResultCard
            message={
              checkInResult !== 'coronavirus'
                ? checkerThankYouText[checkInResult]
                : undefined
            }
            buttonText={t('checker:results:viewLog')}
            markdownStyle={styles.markdown}
            onButtonPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ScreenNames.History,
                    params: {feelingWell: true, symptoms: {}}
                  }
                ]
              })
            }
            markdownProps={{
              style: {},
              warningList: true
            }}>
            {checkInResult === 'coronavirus' && <CoronavirusCard />}
          </ResultCard>
        </>
      )}
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  markdown: {backgroundColor: colors.white}
});
