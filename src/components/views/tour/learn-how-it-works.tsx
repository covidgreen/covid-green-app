import React, {FC} from 'react';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {text} from 'theme';
import {Card} from 'components/atoms/card';
import {ScreenNames} from 'navigation';
import {useTranslation} from 'react-i18next';

export const LearnHowItWorks: FC = () => {
  const {t} = useTranslation();
  const nav = useNavigation();

  return (
    <Card
      padding={{h: 20, v: 16}}
      onPress={() => nav.navigate(ScreenNames.Tour)}>
      <Text style={text.defaultBold}>
        {t('onboarding:introduction:learnAction')}
      </Text>
    </Card>
  );
};
