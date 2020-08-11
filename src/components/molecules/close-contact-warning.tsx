import React, {FC} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {AppIcons} from 'assets/icons';
import {colors, shadows, text} from 'theme';
import {SingleRow} from 'components/atoms/layout';

export const CloseContactWarning: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('closeContact')}>
      <View style={styles.card}>
        <View style={styles.icon}>
          <Image
            accessibilityIgnoresInvertColors
            style={styles.imageSize}
            width={styles.imageSize.width}
            height={styles.imageSize.height}
            source={require('assets/images/exposure-alert/exposure-alert.png')}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{t('closeContactWarn:title')}</Text>
          <Text style={styles.notice}>{t('closeContactWarn:notice')}</Text>
        </View>
        <SingleRow>
          <AppIcons.ArrowRight width={24} height={24} color={colors.white} />
        </SingleRow>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    ...shadows.default,
    borderColor: colors.red,
    backgroundColor: colors.red,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16
  },
  icon: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  content: {
    flex: 1,
    marginLeft: 96
  },
  title: {
    ...text.largeBlack,
    color: colors.white
  },
  notice: {
    ...text.default,
    color: colors.white,
    lineHeight: 21
  },
  imageSize: {
    width: 107,
    height: 137
  }
});
