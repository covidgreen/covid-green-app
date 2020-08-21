import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';

import {Button} from 'components/atoms/button';
import {LearnHowItWorks} from 'components/views/tour/learn-how-it-works';
import {Markdown} from 'components/atoms/markdown';
import {ScreenNames} from 'navigation';
import {Scrollable} from 'components/templates/scrollable';
import {Spacing} from 'components/atoms/spacing';
import {styles} from './styles';

import GroupOfPeople from 'assets/icons/how-it-works/howitworks1.svg';

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
    <Scrollable>
      <Spacing s={10} />
      <View style={styles.fill}>
        {content.map(({title, list}, index) => (
          <View key={`c-${index}`} style={styles.block}>
            <Text style={[styles.title, styles.introTitle]}>{title}</Text>
            <GroupOfPeople
              width={213}
              height={145}
              style={styles.groupOfPeople}
            />
            {list.map((item: string, l: number) => (
              <View key={`l-${l}`} style={[styles.list, styles.center]}>
                <View style={styles.dot} />
                <View style={styles.listContent}>
                  <Text style={styles.text}>{item}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        <Markdown>{t('onboarding:introduction:disclaimer')}</Markdown>
        <Spacing s={20} />
      </View>
      <View>
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
