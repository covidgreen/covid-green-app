import React, {ReactNode} from 'react';
import {Text, StyleSheet, Linking} from 'react-native';
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
  navigation: any
) => {
  const isHttp = href.startsWith('http');
  const isTel = href.startsWith('tel');

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

    return (
      <Text key={key} onPress={handle}>
        {children}
      </Text>
    );
  }

  return (
    <Link key={key} onPress={() => navigation.navigate(href)}>
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
  children: C
}) => {
  const navigation = useNavigation();

  const defaultRenderLink: RenderLink = (href, title, children, key) =>
    MarkdownLink(href, title, children, key, navigation);

  const combinedStyles = {
    ...defaultMarkdownStylesheet,
    list: warningList ? styles.warningList : defaultMarkdownStylesheet.list,
    ...markdownStyles
  };

  return (
    <M
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
