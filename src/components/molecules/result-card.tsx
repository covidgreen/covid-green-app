import React, {FC} from 'react';
import {Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {Spacing} from 'components/atoms/spacing';
import {Card} from 'components/atoms/card';
import {Button, ButtonType} from 'components/atoms/button';
import {Markdown} from 'components/atoms/markdown';
import {text} from 'theme';
import {BubbleIcons} from 'assets/icons';

interface props {
  messageTitle?: string;
  message?: string;
  children?: React.ReactNode;
  markdownProps?: any;
  buttonType?: ButtonType;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const ResultCard: FC<props> = ({
  messageTitle,
  message,
  children,
  markdownProps,
  buttonType,
  buttonText,
  onButtonPress
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <>
      <Card padding={{h: 20, v: 20}}>
        {messageTitle && (
          <>
            <Text style={text.largeBlack}>{messageTitle}</Text>
            <Spacing s={16} />
          </>
        )}
        {message && <Markdown {...markdownProps}>{message}</Markdown>}
        {children}
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
        <Text style={text.xlargeBold}>{t('closeContact:infoCard')}</Text>
      </Card>
      <Spacing s={26} />
    </>
  );
};
