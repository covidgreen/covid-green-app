import React, {FC} from 'react';
import {Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {ResponsiveImage} from 'components/atoms/responsive-image';
import {Spacing} from 'components/atoms/spacing';
import {text} from 'theme';
import {Basic} from 'components/templates/basic';

export const Under16: FC = () => {
  const {t} = useTranslation();

  return (
    <Basic heading={t('underAge:title')}>
      <ResponsiveImage
        h={150}
        source={require('assets/images/under16-1/image.png')}
      />
      <Spacing s={20} />
      <Text style={text.default}>{t('underAge:notice')}</Text>
    </Basic>
  );
};
