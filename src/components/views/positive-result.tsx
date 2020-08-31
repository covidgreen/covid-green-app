import React, {FC} from 'react';
import {Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {BubbleIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {colors} from 'constants/colors';
import {Markdown} from 'components/atoms/markdown';
import {Scrollable} from 'components/templates/scrollable';
import {Spacing} from 'components/atoms/spacing';
import {text} from 'theme';
import {ScreenNames} from 'navigation';

export const PositiveResult: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <Scrollable
      safeArea={false}
      headingShort
      backgroundColor={colors.background}
      heading={t('positiveResult:title')}>
      <Markdown>{t('positiveResult:text1')}</Markdown>
      <Spacing s={12} />
      <Card
        icon={<BubbleIcons.Info width={56} height={56} />}
        onPress={() => navigation.navigate('closeContactInfo')}>
        <Text style={text.defaultBold}>{t('closeContact:infoCard')}</Text>
      </Card>
      <Spacing s={20} />
      <Markdown>{t('positiveResult:text2')}</Markdown>
      <Spacing s={24} />
      <Button onPress={() => navigation.navigate(ScreenNames.UploadKeys)}>
        {t('positiveResult:shareCodes')}
      </Button>
    </Scrollable>
  );
};
