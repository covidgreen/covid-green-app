import React, {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';
import {useExposure} from 'react-native-exposure-notification-service';

import {useApplication} from 'providers/context';
import {useAppState} from 'hooks/app-state';

import {Spacing, SingleRow} from 'components/atoms/layout';
import {Card} from 'components/atoms/card';
import {Heading} from 'components/atoms/heading';
import {Scrollable} from 'components/templates/scrollable';

import {Symptom, SymptomRecord} from 'constants/symptoms';
import {text, colors} from 'theme';
import {BubbleIcons} from 'assets/icons';

interface SymptomListItem {
  value: Symptom;
  label: string;
}

export const SymptomsHistory: FC<any> = () => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const [appState] = useAppState();

  const {checks, verifyCheckerStatus} = useApplication();
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

  return (
    <Scrollable
      headingShort
      safeArea={false}
      backgroundColor={colors.background}>
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
                <SingleRow>
                  <Text style={text.xlargeBlack}>{symptomsList.length}</Text>
                  <Text>&nbsp;</Text>
                  <Text style={text.defaultBold}>
                    {t('symptomsHistory:symptoms', {
                      count: symptomsList.length
                    })}
                  </Text>
                </SingleRow>
                <View style={styles.date}>
                  <Text style={text.default}>
                    {format(new Date(Number(check.timestamp)), 'do MMMM')}
                  </Text>
                </View>
              </View>
              {!!symptomsList.length &&
                symptomsList.map(({value, label}) => {
                  return (
                    <View key={`symptom-${value}`} style={styles.symptom}>
                      <Text style={text.defaultBold}>{label}</Text>
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
