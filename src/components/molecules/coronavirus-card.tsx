import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {Text, View, StyleSheet} from 'react-native';

import {Markdown} from 'components/atoms/markdown';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/spacing';
import {colors, text} from 'theme';
import {BubbleIcons} from 'assets/icons';

export const CoronavirusCard: FC = () => {
  const {t} = useTranslation();

  return (
    <>
      <Markdown style={styles.markdown} markdownStyles={markdown}>
        {t('checker:results:coronavirus1')}
      </Markdown>
      <Card type="empty" padding={{h: 16}}>
        <View style={styles.row}>
          <BubbleIcons.CallGreen height={56} width={56} />
          <Text style={[text.largeBold, styles.text]}>
            {t('checker:results:callEmergency')}
          </Text>
        </View>
      </Card>
      <Spacing s={20} />
      <Markdown style={styles.markdown} warningList>
        {t('checker:results:coronavirus2')}
      </Markdown>
    </>
  );
};

const markdown = StyleSheet.create({
  link: {
    ...text.defaultBoldBlue
  }
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    paddingLeft: 20
  },
  markdown: {
    backgroundColor: colors.white
  }
});
