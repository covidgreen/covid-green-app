import React, {ReactNode, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  Linking,
  AccessibilityInfo,
  AppState,
  TouchableOpacity,
  View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import M from 'react-native-easy-markdown';

import {Link} from 'components/atoms/link';
import {markdownStyles as defaultMarkdownStyles, colors} from 'theme';
import {WarningBullet} from './warning-bullet';

interface Markdown {
  style?: object;
  markdownStyles?: object;
  renderLink?: RenderLink;
  warningList?: boolean;
  renderListBullet?: (index: number, ordered: boolean, children?: any) => any;
  markdownRef?: React.RefObject<any>;
}

type RenderListItem = (
  index: number,
  ordered: boolean,
  children: ReactNode,
  key: string
) => React.ReactNode;

export type RenderLink = (
  href: string,
  title: string,
  children: ReactNode,
  key: string
) => React.ReactNode;

const defaultMarkdownStylesheet = StyleSheet.create(defaultMarkdownStyles);

const MarkdownLink = (
  href: string,
  title: string,
  children: any,
  key: string,
  navigation: any,
  screenReaderEnabled: boolean
) => {
  const isHttp = href.startsWith('http');
  const isTel = href.startsWith('tel');

  // Markdown titles like [text](http://site.com "Title here") will be override default accessibility labels

  if (isHttp || isTel) {
    const handle = isTel
      ? () => {
          const crossPlatformTarget = href.replace(/:(?=\d|\+)/, '://');
          Linking.openURL(crossPlatformTarget);
        }
      : () => {
          WebBrowser.openBrowserAsync(href, {
            enableBarCollapsing: true,
            showInRecents: true
          });
        };

    return screenReaderEnabled ? (
      // we can't use TouchableWithoutFeedback because is not selectable by keyboard tab navigation
      <TouchableOpacity
        key={key}
        activeOpacity={1}
        accessible={true}
        accessibilityRole="link"
        accessibilityHint={title}
        accessibilityLabel={childrenAsText(children)}
        onPress={handle}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ) : (
      <Text
        key={key}
        accessible={true}
        accessibilityRole="link"
        accessibilityHint={title}
        onPress={handle}>
        {children}
      </Text>
    );
  }

  return (
    <Link
      key={key}
      onPress={() => navigation.navigate(href)}
      a11yHint={title}
      a11yRole="button">
      {children}
    </Link>
  );
};

export const Markdown: React.FC<Markdown> = ({
  style,
  markdownStyles = {},
  renderLink,
  renderListBullet,
  warningList,
  children: C,
  markdownRef
}) => {
  const navigation = useNavigation();

  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const checkScreenReader = () =>
      AccessibilityInfo.isScreenReaderEnabled().then((enabled) =>
        setScreenReaderEnabled(enabled)
      );
    // Re-check state on app refocus to catch changes to device settings
    AppState.addEventListener('change', checkScreenReader);
    checkScreenReader();
    return () => AppState.removeEventListener('change', checkScreenReader);
  }, []);

  const defaultRenderLink: RenderLink = (href, title, children, key) =>
    MarkdownLink(href, title, children, key, navigation, screenReaderEnabled);

  const combinedStyles = {
    ...defaultMarkdownStylesheet,
    list: warningList ? styles.warningList : defaultMarkdownStylesheet.list,
    ...markdownStyles
  };

  return (
    <M
      ref={markdownRef}
      markdownStyles={combinedStyles}
      style={style || styles.container}
      renderLink={renderLink || defaultRenderLink}
      renderListItem={
        warningList
          ? renderWarningListItem
          : renderListBullet
          ? renderListBullet
          : null
      }>
      {C}
    </M>
  );
};

export const getRenderListBullet = (icons: Record<string, any>) => (
  index: number,
  _: boolean,
  children: any
) => {
  const map: {[key: number]: any} = Object.entries(icons).reduce((p, c, i) => {
    return {
      ...p,
      [i]: c[1]({width: 48, height: 48})
    };
  }, {});

  return (
    <View key={`list-item-${index}`} style={styles.listIcon}>
      <View style={styles.icon}>{map[index]}</View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

// Can't set the color of `listItem` because `text` styles override it... need to fork the renderer
export const renderWarningListItem: RenderListItem = (
  index,
  ordered,
  children,
  key
) => (
  <WarningBullet ordered={ordered} index={index} key={`${key}_${index}`}>
    {children}
  </WarningBullet>
);

const styles = StyleSheet.create({
  icon: {
    marginEnd: 12
  },
  content: {
    flex: 1
  },
  listIcon: {
    flexDirection: 'row',
    flex: 1,
    marginEnd: 12,
    marginTop: 12
  },
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  warningList: {
    marginBottom: 6
  }
});

export const childrenAsText = (
  children: React.ReactChildren | React.ReactNode | undefined,
  joiner: string = ''
): string =>
  children
    ? (React.Children.toArray(children).reduce(
        (str, child) =>
          `${str}${joiner}${
            React.isValidElement(child)
              ? childrenAsText(child.props.children, joiner)
              : `${child}`
          }`,
        ''
      ) as string)
    : '';
