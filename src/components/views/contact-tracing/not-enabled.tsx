import React, {FC} from 'react';
import {Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {StateIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {text} from 'theme';
import {Spacing} from 'components/atoms/layout';
import {styles} from '../get-started';
import {styles as cardStyles} from './active';

export const NotEnabled: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={[cardStyles.cardImage, {backgroundColor: '#ecdbe4'}]}>
        <StateIcons.ErrorENS height={144} width={144} />
      </View>
      <Spacing s={4} />
      <View style={styles.row}>
        <View style={cardStyles.messageWrapper}>
          <Text style={text.defaultBold}>
            {t('contactTracing:notEnabled:title')}
          </Text>
          <Spacing s={8} />
          <Text style={text.default}>
            {t('contactTracing:notEnabled:message')}
          </Text>
          <Spacing s={12} />
          <Button
            style={cardStyles.button}
            onPress={() =>
              navigation.navigate('contactTracingInformation', {embedded: true})
            }>
            {t('contactTracing:notEnabled:button')}
          </Button>
        </View>
      </View>
    </Card>
  );
};
