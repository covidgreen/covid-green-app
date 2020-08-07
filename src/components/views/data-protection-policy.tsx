import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {colors, text} from 'theme';
import {Link} from 'components/atoms/link';
import {Markdown} from 'components/atoms/markdown';
import {useSettings} from 'providers/settings';
import {Scrollable} from 'components/templates/scrollable';

const PrivacyIcon = () => (
  <Image
    accessibilityIgnoresInvertColors
    style={styles.privacy}
    source={require('assets/images/privacy/privacy.png')}
  />
);

const styles = StyleSheet.create({
  privacy: {
    width: 32,
    height: 32,
    marginRight: 8
  }
});

export const DataProtectionLink = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  return (
    <Link
      Icon={PrivacyIcon}
      text={t('dataProtectionPolicy:link')}
      onPress={() => {
        navigation.navigate('privacy', {screen: 'settings.privacy'});
      }}
    />
  );
};

export const DataProtectionPolicy = () => {
  const {dpinText} = useSettings();
  const {t} = useTranslation();

  return (
    <Scrollable heading={t('dataProtectionPolicy:title')}>
      <Markdown markdownStyles={markDownStyles}>{dpinText}</Markdown>
    </Scrollable>
  );
};

export const TermsAndConditions = () => {
  const {tandcText} = useSettings();
  const {t} = useTranslation();

  return (
    <Scrollable heading={t('tandcPolicy:title')}>
      <Markdown markdownStyles={markDownStyles}>{tandcText}</Markdown>
    </Scrollable>
  );
};

const markDownStyles = StyleSheet.create({
  listItemNumber: {
    ...text.largeBold,
    color: colors.darkGray,
    paddingRight: 16
  },
  listItemContent: {
    paddingTop: 2,
    paddingRight: 32
  }
});
