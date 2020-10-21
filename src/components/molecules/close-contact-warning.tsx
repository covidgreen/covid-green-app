import React, {forwardRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {covidAlertReset} from 'navigation';

import {Card} from 'components/atoms/card';

import {colors, text} from 'theme';
import {StateIcons} from 'assets/icons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {pluralize} from 'services/i18n/common';

export const CloseContactWarning = forwardRef<TouchableWithoutFeedback>(
  (props, ref) => {
    const {t, i18n} = useTranslation();
    const navigation = useNavigation();
    const {contacts} = useExposure();

    return (
      <Card
        ref={ref}
        padding={{h: 10, r: 16}}
        onPress={() => navigation.reset(covidAlertReset)}
        type="warning">
        <View style={styles.row}>
          <StateIcons.ExposureAlert
            width={40}
            height={40}
            color={colors.white}
          />
          <Text style={styles.notice}>
            {t(
              'closeContactWarn:notice',
              pluralize(contacts ? contacts.length : 0, i18n.language)
            )}
          </Text>
        </View>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notice: {
    ...text.defaultBold,
    color: colors.white,
    marginStart: 10,
    marginEnd: 35,
    flex: 1
  }
});
