import React, {
  Children,
  FC,
  cloneElement,
  isValidElement,
  ReactElement
} from 'react';
import {View, Text, StyleSheet, TextStyle, ViewStyle} from 'react-native';

import {colors, markdownStyles} from 'theme';

interface Props {
  ordered: boolean;
  index: number;
}

const restyleElement = (element: ReactElement, styles: TextStyle | ViewStyle) =>
  cloneElement(element, {
    style: element?.props?.style
      ? {
          ...element.props.style,
          ...styles
        }
      : undefined
  });

export const WarningBullet: FC<Props> = ({children, ordered, index}) => {
  // ListItemContent styles are overriden by <Text> children with default `text` style applied
  // Must apply styles to these for any text styles to actually apply
  const restyledChildren = Children.toArray(children).map((child) =>
    isValidElement(child)
      ? restyleElement(child, styles.listItemContentText)
      : child
  );

  return (
    <View style={styles.listItem}>
      <View style={ordered ? styles.listItemNumber : styles.listItemBullet}>
        {ordered && <Text>{index}.</Text>}
      </View>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemContent}>{restyledChildren}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: markdownStyles.listItem,
  listItemBullet: markdownStyles.listItemBullet,
  listItemNumber: markdownStyles.listItemNumber,
  listItemContent: {
    ...markdownStyles.listItemContent,
    marginTop: 0,
    marginBottom: 0
  },
  listItemContentText: {
    color: colors.text
  }
});
