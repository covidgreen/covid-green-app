import React, {FC} from 'react';
import {View, Text} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

export const NotAuthorized: FC = () => {
  const {t} = useTranslation();
  const exposure = useExposure();

  const onSetup = async () => {
    await exposure.askPermissions();
  };

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={sharedStyles.cardImageWarning}>
        <StateIcons.ErrorENS height={144} width={144} />
      </View>
      <Spacing s={12} />
      <View style={sharedStyles.messageWrapper}>
        <Text style={text.defaultBold}>
          {t('closenessSensing:notAuthorised:title')}
        </Text>
        <Spacing s={20} />
        <Text style={text.default}>
          {t('closenessSensing:notAuthorised:text')}
        </Text>
        <Spacing s={24} />
        <View style={sharedStyles.buttonsWrapper}>
          <Button onPress={onSetup}>
            {t('closenessSensing:notAuthorised:setup')}
          </Button>
        </View>
      </View>
    </Card>
  );
};
