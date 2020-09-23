import React, {useState} from 'react';
import {
  StyleSheet,
  ViewStyle,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import {text, scale, colors} from 'theme';

export type ButtonType = 'default' | 'secondary' | 'empty' | 'danger' | 'link';

interface ButtonProps {
  type?: ButtonType;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  width?: number | string;
  fontSizeMultiplier?: number;
  children: React.ReactNode;
}

const dimensions = Dimensions.get('screen');

export const Button: React.FC<ButtonProps> = ({
  type = 'default',
  disabled = false,
  onPress,
  style,
  width,
  fontSizeMultiplier,
  children
}) => {
  const [pressed, setPressed] = useState(false);

  const buttonColors =
    type === 'empty'
      ? colors.buttons.empty
      : type === 'danger'
      ? colors.buttons.danger
      : type === 'secondary'
      ? colors.buttons.secondary
      : type === 'link'
      ? colors.buttons.link
      : colors.buttons.default;

  let backgroundColor = buttonColors.shadow;
  let foregroundColor = buttonColors.background;
  let textColor = buttonColors.text;

  if (pressed) {
    foregroundColor = backgroundColor;
  } else if (disabled) {
    // this should be enough for the moment
    backgroundColor += '66';
    foregroundColor += '66';
    if (type === 'empty') {
      backgroundColor = colors.gray;
      foregroundColor = colors.gray;
      textColor = '#6E6E6E';
    }
  }

  const pressHandlers = disabled
    ? {}
    : {
        onPressIn: () => setPressed(true),
        onPressOut: () => setPressed(false),
        onPress: () => {
          setPressed(false);
          onPress();
        }
      };

  return (
    <View
      style={[
        styles.wrapper,
        {backgroundColor: backgroundColor},
        type === 'empty' && styles.wrapperEmpty,
        !!width && {width},
        style
      ]}>
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: foregroundColor},
          type === 'empty' && styles.buttonEmpty
        ]}
        accessibilityRole="button"
        accessibilityState={{disabled}}
        activeOpacity={1}
        {...pressHandlers}>
        <Text
          // allowFontScaling={false}
          maxFontSizeMultiplier={fontSizeMultiplier}
          style={[styles.text, {color: textColor}]}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    minHeight: scale(48),
    justifyContent: 'flex-start',
    backgroundColor: colors.buttons.default.shadow,
    borderRadius: 4
  },
  wrapperEmpty: {
    borderWidth: 1,
    borderColor: colors.buttons.empty.shadow,
    borderRadius: 4
  },
  button: {
    minHeight: dimensions.scale > 1 ? 44 : 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.buttons.default.background,
    borderRadius: 4,
    paddingHorizontal: 12
  },
  buttonEmpty: {},
  text: {
    ...text.largeBold,
    color: colors.buttons.default.text,
    textAlign: 'center',
    textAlignVertical: 'center',
    flexWrap: 'wrap'
  }
});
