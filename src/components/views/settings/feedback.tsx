import React, {useState} from 'react';
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
import {PinnedBottom} from 'components/templates/pinned';

import {getReadableVersion, getModel} from 'react-native-device-info';
import {
  useExposure,
  StatusState,
  PermissionStatus
} from 'react-native-exposure-notification-service';
import {Card} from 'components/atoms/card';
import {SelectList} from 'components/atoms/select-list';
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
  const [value1, setValue] = useState<string>('');
  const onSubmit = (subject: string) =>
    Linking.openURL(
      `mailto:covidalertny@health.ny.gov?subject=${t(
        `submitFeedback:${subject}`
      )} for COVID Alert NY: Version ${version}&body=





Please do not remove. This info helps the technical team assist you
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
ENS Details:
  can support ENS: ${canSupport ? 'yes' : 'no'},
  supported: ${supported ? 'yes' : 'no'},
  status state: ${status.state}
  status type: ${status.type || []},
  enabled: ${enabled ? 'yes' : 'no'},
  exposure permission: ${permissions.exposure.status},
  notifications permission: ${permissions.notifications.status},
  authorised: ${isAuthorised ? 'yes' : 'no'},
  amount of closeness cases: ${contacts?.length || 0}
`
    );
  return (
    <PinnedBottom heading={t('submitFeedback:title')}>
      <Text style={styles.intro}>{t('submitFeedback:intro')}</Text>
      <Spacing s={55} />
      <SelectList
        items={[
          {
            value: 'enhancement',
            label: t('submitFeedback:enhancement')
          },
          {
            value: 'report',
            label: t('submitFeedback:report')
          },
          {
            value: 'feedback',
            label: t('submitFeedback:feedback')
          }
        ]}
        onItemSelected={(value) => setValue(value)}
        selectedValue={value1}
      />
      <Card padding={{h: 0, v: 4, r: 0}} style={styles.card}>
        <TouchableWithoutFeedback onPress={() => onSubmit(value1)}>
          <View style={styles.item}>
            <Text style={styles.text}>Submit</Text>
          </View>
        </TouchableWithoutFeedback>
      </Card>
    </PinnedBottom>
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
