import React from 'react';
import {StyleSheet, View, Image, Text, ViewStyle} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';

import {useApplication} from 'providers/context';
import {useAppState} from 'hooks/app-state';
import {Spacing} from 'components/atoms/layout';
import {Card} from 'components/atoms/card';
import {Heading} from 'components/atoms/heading';
import {Toast} from 'components/atoms/toast';
import {CheckInCard} from 'components/molecules/check-in-card';
import {Scrollable} from 'components/templates/scrollable';
import {colors, text} from 'theme';
import {usePermissions} from 'providers/permissions';
import {BubbleIcons} from 'assets/icons';

const symptomsHistoryIcons = {
  '1': require('assets/images/symptoms-history/1_temp.png'),
  '2': require('assets/images/symptoms-history/2_cough.png'),
  '3': require('assets/images/symptoms-history/3_shortness.png'),
  '4': require('assets/images/symptoms-history/4_nose.png')
};

export const SymptomsHistory = ({navigation}) => {
  const {t} = useTranslation();
  const {completedChecker, checks, verifyCheckerStatus} = useApplication();
  const [appState] = useAppState();
  const isFocused = useIsFocused();
  const {readPermissions} = usePermissions();

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
    <Scrollable safeArea={false} backgroundColor="#FAFAFA">
      {completedChecker && (
        <>
          <Toast
            color={`${colors.success}1A`}
            message={t('symptomsHistory:completed')}
            icon={
              <BubbleIcons.Cases width={24} height={24} color={colors.teal} />
            }
          />
          <Spacing s={16} />
        </>
      )}
      {!completedChecker && (
        <>
          <CheckInCard
            accessibilityRefocus
            accessibilityFocus
            onPress={() =>
              navigation.navigate('symptoms', {
                screen: 'symptoms.checker',
                params: {timestamp: Date.now()}
              })
            }
          />
          <Spacing s={20} />
        </>
      )}
      <Heading
        accessibilityRefocus
        accessibilityFocus
        text={t('symptomsHistory:title')}
      />
      <Card>
        {!checks.length && (
          <Text style={text.smallBold}>{t('checker:noresults')}</Text>
        )}
        {checks.map((check, index) => {
          const allSymptoms = Array.from(
            new Array(4),
            (_, index) => index + 1
          ).map((i) => ({
            index: i,
            questionId: t(`checker:question${i}id`),
            label: t(`checker:question${i}Label`)
          }));
          const symptoms = allSymptoms.filter(
            (s) => check.symptoms[s.questionId] === 1
          );
          const hasSymptoms = symptoms.length > 0;

          return (
            <View
              key={`check-${check.timestamp}`}
              style={
                checks.length > 1 && index < checks.length - 1 && styles.check
              }
              accessible
              accessibilityRole="text">
              <View style={styles.summary}>
                <View style={styles.row}>
                  <View style={styles.icon}>
                    {hasSymptoms ? (
                      <BubbleIcons.Cases width={32} height={32} />
                    ) : (
                      <BubbleIcons.Shield width={32} height={32} />
                    )}
                  </View>
                  <Text style={text.xlargeBlack}>{symptoms.length}</Text>
                  <Text>&nbsp;</Text>
                  <Text style={text.xsmallBoldOpacity70}>
                    {t(
                      `symptomsHistory:${
                        symptoms.length === 1 ? 'symptom' : 'symptoms'
                      }`
                    )}
                  </Text>
                </View>
                <Text style={text.xsmallBoldOpacity70}>
                  {format(new Date(Number(check.timestamp)), 'do MMMM')}
                </Text>
              </View>
              {symptoms.length > 0 &&
                symptoms.map(({index, label}) => {
                  return (
                    <View key={`symptom-${index}`} style={styles.row}>
                      <View style={[styles.icon, styles.iconDimensions]}>
                        <Image
                          accessibilityIgnoresInvertColors
                          style={styles.iconDimensions}
                          width={32}
                          height={32}
                          source={symptomsHistoryIcons[index.toString()]}
                        />
                      </View>
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

const rowStyle: ViewStyle = {
  height: 44,
  flexDirection: 'row',
  alignItems: 'center'
};

const styles = StyleSheet.create({
  check: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dot
  },
  summary: {
    ...rowStyle,
    flex: 1,
    justifyContent: 'space-between'
  },
  row: rowStyle,
  iconDimensions: {
    width: 32,
    height: 32
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
});
