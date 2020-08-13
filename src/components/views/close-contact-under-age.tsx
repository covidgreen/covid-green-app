import React, {FC} from 'react';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Spacing} from 'components/atoms/layout';
import {Card} from 'components/atoms/card';
import {Markdown} from 'components/atoms/markdown';
import {Scrollable} from 'components/templates/scrollable';

import {text} from 'theme';
import {BubbleIcons} from 'assets/icons';

// TODO: use shared markdown styles
const markdownStyles = {
  text: {
    ...text.large,
    flexWrap: 'wrap'
  },
  strong: {
    ...text.largeBold
  },
  block: {
    marginBottom: 32
  }
};

export const CloseContactUnderAge: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Scrollable heading={t('closeContact:underAge:title')}>
      <Markdown markdownStyles={markdownStyles}>
        {t('closeContact:underAge:intro')}
      </Markdown>
      {/* TODO: call number */}
      <Card icon={<BubbleIcons.PhoneCall width={56} height={56} />}>
        <Text style={text.largeBlack}>{t('closeContact:underAge:callUs')}</Text>
      </Card>
      <Spacing s={20} />
      <Card
        icon={<BubbleIcons.Info width={56} height={56} />}
        onPress={() => navigation.navigate('closeContactInfo')}>
        <Text style={text.largeBlack}>{t('closeContact:infoCard')}</Text>
      </Card>
    </Scrollable>
  );
};
