import {colors} from 'constants/colors';
import {I18nManager, TextStyle} from 'react-native';

const defaults: TextStyle = {
  fontFamily: 'System',
  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', // Required for iOS
  color: colors.text
};

export default (scale: (v: number) => number): {[key: string]: TextStyle} => ({
  small: {
    ...defaults,
    fontSize: scale(14),
    lineHeight: scale(14)
  },
  default: {
    ...defaults,
    fontSize: scale(16),
    lineHeight: scale(21)
  },
  large: {
    ...defaults,
    fontSize: scale(18)
  },
  xlarge: {
    ...defaults,
    fontSize: scale(21)
  },

  xsmallBold: {
    ...defaults,
    fontWeight: 'bold',
    fontSize: scale(12)
  },
  xsmallBoldOpacity70: {
    ...defaults,
    fontWeight: 'bold',
    fontSize: scale(12),
    color: `${colors.text}B3`
  },
  smallBold: {
    ...defaults,
    fontWeight: 'bold',
    fontSize: scale(14),
    color: `${colors.text}B3`
  },
  defaultBold: {
    ...defaults,
    fontWeight: 'bold',
    fontSize: scale(16),
    color: colors.text
  },
  defaultBoldOpacity70: {
    ...defaults,
    fontWeight: 'bold',
    fontSize: scale(16),
    color: `${colors.text}B3`
  },
  largeBold: {
    ...defaults,
    fontWeight: 'bold',
    fontSize: scale(18),
    lineHeight: scale(24),
    letterSpacing: -0.37
  },
  xlargeBold: {
    ...defaults,
    fontWeight: 'bold',
    fontSize: scale(21)
  },
  defaultBoldBlue: {
    ...defaults,
    fontWeight: 'bold',
    fontSize: scale(16),
    color: colors.blue
  },
  xxlargeHeavy: {
    ...defaults,
    fontSize: scale(30),
    fontWeight: 'bold',
    lineHeight: scale(38),
    letterSpacing: -0.61,
    color: colors.white
  },

  // lato-black
  largeBlack: {
    // TODO: same as large, one should be removed
    ...defaults,
    fontSize: scale(18)
  },
  xlargeBlack: {
    ...defaults,
    fontSize: scale(21)
  },
  xxlargeBlack: {
    ...defaults,
    fontSize: scale(32),
    letterSpacing: -0.65
  }
});
