import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';

import {Scrollable} from 'components/templates/scrollable';
import {Button} from 'components/atoms/button';
import {Spacing} from 'components/atoms/spacing';
import {ScreenNames} from 'navigation';
import {styles} from './styles';

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
            <Text style={styles.title}>{title}</Text>
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
      </View>
      <View>
        <Button onPress={() => nav.navigate(ScreenNames.Tour)} type="secondary">
          {t('onboarding:introduction:learnAction')}
        </Button>
        <Spacing s={12} />
        <Button onPress={() => nav.navigate(ScreenNames.Permissions)}>
          {t('onboarding:introduction:continueAction')}
        </Button>
      </View>
      <Spacing s={30} />
    </Scrollable>
  );
};
