import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';

import {Markdown} from 'components/atoms/markdown';
import {CallCard} from 'components/molecules/call-card';
import {Spacing} from 'components/atoms/spacing';
import {colors, text} from 'theme';
import {BubbleIcons} from 'assets/icons';
import {Linking} from 'react-native';

export const CoronavirusCard: FC = () => {
  const {t} = useTranslation();

  return (
    <>
      <Markdown style={styles.markdown} markdownStyles={markdown}>
        {t('checker:results:coronavirus1')}
      </Markdown>
      <Spacing s={24} />
      <CallCard
        onPress={() => Linking.openURL('tel:911')}
        message={t('checker:results:callEmergency')}
      />
      <Spacing s={36} />
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
