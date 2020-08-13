import {StyleSheet} from 'react-native';

import {text, colors, shadows} from 'theme';

export const styles = StyleSheet.create({
  title: {
    ...text.largeBold,
    marginBottom: 20
  },
  bold: {
    ...text.defaultBold
  },
  text: {
    ...text.default
  },
  block: {
    marginBottom: 20
  },
  fill: {
    flex: 1
  },
  list: {
    flexDirection: 'row',
    marginVertical: 15
  },
  listIcon: {
    marginRight: 10
  },
  center: {
    alignItems: 'center'
  },
  dot: {
    backgroundColor: colors.dot,
    borderRadius: 4,
    width: 9,
    height: 9,
    marginRight: 10
  },
  listContent: {
    flex: 1
  },
  statement: {
    borderLeftColor: colors.purple,
    borderLeftWidth: 4,
    borderStyle: 'solid',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  shareContainer: {
    borderStyle: 'solid',
    borderColor: colors.purple,
    borderWidth: 1,
    borderRadius: 2,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  shareText: {
    ...text.defaultBold,
    color: colors.purple
  },
  cardImage: {
    backgroundColor: '#e5f2eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  cardContainer: {
    backgroundColor: colors.white,
    ...shadows.default
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 30
  }
});
