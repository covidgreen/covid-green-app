import React, {FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Share,
  Platform
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSafeArea} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';

import Icons, {AppIcons} from 'assets/icons';
import {colors, text} from 'theme';
import {useApplication} from 'providers/context';
import {TFunction} from 'i18next';
import {ScreenNames} from 'navigation';

interface NavBarProps {
  navigation: any;
  scene: any;
  placeholder?: boolean;
  modal?: boolean;
}

export const shareApp = async (t: TFunction) => {
  try {
    await Share.share(
      {
        title: t('common:message'),
        message:
          Platform.OS === 'android' ? t('common:url') : t('common:message'),
        url: t('common:url')
      },
      {
        subject: t('common:name'),
        dialogTitle: t('common:name')
      }
    );
  } catch (error) {
    console.log(t('tabBar:shareError'));
  }
};

export const NavBar: FC<NavBarProps> = ({
  navigation,
  placeholder,
  modal = false
}) => {
  const {t} = useTranslation();
  const insets = useSafeArea();
  const {user} = useApplication();
  const route = useRoute();

  const [state, setState] = useState({back: false});

  useEffect(() => {
    let unsubscribeStart: (() => any) | null = null;
    let unsubscribeEnd: (() => any) | null = null;
    if (!placeholder) {
      unsubscribeStart = navigation.addListener('transitionStart', () => {
        const {index} = navigation.dangerouslyGetState();
        setState((s) => ({
          ...s,
          back: index !== 0
        }));
      });

      unsubscribeEnd = navigation.addListener('transitionEnd', () => {
        const {index} = navigation.dangerouslyGetState();
        setState((s) => ({
          ...s,
          back: index > 0
        }));
      });
    }

    return () => {
      unsubscribeStart && unsubscribeStart();
      unsubscribeEnd && unsubscribeEnd();
    };
  }, [user, navigation, placeholder]);

  return (
    <View style={[styles.wrapper, {paddingTop: insets.top + 2}]}>
      <View style={styles.container}>
        <View style={[styles.col, styles.left]}>
          {state.back && (
            <TouchableWithoutFeedback
              accessibilityRole="button"
              accessibilityHint={t('navbar:backHint')}
              onPress={() => {
                route && route.name === ScreenNames.CloseContactAlert
                  ? navigation.navigate(ScreenNames.MyCovidAlerts)
                  : navigation.goBack();
              }}>
              <View
                hitSlop={{left: 12, right: 12, top: 8, bottom: 8}}
                style={styles.back}>
                {!modal && (
                  <>
                    <AppIcons.Back
                      width={18}
                      height={18}
                      color={colors.white}
                    />
                    <Text allowFontScaling={false} style={styles.backText}>
                      {t('navbar:back')}
                    </Text>
                  </>
                )}
                {modal && (
                  <AppIcons.Close width={18} height={18} color={colors.white} />
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        <View style={[styles.col, styles.center]}>
          <Icons.LogoNav width={92} height={36} color={colors.text} />
        </View>
        <View style={[styles.col, styles.right]}>
          <TouchableWithoutFeedback
            accessibilityRole="button"
            accessibilityLabel={t('navbar:share')}
            onPress={() => shareApp(t)}>
            <View style={styles.settings}>
              <AppIcons.Share width={24} height={24} color={colors.white} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: colors.purple
  },
  background: {
    flex: 1,
    resizeMode: 'stretch',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    maxHeight: 62
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  col: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  left: {
    width: '25%',
    alignItems: 'flex-start',
    paddingLeft: 12
  },
  center: {
    width: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  right: {
    width: '25%',
    alignItems: 'flex-end',
    paddingRight: 12
  },
  back: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  backText: {
    ...text.default,
    marginLeft: 5,
    textAlign: 'left',
    color: colors.white
  },
  settings: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconSize: {
    width: 24,
    height: 24
  },
  logoSize: {
    width: 92,
    height: 36
  },
  shareText: {
    ...text.default,
    textAlign: 'center',
    color: colors.white
  }
});
