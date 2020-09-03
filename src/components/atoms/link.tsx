import React, {ReactNode} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  ViewStyle
} from 'react-native';

import {text as textStyles, colors} from 'theme';

interface LinkProps {
  a11yRole?: 'link' | 'button';
  style?: ViewStyle;
  Icon?: ReactNode;
  text?: string;
  align?: 'left' | 'right' | 'center';
  large?: boolean;
  onPress: () => void;
  ref?: any;
}

export const Link: React.FC<LinkProps> = React.forwardRef(
  (
    {
      a11yRole = 'button',
      style,
      Icon,
      text,
      align = 'left',
      large = false,
      onPress,
      children
    },
    ref: any
  ) => {
    const linkText = text || children;
    return (
      <View style={[styles.container, style]}>
        {Icon}
        <TouchableWithoutFeedback
          ref={ref}
          accessibilityRole={a11yRole}
          onPress={onPress}>
          <Text
            onPress={() => onPress}
            style={[
              styles.text,
              {textAlign: align},
              large && styles.textLarge
            ]}>
            {linkText}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  text: {
    flex: 1,
    ...textStyles.default,
    color: colors.purple
  },
  textLarge: {
    ...textStyles.largeBold,
    color: colors.purple
  }
});
