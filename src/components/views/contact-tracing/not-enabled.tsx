import React, {FC} from 'react';
import {Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {ResponsiveImage} from 'components/atoms/responsive-image';
import {Spacing} from 'components/atoms/layout';
import {text, colors} from 'theme';
import {Toast} from 'components/atoms/toast';

export const NotEnabled: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Card padding={{v: 12}}>
      <ResponsiveImage
        h={150}
        source={require('assets/images/phone/not-active.png')}
      />
      <Spacing s={8} />
      <Toast
        color={colors.red}
        message={t('contactTracing:notEnabled:title')}
        icon={require('assets/images/alert/alert.png')}
      />
      <Spacing s={16} />
      <Text style={text.default}>{t('contactTracing:notEnabled:message')}</Text>
      <Spacing s={12} />
      <Button
        onPress={() =>
          navigation.navigate('contactTracingInformation', {embedded: true})
        }>
        {t('contactTracing:notEnabled:button')}
      </Button>
    </Card>
  );
};
