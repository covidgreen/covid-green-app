import {colors} from 'constants/colors';
import {TextStyle} from 'react-native';

export default (scale: (v: number) => number): {[key: string]: TextStyle} => ({
  small: {
    fontFamily: 'System',
    fontSize: scale(14),
    color: colors.text,
    lineHeight: scale(14)
  },
  default: {
    fontFamily: 'System',
    fontSize: scale(16),
    lineHeight: scale(21),
    color: colors.text
  },
  large: {
    fontFamily: 'System',
    fontSize: scale(18),
    color: colors.text
  },
  xlarge: {
    fontFamily: 'System',
    fontSize: scale(21),
    color: colors.text
  },

  xsmallBold: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: scale(12),
    color: colors.text
  },
  xsmallBoldOpacity70: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: scale(12),
    color: `${colors.text}B3`
  },
  smallBold: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: scale(14),
    color: `${colors.text}B3`
  },
  defaultBold: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: scale(16),
    color: colors.text
  },
  defaultBoldOpacity70: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: scale(16),
    color: `${colors.text}B3`
  },
  largeBold: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: scale(18),
    lineHeight: scale(24),
    letterSpacing: -0.37,
    color: colors.text
  },
  xlargeBold: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: scale(21),
    color: colors.text
  },
  defaultBoldBlue: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: scale(16),
    color: colors.blue
  },
  xxlargeHeavy: {
    fontSize: scale(30),
    fontWeight: 'bold',
    lineHeight: scale(38),
    letterSpacing: -0.61,
    color: colors.white
  },

  // lato-black
  largeBlack: {
    // TODO: same as large, one should be removed
    fontFamily: 'System',
    fontSize: scale(18),
    color: colors.text
  },
  xlargeBlack: {
    fontFamily: 'System',
    fontSize: scale(21),
    color: colors.text
  },
  xxlargeBlack: {
    fontFamily: 'System',
    fontSize: scale(32),
    letterSpacing: -0.65,
    color: colors.text
  }
});
