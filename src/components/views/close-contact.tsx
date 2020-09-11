import React, {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import {useTranslation} from 'react-i18next';

import {useCallBackStatus} from 'hooks/call-back-status';

import {Spacing} from 'components/atoms/layout';
import {Card} from 'components/atoms/card';
import {Markdown} from 'components/atoms/markdown';
import {Scrollable} from 'components/templates/scrollable';

import {text} from 'theme';
import {BubbleIcons} from 'assets/icons';

const markdownStyles = {
  text: {
    ...text.large,
    flexWrap: 'wrap'
  },
  strong: {
    ...text.largeBold
  },
  block: {
    marginBottom: 32
  }
};

export const CloseContact: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {callBackIsQueued} = useCallBackStatus();

  PushNotification.setApplicationIconBadgeNumber(0);

  return (
    <Scrollable heading={t('closeContact:title')}>
      <Markdown markdownStyles={markdownStyles}>
        {t('closeContact:intro')}
      </Markdown>
      {callBackIsQueued ? (
        <>
          <Text style={text.largeBold}>
            {t('closeContact:callQueued:title')}
          </Text>
          <Spacing s={12} />
          <Text style={text.default}>{t('closeContact:callQueued:text')}</Text>
        </>
      ) : (
        <>
          <Card
            icon={<BubbleIcons.PhoneCall width={56} height={56} />}
            onPress={() => navigation.navigate('closeContactRequiredAge')}>
            <Text style={text.largeBlack}>
              {t('closeContact:callBackCard')}
            </Text>
          </Card>
        </>
      )}
      <Spacing s={20} />
      <Card
        icon={<BubbleIcons.Info width={56} height={56} />}
        onPress={() => navigation.navigate('closeContactInfo')}>
        <Text style={text.largeBold}>{t('closeContact:infoCard')}</Text>
      </Card>
    </Scrollable>
  );
};
