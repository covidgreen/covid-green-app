import React, {FC} from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {Spacing} from 'components/atoms/spacing';
import {Card} from 'components/atoms/card';
import {Button, ButtonType} from 'components/atoms/button';
import {Markdown} from 'components/atoms/markdown';
import {colors, text} from 'theme';
import {BubbleIcons, AppIcons} from 'assets/icons';

interface props {
  messageTitle?: string;
  message?: string;
  icon?: boolean;
  children?: React.ReactNode;
  markdownProps?: any;
  buttonType?: ButtonType;
  buttonText?: string;
  onButtonPress?: () => void;
  markdownStyle?: ViewStyle;
}

export const ResultCard: FC<props> = ({
  messageTitle,
  message,
  icon = false,
  children,
  markdownProps,
  buttonType,
  buttonText,
  onButtonPress,
  markdownStyle
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <>
      <Card padding={{h: 20, v: 20}}>
        {icon && (
          <>
            <View style={styles.fullWidthToast}>
              <Spacing s={48} />
              <AppIcons.Success width={60} height={60} color={colors.success} />
              <Spacing s={32} />
            </View>
            <Spacing s={16} />
          </>
        )}
        {messageTitle && (
          <>
            <Text style={text.largeBlack}>{messageTitle}</Text>
            <Spacing s={16} />
          </>
        )}
        {message && (
          <Markdown {...markdownProps} style={markdownStyle}>
            {message}
          </Markdown>
        )}
        {children && children}
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
      <Spacing s={20} />
      <Card
        icon={<BubbleIcons.Info width={56} height={56} />}
        onPress={() => navigation.navigate('closeContactInfo')}>
        <Text style={text.largeBold}>{t('closeContact:infoCard')}</Text>
      </Card>
      <Spacing s={26} />
    </>
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
