import React, {forwardRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Card} from 'components/atoms/card';
import {colors, text} from 'theme';

interface CheckInCardProps {
  onPress?: () => void;
  accessibilityFocus?: boolean;
  accessibilityRefocus?: boolean;
  inChecker?: boolean;
}

export const CheckInCard = forwardRef<any, CheckInCardProps>(
  ({onPress, inChecker = false}, ref) => {
    const {t} = useTranslation();

    return (
      <Card ref={ref} onPress={onPress} padding={{r: 16}}>
        <View style={styles.row}>
          <View>
            {!inChecker && (
              <Text style={text.largeBold}>{t('checker:title')}</Text>
            )}
            <Text style={[text.largeBold, styles.symptoms]}>
              {t('welcome:letUsKnow')}
            </Text>
          </View>
        </View>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageSize: {
    width: 64,
    height: 64
  },
  symptoms: {
    color: colors.purple
  }
});
