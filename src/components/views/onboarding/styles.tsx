import {StyleSheet} from 'react-native';

import {text, colors, shadows} from 'theme';

export const styles = StyleSheet.create({
  title: {
    ...text.largeBold,
    marginBottom: 20
  },
  introTitle: {
    ...text.xxlargeHeavy
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
  groupOfPeople: {
    marginTop: -10
  },
  list: {
    flexDirection: 'row',
    marginBottom: 15
  },
  listIcon: {
    marginRight: 10
  },
  center: {
    alignItems: 'center'
  },
  dot: {
    width: 4,
    backgroundColor: colors.purple,
    height: '100%',
    marginRight: 18
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
    ...text.default,
    paddingTop: 16
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
