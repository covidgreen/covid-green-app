import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';

import {useFocusRef} from 'hooks/accessibility';
import {SPACING_HORIZONTAL} from 'constants/shared';

import {Button} from 'components/atoms/button';
import {LearnHowItWorks} from 'components/views/tour/learn-how-it-works';
import {Markdown} from 'components/atoms/markdown';
import {ScreenNames} from 'navigation';
import {Scrollable} from 'components/templates/scrollable';
import {Spacing} from 'components/atoms/spacing';

import {colors, text} from 'theme';
import Step1 from 'assets/icons/how-it-works/howitworks1.svg';

interface Content {
  title: string;
  list: string[];
}

import {styles} from './styles';

export const Introduction: FC<any> = () => {
  const {t} = useTranslation();
  const nav = useNavigation();
  const [ref] = useFocusRef({accessibilityRefocus: true});

  const content: Content[] = t('onboarding:introduction:blocks', {
    returnObjects: true
  });

  return (
    <>
      {/**
       * In order to prevent scrollign the purple scollview over a gray background,
       * we're going to add a view that has a purple background and occupies hald of the screen
       * (should be enough to make the scroll behave correctly)
       */}
      <View style={style.topHalfPage} />
      <Scrollable scrollStyle={style.page}>
        <View style={styles.fill}>
          <View
            ref={ref}
            accessible
            accessibilityRole="header"
            accessibilityLabel={`${t('common:longName')}, ${content[0].title}`}
            style={[style.top, styles.relative, styles.index1]}>
            <Text
              maxFontSizeMultiplier={1.7}
              style={[style.title, styles.introTitle]}>
              {content[0].title}
            </Text>
          </View>
          <View style={styles.relative}>
            <View style={[styles.sloped, styles.index0]} />
            <Step1
              width={213}
              height={145}
              style={[styles.slopeIcon, styles.index2]}
            />
          </View>
          {content.map(({list}, index) => (
            <View
              key={`c-${index}`}
              style={[
                styles.block,
                index === content.length - 1 && style.noBottomMargin
              ]}>
              {list.map((item: string, l: number) => (
                <View
                  key={`l-${l}`}
                  style={[
                    style.list,
                    styles.center,
                    style.horizontal,
                    l === list.length - 1 && style.noBottomMargin
                  ]}>
                  <View style={styles.dot} />
                  <View style={styles.listContent}>
                    <Text maxFontSizeMultiplier={2} style={styles.text}>
                      {item}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
          <Spacing s={12} />
          <Markdown style={style.horizontal}>
            {t('onboarding:introduction:disclaimer')}
          </Markdown>
          <Spacing s={4} />
        </View>
        <View style={style.horizontal}>
          <Button onPress={() => nav.navigate(ScreenNames.Permissions)}>
            {t('onboarding:introduction:continueAction')}
          </Button>
          <Spacing s={12} />
          <LearnHowItWorks />
        </View>
        <Spacing s={50} />
      </Scrollable>
    </>
  );
};

const style = StyleSheet.create({
  list: {
    flexDirection: 'row',
    marginBottom: 4
  },
  title: {
    ...text.largeBold
  },
  topHalfPage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.purple,
    height: '50%'
  },
  page: {
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: colors.background,
    paddingBottom: 100
  },
  top: {
    flex: 1,
    backgroundColor: colors.purple,
    paddingHorizontal: 30,
    paddingTop: 20
  },
  horizontal: {
    paddingHorizontal: SPACING_HORIZONTAL
  },
  noBottomMargin: {
    marginBottom: 0
  }
});
