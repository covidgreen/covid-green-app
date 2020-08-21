import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';

import {Button} from 'components/atoms/button';
import {LearnHowItWorks} from 'components/views/tour/learn-how-it-works';
import {Markdown} from 'components/atoms/markdown';
import {ScreenNames} from 'navigation';
import {Scrollable} from 'components/templates/scrollable';
import {Spacing} from 'components/atoms/spacing';
import {styles} from './styles';

import GroupOfPeople from 'assets/icons/intro-visual.svg';
import {colors} from 'theme';
import {SPACING_HORIZONTAL} from 'constants/shared';

interface Content {
  title: string;
  list: string[];
}

export const Introduction: FC<any> = () => {
  const {t} = useTranslation();
  const nav = useNavigation();
  const content: Content[] = t('onboarding:introduction:blocks', {
    returnObjects: true
  });

  return (
    <Scrollable scrollStyle={style.page}>
      <View style={styles.fill}>
        {content.map(({title, list}, index) => (
          <View key={`c-${index}`} style={styles.block}>
            <View style={style.top}>
              <Text style={[styles.title, styles.introTitle]}>{title}</Text>
            </View>
            <GroupOfPeople width="100%" style={styles.groupOfPeople} />
            {list.map((item: string, l: number) => (
              <View
                key={`l-${l}`}
                style={[styles.list, styles.center, style.horizontal]}>
                <View style={styles.dot} />
                <View style={styles.listContent}>
                  <Text style={styles.text}>{item}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        <Markdown style={style.horizontal}>
          {t('onboarding:introduction:disclaimer')}
        </Markdown>
        <Spacing s={20} />
      </View>
      <View style={style.horizontal}>
        <Button onPress={() => nav.navigate(ScreenNames.Permissions)}>
          {t('onboarding:introduction:continueAction')}
        </Button>
        <Spacing s={12} />
        <LearnHowItWorks />
      </View>
      <Spacing s={30} />
    </Scrollable>
  );
};

const style = StyleSheet.create({
  page: {
    paddingHorizontal: 0,
    paddingTop: 0
  },
  top: {
    flex: 1,
    backgroundColor: colors.purple,
    paddingHorizontal: 30,
    paddingTop: 20
  },
  horizontal: {
    paddingHorizontal: SPACING_HORIZONTAL
  }
});
