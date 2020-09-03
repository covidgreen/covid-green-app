import React, {forwardRef} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {colors, text} from 'theme';
import {Card} from 'components/atoms/card';
import {StateIcons} from 'assets/icons';
import {ScreenNames} from 'navigation';

export const AlertInformation = forwardRef<TouchableWithoutFeedback>(
  (props, ref) => {
    const {t} = useTranslation();
    const navigation = useNavigation();

    return (
      <Card
        ref={ref}
        padding={{h: 10, r: 16}}
        onPress={() => navigation.navigate(ScreenNames.MyCovidAlerts)}
        type="info"
        arrowColor={colors.black}>
        <View style={styles.row}>
          <StateIcons.ExposureUnset
            width={40}
            height={40}
            color={colors.black}
          />
          <Text style={styles.notice}>
            {t('alertsUnavailablePrompt:title')}
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
    color: colors.black,
    paddingRight: 35,
    paddingLeft: 10
  }
});
