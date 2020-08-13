import React, {FC} from 'react';
import {Text, View, StyleSheet} from 'react-native';

import {Spacing} from 'components/atoms/spacing';
import {Card} from 'components/atoms/card';
import {Button, ButtonType} from 'components/atoms/button';
import {Markdown} from 'components/atoms/markdown';

import {text, colors} from 'theme';
import {AppIcons} from 'assets/icons';

interface props {
  messageTitle?: string;
  message?: string;
  icon?: React.ReactNode;
  markdownProps?: any;
  buttonType?: ButtonType;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const ResultCard: FC<props> = ({
  messageTitle,
  message,
  icon = <AppIcons.Success width={60} height={60} color={colors.success} />,
  markdownProps,
  buttonType,
  buttonText,
  onButtonPress
}) => {
  return (
    <Card padding={{h: 20, v: 20}}>
      <View style={styles.fullWidthToast}>
        <Spacing s={48}></Spacing>
        {icon}
        <Spacing s={32}></Spacing>
      </View>
      <Spacing s={16} />
      {messageTitle && (
        <>
          <Text style={text.largeBlack}>{messageTitle}</Text>
          <Spacing s={16} />
        </>
      )}
      <Markdown {...markdownProps}>{message}</Markdown>
      {buttonText && onButtonPress && (
        <>
          <Spacing s={8} />
          <Button type={buttonType} onPress={onButtonPress}>
            {buttonText}
          </Button>
          <Spacing s={8} />
        </>
      )}
      <Spacing s={8} />
    </Card>
  );
};

const styles = StyleSheet.create({
  fullWidthToast: {
    marginLeft: -20,
    marginRight: -20,
    marginTop: -20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // TODO: setup color
    backgroundColor: 'rgba(3,133,67,0.1)'
  }
});
