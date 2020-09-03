import React, {FC, useRef} from 'react';
import {Text, ScrollView, View, Image, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import {styles as OStyles} from './get-started';

import {Spacing, Separator} from 'components/atoms/layout';
import {Heading} from 'components/atoms/heading';
import {Link} from 'components/atoms/link';
import {Markdown} from 'components/atoms/markdown';
import {PhoneNumber} from 'components/organisms/phone-number';
import {text} from 'theme';
import {saveMetric, METRIC_TYPES} from 'services/api';
import {useExposure} from 'react-native-exposure-notification-service';
import {KeyboardScrollable} from 'components/templates/keyboard-scrollable';

const CallbackImage = require('assets/images/callback/image.png');

interface FollowUpCallProps {
  navigation: any;
  route: any;
}

export const FollowUpCall: FC<FollowUpCallProps> = ({navigation, route}) => {
  const {t} = useTranslation();
  const {configure} = useExposure();
  const scrollViewRef = useRef<ScrollView>(null);

  const gotoDashboard = (optin = false) => {
    if (optin) {
      saveMetric({event: METRIC_TYPES.CALLBACK_OPTIN});
    }

    if (route && route.params && route.params.embedded) {
      return navigation.popToTop();
    }

    navigation.reset({
      index: 0,
      routes: [{name: 'main'}]
    });
  };

  return (
    <KeyboardScrollable scrollViewRef={scrollViewRef}>
      <View style={OStyles.row}>
        <View style={OStyles.image}>
          <Image
            accessibilityIgnoresInvertColors
            source={CallbackImage}
            style={styles.image}
          />
        </View>
        <View style={styles.titleView}>
          <Heading lineWidth={75} text={t('followUpCall:title')} />
          <Markdown>{t('followUpCall:intro')}</Markdown>
        </View>
      </View>
      <Spacing s={12} />
      <Text style={text.default}>{t('followUpCall:note')}</Text>
      <Separator />
      <PhoneNumber
        buttonLabel={t('followUpCall:optIn')}
        onSuccess={() => {
          configure();
          gotoDashboard(true);
        }}
      />
      <Spacing s={24} />
      <Link align="center" onPress={gotoDashboard}>
        {t('followUpCall:noThanks')}
      </Link>
    </KeyboardScrollable>
  );
};

const styles = StyleSheet.create({
  image: {
    marginRight: -OStyles.container.paddingRight,
    alignSelf: 'flex-end'
  },
  titleView: {
    ...OStyles.intro,
    paddingTop: 20
  }
});
