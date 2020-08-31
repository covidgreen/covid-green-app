import React, {FC, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  findNodeHandle,
  AccessibilityInfo
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

import {Card} from 'components/atoms/card';
import {colors, text} from 'theme';

interface CheckInCardProps {
  onPress?: () => void;
  accessibilityFocus?: boolean;
  accessibilityRefocus?: boolean;
  inChecker?: boolean;
}

export const CheckInCard: FC<CheckInCardProps> = ({
  onPress,
  accessibilityFocus = false,
  accessibilityRefocus = false,
  inChecker = false
}) => {
  const {t} = useTranslation();
  const ref = useRef<any>();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (ref.current && accessibilityFocus) {
      const tag = findNodeHandle(ref.current);
      if (tag) {
        setTimeout(
          () => ref.current && AccessibilityInfo.setAccessibilityFocus(tag),
          250
        );
      }
    }
  }, []);

  useFocusEffect(() => {
    if (isFocused && accessibilityRefocus && ref.current) {
      const tag = findNodeHandle(ref.current);
      if (tag) {
        setTimeout(
          () => ref.current && AccessibilityInfo.setAccessibilityFocus(tag),
          250
        );
      }
    }
  });

  return (
    <Card onPress={onPress} padding={{r: 16}}>
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
};

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
