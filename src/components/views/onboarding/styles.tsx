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
    marginTop: -14,
    alignSelf: 'flex-start'
  },
  list: {
    flexDirection: 'row',
    marginBottom: 16
  },
  listIcon: {
    marginEnd: 10
  },
  center: {
    alignItems: 'center'
  },
  dot: {
    width: 4,
    backgroundColor: colors.purple,
    height: '100%',
    marginEnd: 18
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
  },
  relative: {
    position: 'relative',
    overflow: 'visible'
  },
  index2: {
    zIndex: 2
  },
  index1: {
    zIndex: 1
  },
  index0: {
    zIndex: 0
  },
  sloped: {
    backgroundColor: colors.purple,
    position: 'absolute',
    top: -25,
    left: -10,
    right: 0,
    height: 80,
    transform: [
      {
        skewY: '-5.9deg'
      }
    ]
  },
  slopeIcon: {
    flex: 1,
    position: 'relative',
    alignSelf: 'flex-end',
    marginTop: 0
  }
});
