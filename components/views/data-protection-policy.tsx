import React from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSettings} from '../../providers/settings';
import {Markdown} from '../atoms/markdown';
import {Link} from '../atoms/link';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../constants/colors';
import {text} from '../../theme';

import {Scrollable} from '../templates/scrollable';
import Icons from '../../assets/icons';

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
      Icon={<Icons.Privacy style={styles.privacy} width={34} height={34} color={colors.teal} />}
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
