import React from 'react';
import {
  View,
  Text,
  Linking,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Spacing} from 'components/atoms/layout';
import {Scrollable} from 'components/templates/scrollable';

import {getReadableVersion, getModel} from 'react-native-device-info';
import {
  useExposure,
  StatusState,
  PermissionStatus
} from 'react-native-exposure-notification-service';
import {Card} from 'components/atoms/card';
import {text} from 'theme';

export const Feedback = () => {
  const {t} = useTranslation();

  const {
    canSupport,
    status,
    enabled,
    permissions,
    supported,
    isAuthorised,
    contacts
  } = useExposure();
  const version = getReadableVersion();
  const openEmail = (subject: string) =>
    Linking.openURL(
      `mailto:covidalertny@health.ny.gov?subject=${t(
        `submitFeedback:${subject}`
      )} for COVID Alert NY: Version ${version}&body=





App Version: ${version}
Device: ${getModel()}
OS version: ${Platform.OS} ${Platform.Version}
Closeness sensing status: ${
        !enabled ||
        status.state !== StatusState.active ||
        permissions.notifications.status !== PermissionStatus.Allowed
          ? 'inactive'
          : 'active'
      }
Notifications: ${
        permissions.notifications.status === PermissionStatus.Allowed
          ? 'Allowed'
          : 'Not Allowed'
      }
ENS Details: ${JSON.stringify({
        c: canSupport,
        s: supported,
        st: status,
        e: enabled,
        p: {
          exposure: permissions.exposure.status,
          notifications: permissions.notifications.status
        },
        a: isAuthorised,
        cn: contacts?.length
      })}`
    );
  return (
    <Scrollable heading={t('submitFeedback:title')}>
      <Text style={styles.intro}>{t('submitFeedback:intro')}</Text>
      <Spacing s={20} />
      <Card padding={{h: 0, v: 4, r: 0}} style={styles.card}>
        <TouchableWithoutFeedback onPress={() => openEmail('enhancement')}>
          <View style={styles.item}>
            <Text style={styles.text}>{t('submitFeedback:enhancement')}</Text>
          </View>
        </TouchableWithoutFeedback>
      </Card>
      <Spacing s={14} />
      <Card padding={{h: 0, v: 4, r: 0}} style={styles.card}>
        <TouchableWithoutFeedback onPress={() => openEmail('report')}>
          <View style={styles.item}>
            <Text style={styles.text}>{t('submitFeedback:report')}</Text>
          </View>
        </TouchableWithoutFeedback>
      </Card>
      <Spacing s={14} />
      <Card padding={{h: 0, v: 4, r: 0}} style={styles.card}>
        <TouchableWithoutFeedback onPress={() => openEmail('feedback')}>
          <View style={styles.item}>
            <Text style={styles.text}>{t('submitFeedback:feedback')}</Text>
          </View>
        </TouchableWithoutFeedback>
      </Card>
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12
  },
  text: {
    flex: 1,
    ...text.defaultBold
  },
  intro: {
    flex: 1,
    ...text.default
  }
});
