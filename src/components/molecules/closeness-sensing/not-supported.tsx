import React, {FC} from 'react';
import {View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

export const NotSupported: FC = () => {
  const {t} = useTranslation();

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={sharedStyles.cardImageWarning}>
        <StateIcons.ErrorUpgrade height={144} width={144} />
      </View>
      <Spacing s={12} />
      <View style={sharedStyles.messageWrapper}>
        <Text style={text.defaultBold}>
          {t('closenessSensing:notSupported:title')}
        </Text>
        <Spacing s={20} />
        <Text style={text.default}>
          {t('closenessSensing:notSupported:text')}
        </Text>
      </View>
    </Card>
  );
};
