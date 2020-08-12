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

export const SymptomsHistory: FC<any> = ({route}) => {
  const [
    checkInResult,
    setCheckInResult
  ] = useState<SymptomsCheckResult | null>(null);

  const {t} = useTranslation();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [appState] = useAppState();
  const {getNextScreen} = useSymptomChecker();

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
        result =
          checks[0] && countSymptoms(checks[0].symptoms || {}) > 0
            ? 'recovered'
            : feelingWell
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
            markdownProps={{
              style: {},
              warningList: true
            }}
            buttonText={t('checker:results:stopTheSpread')}
            onButtonPress={() =>
              Linking.openURL(
                'https://www.health.pa.gov/topics/disease/coronavirus/Pages/Stop-the-Spread.aspx'
              )
            }
          />
        </>
      )}
      {!completedChecker && (
        <CheckInCard
          accessibilityRefocus
          accessibilityFocus
          onPress={() =>
            navigation.navigate('symptoms', {
              screen: getNextScreen()
            })
          }
        />
      )}
      <Spacing s={20} />
      <Heading
        accessibilityRefocus
        accessibilityFocus
        text={t('symptomsHistory:title')}
      />
      <Card>
        {!checks.length && (
          <Text style={text.smallBold}>{t('checker:noresults')}</Text>
        )}
        {checks.map((check, idx) => {
          const record = check.symptoms as SymptomRecord;
          const symptomsList = (Object.keys(record) as Array<
            keyof typeof record
          >).reduce((items: SymptomListItem[], symptom) => {
            if (!check.symptoms[symptom]) {
              return items;
            }
            const combined: SymptomListItem[] = [
              ...items,
              {value: symptom, label: t(`checker:symptoms:${symptom}`)}
            ];
            return combined;
          }, [] as SymptomListItem[]);

          return (
            <View
              key={`check-${check.timestamp}`}
              style={
                checks.length > 1 &&
                idx < checks.length - 1 &&
                styles.checkInWrapper
              }
              accessible
              accessibilityRole="text">
              <View style={styles.summary}>
                <View style={styles.icon}>
                  {symptomsList.length > 0 ? (
                    <BubbleIcons.Symptom width={32} height={32} />
                  ) : (
                    <BubbleIcons.Shield width={32} height={32} />
                  )}
                </View>
                {symptomsList.length === 1 ? (
                  <Text style={text.xsmallBoldOpacity70}>
                    {symptomsList[0].label}
                  </Text>
                ) : (
                  <SingleRow>
                    <Text style={text.xlargeBlack}>{symptomsList.length}</Text>
                    <Text>&nbsp;</Text>
                    <Text style={text.xsmallBoldOpacity70}>
                      {t('symptomsHistory:symptoms')}
                    </Text>
                  </SingleRow>
                )}
                <View style={styles.date}>
                  <Text style={text.xsmallBoldOpacity70}>
                    {format(new Date(Number(check.timestamp)), 'do MMMM')}
                  </Text>
                </View>
              </View>
              {symptomsList.length > 1 &&
                symptomsList.map(({value, label}) => {
                  return (
                    <View key={`symptom-${value}`} style={styles.symptom}>
                      <Text style={text.xsmallBoldOpacity70}>{label}</Text>
                    </View>
                  );
                })}
            </View>
          );
        })}
      </Card>
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  checkInWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dot
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  icon: {
    marginRight: 12
  },
  date: {
    flex: 1,
    alignItems: 'flex-end'
  },
  symptom: {
    marginLeft: 32 + 12,
    marginVertical: 8
  }
});
