import React, {ReactNode, forwardRef} from 'react';
import {StyleSheet, View, ViewStyle, Text, TextStyle} from 'react-native';

import {Markdown} from './markdown';

import {text, colors} from 'theme';

export type ToastType = 'default' | 'success' | 'warning';

interface ToastProps {
  type?: string;
  icon?: ReactNode;
  color?: string;
  message?: string;
  markdown?: boolean;
  style?: ViewStyle;
  iconStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Toast = forwardRef<View, ToastProps>(
  (
    {
      type,
      color,
      icon,
      message,
      style,
      children,
      iconStyle = {},
      textStyle = {}
    },
    ref
  ) => {
    let iconStyling: ViewStyle[] = [styles.icon, iconStyle];
    let textStyling: TextStyle[] = [text.defaultBold, textStyle];

    if (type === 'error') {
      iconStyling.push(styles.iconError);
      textStyling.push(styles.messageError);
    }

    if (color) {
      iconStyling.push({backgroundColor: color});
    }

    return (
      <View
        ref={ref}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
        style={[
          styles.container,
          style,
          type === 'error' && styles.containerError
        ]}>
        {icon && <View style={iconStyling}>{icon}</View>}
        <View style={styles.messageContainer}>
          {message && <Text style={textStyling}>{message}</Text>}
          {children && <Markdown>{children}</Markdown>}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20
  },
  containerError: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.warning
  },
  icon: {
    justifyContent: 'center',
    paddingRight: 10,
    alignItems: 'center'
  },
  iconError: {
    backgroundColor: colors.warning
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  messageError: {
    color: colors.white
  }
});

export {Toast};
