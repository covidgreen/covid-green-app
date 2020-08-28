import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import PushNotification from 'react-native-push-notification';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {format, subDays} from 'date-fns';

import {ScreenNames} from 'navigation';

import {Card} from 'components/atoms/card';
import {Markdown} from 'components/atoms/markdown';
import {Spacing} from 'components/atoms/layout';
import {Scrollable} from 'components/templates/scrollable';

import {text, colors} from 'theme';
import {BubbleIcons, StateIcons} from 'assets/icons';
import {Button} from '../atoms/button';

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

export const CloseContactAlert: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const exposure = useExposure();
  const [closeContactDate, setCloseContactDate] = useState<string>('');

  useEffect(() => {
    async function getCloseContactDate() {
      const contacts = await exposure.getCloseContacts();
      console.log(contacts);
      if (contacts && contacts.length) {
        const exposureDate = subDays(
          new Date(Number(contacts[0].exposureAlertDate)),
          contacts[0].daysSinceLastExposure
        );
        setCloseContactDate(format(exposureDate, 'MMMM dd, yyyy'));
      }
    }
    getCloseContactDate();
  }, []);

  PushNotification.setApplicationIconBadgeNumber(0);

  return (
    <Scrollable>
      <Card padding={{h: 0, v: 0}}>
        <View style={styles.cardImage}>
          <StateIcons.ErrorPhone height={144} width={144} />
        </View>
        <View style={styles.messageWrapper}>
          <Markdown
            style={{backgroundColor: colors.white}}
            markdownStyles={markdownStyles}>
            {t('closeContactAlert:intro', {exposureDate: closeContactDate})}
          </Markdown>
          <Card
            icon={<BubbleIcons.Info width={56} height={56} />}
            onPress={() => navigation.navigate(ScreenNames.CloseContactInfo)}>
            <Text style={text.largeBold}>
              {t('closeContactAlert:infoCard')}
            </Text>
          </Card>
          <Spacing s={24} />
          <View style={styles.buttonsWrapper}>
            <Button
              onPress={() => navigation.navigate(ScreenNames.MyCovidAlerts)}>
              {t('common:ok:label')}
            </Button>
          </View>
        </View>
      </Card>
    </Scrollable>
  );
};

export const styles = StyleSheet.create({
  messageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20
  },
  cardImage: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#ecdbe4'
  },
  buttonsWrapper: {
    width: '100%'
  }
});
