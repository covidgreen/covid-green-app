import React, {forwardRef} from 'react';
import {View, Text, Platform} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';
import {Markdown} from 'components/atoms/markdown';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

export const NotAuthorized = forwardRef<any, {onboarding?: boolean}>(
  ({onboarding = false}, ref) => {
    const {t} = useTranslation();
    const exposure = useExposure();
    const nav = useNavigation();

    const onSetup = async () => {
      await exposure.askPermissions();
    };

    return (
      <>
        <Card padding={{h: 0, v: 0}}>
          <View style={sharedStyles.cardImageWarning}>
            <StateIcons.ErrorENS height={144} width={144} />
          </View>
          <Spacing s={12} />
          <View style={sharedStyles.messageWrapper}>
            <Text ref={ref} accessibilityRole="header" style={text.defaultBold}>
              {t(`closenessSensing:notAuthorised:${Platform.OS}:title`)}
            </Text>
            <Spacing s={20} />
            <Markdown style={{}}>
              {t(`closenessSensing:notAuthorised:${Platform.OS}:text`)}
            </Markdown>
            <Spacing s={24} />
            <View style={sharedStyles.buttonsWrapper}>
              <Button onPress={onSetup}>
                {t(`closenessSensing:notAuthorised:${Platform.OS}:setup`)}
              </Button>
            </View>
          </View>
        </Card>
        {onboarding && (
          <>
            <Spacing s={20} />
            <Button
              type="empty"
              onPress={() =>
                nav.reset({
                  index: 0,
                  routes: [{name: 'main'}]
                })
              }>
              {t('common:continue')}
            </Button>
          </>
        )}
      </>
    );
  }
);
