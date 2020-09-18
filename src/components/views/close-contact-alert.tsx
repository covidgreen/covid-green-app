import React, {FC, useEffect} from 'react';
import {StyleSheet, View, Linking} from 'react-native';
import {
  CloseContact,
  useExposure
} from 'react-native-exposure-notification-service';
import PushNotification from 'react-native-push-notification';
import {useTranslation} from 'react-i18next';
import {format, Locale, subDays} from 'date-fns';

import {Card} from 'components/atoms/card';
import {Markdown} from 'components/atoms/markdown';
import {Spacing} from 'components/atoms/layout';
import {CallCard} from 'components/molecules/call-card';
import {Scrollable} from 'components/templates/scrollable';

import {getDateLocaleOptions} from 'services/i18n/date';
import {text, colors} from 'theme';
import {StateIcons} from 'assets/icons';

import {renderListBullet} from './close-contact-info';
import { Loading } from './loading';
import Spinner from 'react-native-loading-spinner-overlay';

const markdownStyles = {
  text: {
    ...text.large,
    flexWrap: 'wrap'
  },
  strong: {
    ...text.largeBold
  }
};

interface DateLocale {
  locale: Locale;
}

const getContactDate = (
  contacts: CloseContact[] | undefined,
  dateLocale: DateLocale
): string => {
  if (!contacts || !contacts.length) {
    return '';
  }

  const closeContact = contacts[0];

  const exposureDate = subDays(
    new Date(Number(closeContact.exposureAlertDate)),
    closeContact.daysSinceLastExposure
  );

  return format(exposureDate, 'MMMM d, yyyy', dateLocale);
};

export const CloseContactAlert: FC = () => {
  const {t, i18n} = useTranslation();
  const {contacts, getCloseContacts, initialised} = useExposure();

  PushNotification.setApplicationIconBadgeNumber(0);

  // getCloseContacts() asyncronously updates RNENS's contacts state.
  // If we were showing old cached data, it'll quickly re-render showing up to date data
  useEffect(() => {
    getCloseContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialised]);

  const closeContactDate = getContactDate(contacts, getDateLocaleOptions(i18n));

  const appIsLoading = !closeContactDate && !initialised;

  return (
    <Scrollable>
      <Spinner animation="fade" visible={appIsLoading} />
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
        </View>
      </Card>
      <Spacing s={24} />
      <Markdown style={styles.mdTop}>{t('closeContactAlert:info')}</Markdown>
      <Markdown style={styles.md} renderListBullet={renderListBullet}>
        {t('closeContactInfo:list')}
      </Markdown>
      <CallCard
        onPress={() => Linking.openURL('tel:18332084159')}
        message={t('checker:results:callHelp')}
      />
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
  mdTop: {
    marginBottom: 0
  },
  md: {
    marginBottom: 32
  }
});
