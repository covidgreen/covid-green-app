import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

import Icons from 'assets/icons';
import {colors, text} from 'theme';
import {Link} from 'components/atoms/link';
import {Markdown, RenderLink, childrenAsText} from 'components/atoms/markdown';
import {Scrollable} from 'components/templates/scrollable';
import {useDbText} from 'providers/settings';

const styles = StyleSheet.create({
  privacy: {
    width: 32,
    height: 32,
    marginEnd: 8
  }
});

interface DataProtectionLinkProps {
  a11yRole?: 'button' | 'link';
  onPress?: () => void;
  title?: string;
}

export const DataProtectionLink: FC<DataProtectionLinkProps> = ({
  a11yRole = 'button',
  onPress,
  title
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const defaultOnPress = () => {
    navigation.navigate('privacy', {screen: 'settings.privacy'});
  };

  return (
    <Link
      a11yRole={a11yRole}
      Icon={
        <Icons.Privacy
          style={styles.privacy}
          width={34}
          height={34}
          color={colors.purple}
        />
      }
      text={title || t('dataProtectionPolicy:link')}
      onPress={onPress || defaultOnPress}
    />
  );
};

const renderStyledPrivacyLink: RenderLink = (href, title, children) => {
  return (
    <DataProtectionLink
      a11yRole="link"
      title={childrenAsText(children) || title}
      onPress={() =>
        WebBrowser.openBrowserAsync(href, {
          enableBarCollapsing: true,
          showInRecents: true
        })
      }
    />
  );
};

export const DataProtectionPolicy = () => {
  const {dpinText} = useDbText();
  const {t} = useTranslation();

  return (
    <Scrollable heading={t('dataProtectionPolicy:title')}>
      <Markdown
        markdownStyles={markDownStyles}
        renderLink={renderStyledPrivacyLink}>
        {dpinText}
      </Markdown>
    </Scrollable>
  );
};

export const TermsAndConditions = () => {
  const {tandcText} = useDbText();
  const {t} = useTranslation();

  return (
    <Scrollable heading={t('tandcPolicy:title')}>
      <Markdown markdownStyles={markDownStyles}>{tandcText}</Markdown>
    </Scrollable>
  );
};

const markDownStyles = StyleSheet.create({
  // API provides us a duplicate header
  h3: {
    display: 'none'
  },
  list: {
    marginBottom: 12
  },
  block: {
    marginBottom: 24
  },
  listItemNumber: {
    ...text.largeBold,
    color: colors.darkGray,
    marginEnd: 16,
    alignSelf: 'center'
  },
  listItemContent: {
    marginTop: -2,
    marginEnd: 32
  }
});
