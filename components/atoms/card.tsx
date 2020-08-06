import React, {FC} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  ImageRequireSource
} from 'react-native';

import {colors} from '../../constants/colors';
import {shadows} from '../../theme';

interface CardProps {
  type?: 'warning';
  padding?: {
    h?: number;
    v?: number;
    r?: number;
  };
  icon?: {
    w: number;
    h: number;
    source: ImageRequireSource;
  };
  onPress?: () => void;
}

export const Card: FC<CardProps> = ({
  type,
  padding: {h = 16, v = 16, r} = {},
  icon,
  onPress,
  children
}) => {
  const padding = {
    paddingHorizontal: h,
    paddingVertical: v,
    ...(r !== undefined && {paddingRight: r})
  };
  const cardContent = (
    <View
      style={[styles.card, type === 'warning' && styles.cardWarning, padding]}>
      {icon && (
        <View style={styles.icon}>
          <Image
            accessibilityIgnoresInvertColors
            style={{width: icon.w, height: icon.h}}
            width={icon.w}
            height={icon.h}
            source={icon.source}
          />
        </View>
      )}
      <View style={styles.childrenView}>{children}</View>
      {onPress && (
        <View style={styles.row}>
          <Image
            accessibilityIgnoresInvertColors
            style={styles.arrowIcon}
            {...styles.arrowIcon}
            source={require('../../assets/images/arrow-right/teal.png')}
          />
        </View>
      )}
    </View>
  );
  return onPress ? (
    <TouchableWithoutFeedback accessibilityRole="button" onPress={onPress}>
      {cardContent}
    </TouchableWithoutFeedback>
  ) : (
    cardContent
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    ...shadows.default,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardWarning: {
    borderWidth: 2,
    borderColor: colors.red
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  arrowIcon: {
    width: 24,
    height: 24
  },
  childrenView: {
    flex: 1
  }
});
