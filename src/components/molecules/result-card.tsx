import React, {FC} from 'react';

import {Spacing} from 'components/atoms/spacing';
import {Card} from 'components/atoms/card';
import {Button, ButtonType} from 'components/atoms/button';
import {Markdown} from 'components/atoms/markdown';
import {Toast, ToastType} from 'components/atoms/toast';
import {colors} from 'theme';
import {AppIcons} from 'assets/icons';

interface props {
  message?: string;
  statusMessage?: string;
  statusType?: ToastType;
  icon?: React.ReactNode;
  markdownProps?: any;
  buttonType?: ButtonType;
  buttonText?: string;
  onButtonPress?: () => void;
}

const getDefaultIcon = (statusType: ToastType) => {
  switch (statusType) {
    case 'success':
      return <AppIcons.Success width={24} height={24} color={colors.success} />;
    case 'warning':
      return <AppIcons.Alert width={24} height={24} color={colors.orange} />;
  }
};

export const ResultCard: FC<props> = ({
  message,
  statusMessage,
  statusType = 'success',
  icon = getDefaultIcon(statusType),
  markdownProps,
  buttonType,
  buttonText,
  onButtonPress
}) => {
  return (
    <Card padding={{v: 4}}>
      <Spacing s={16} />
      {statusMessage && (
        <>
          <Toast type={statusType} icon={icon} message={statusMessage} />
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
