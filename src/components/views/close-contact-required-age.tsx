import React, {FC} from 'react';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Spacing} from 'components/atoms/layout';
import {Card} from 'components/atoms/card';
import {Scrollable} from 'components/templates/scrollable';

import {text} from 'theme';

export const CloseContactRequiredAge: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Scrollable heading={t('closeContact:requiredAge:title')}>
      <Spacing s={48} />
      <Card
        padding={{h: 20, v: 20, r: 16}}
        onPress={() => navigation.navigate('callBack')}>
        <Text style={text.largeBlack}>{t('closeContact:requiredAge:yes')}</Text>
      </Card>
      <Spacing s={16} />
      <Card
        padding={{h: 20, v: 20, r: 16}}
        onPress={() => navigation.navigate('closeContactUnderAge')}>
        <Text style={text.largeBlack}>{t('closeContact:requiredAge:no')}</Text>
      </Card>
    </Scrollable>
  );
};
