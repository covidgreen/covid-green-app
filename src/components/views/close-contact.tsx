import React, {FC} from 'react';
import {StyleSheet, Text, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import PushNotification from 'react-native-push-notification';

import {BubbleIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Markdown} from 'components/atoms/markdown';
import {Scrollable} from 'components/templates/scrollable';
import {Spacing} from 'components/atoms/layout';
import {text} from 'theme';
import {useApplication} from 'providers/context';
import {useSettings} from 'providers/settings';

export const CloseContact: FC<any> = ({route}) => {
  const {t} = useTranslation();
  const {callBackData} = useApplication();
  const {exposedTodo} = useSettings();

  const todoList = exposedTodo;

  const type = route.params && route.params.info;

  PushNotification.setApplicationIconBadgeNumber(0);

  return (
    <Scrollable
      heading={type ? t('closeContact:infoTitle') : t('closeContact:title')}>
      <Text style={text.largeBold}>
        {type ? t('closeContact:intro') : t('closeContact:alertintro')}
      </Text>
      <Spacing s={16} />
      {callBackData && !type && (
        <>
          <Card icon={<BubbleIcons.PhoneCall width={56} height={56} />}>
            <Text style={text.largeBlack}>{t('closeContact:callBack')}</Text>
            <Text style={styles.notice}>{t('closeContact:callBackQueue')}</Text>
          </Card>
          <Spacing s={16} />
        </>
      )}
      <Text style={text.defaultBold}>{t('closeContact:todo:title')}</Text>
      <Spacing s={8} />
      <Markdown>{todoList}</Markdown>
      <Spacing s={24} />
      <Text style={text.defaultBold}>{t('closeContact:symptoms:title')}</Text>
      <Spacing s={8} />
      <Markdown>{t('closeContact:symptoms:intro')}</Markdown>
      <Spacing s={12} />
      <Button
        width="100%"
        onPress={() =>
          Linking.openURL('https://www2.hse.ie/app/in-app-close-contact')
        }>
        {t('closeContact:symptoms:callHSE')}
      </Button>
      <Spacing s={32} />
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  notice: {
    ...text.default,
    lineHeight: 21
  }
});
