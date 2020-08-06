import React, {FC} from 'react';
import {Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Spacing} from '../atoms/spacing';
import {Button} from '../atoms/button';
import {ResponsiveImage} from '../atoms/responsive-image';

import {text} from '../../theme';
import {PinnedBottom} from '../templates/pinned';

export const Sorry: FC<any> = ({navigation}) => {
  const {t} = useTranslation();

  return (
    <PinnedBottom heading={t('sorry:title')}>
      <ResponsiveImage
        h={150}
        source={require('../../assets/images/permissions/permissions-5.png')}
      />
      <Spacing s={16} />
      <Text style={text.default}>{t('sorry:info')}</Text>
      <Button onPress={() => navigation.navigate('yourData')}>
        {t('sorry:back')}
      </Button>
    </PinnedBottom>
  );
};
