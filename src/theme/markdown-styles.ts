import {ViewStyle, TextStyle} from 'react-native';

import {colors} from 'constants/colors';

interface Styles {
  [name: string]: ViewStyle | TextStyle;
}

export default (text: Styles): Styles => ({
  h1: text.xlargeBold,
  h2: text.largeBold,
  text: {
    ...text.default,
    flexWrap: 'wrap',
    margin: 0
  },
  block: {
    marginBottom: 16
  },
  link: {
    ...text.defaultBoldBlue
  },
  list: {
    marginBottom: -12
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  listItemNumber: {
    ...text.xxlargeBlack,
    color: colors.purple,
    marginRight: 12
  },
  listItemContent: {
    flex: 1,
    marginTop: 12
  },
  strong: {
    ...text.defaultBold
  },
  listItemBullet: {
    width: 8,
    height: 8,
    backgroundColor: colors.purple,
    borderRadius: 4,
    marginLeft: 6,
    marginTop: 6,
    marginRight: 16
  }
});
