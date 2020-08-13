import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSafeArea} from 'react-native-safe-area-context';

import Icons, {AppIcons} from 'assets/icons';
import {colors, text} from 'theme';
import {useApplication} from 'providers/context';
import {shareApp} from 'components/organisms/tab-bar-bottom';

interface NavBarProps {
  navigation: any;
  scene: any;
  placeholder?: boolean;
  modal?: boolean;
}

export const NavBar: FC<NavBarProps> = ({
  navigation,
  scene,
  placeholder,
  modal = false
}) => {
  const {t} = useTranslation();
  const insets = useSafeArea();
  const {user} = useApplication();

  const [state, setState] = useState({back: false});
  const showSettings = scene.descriptor.options.showSettings === true;

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
              onPress={() => navigation.goBack()}>
              <View style={styles.back}>
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
        <View
          accessible
          accessibilityLabel={t('common:name')}
          accessibilityHint={t('common:name')}
          accessibilityRole="text"
          style={[styles.col, styles.center]}>
          <Icons.StateLogo width={92} height={36} color={colors.text} />
        </View>
        <View style={[styles.col, styles.right]}>
          {showSettings && (
            <TouchableWithoutFeedback
              accessibilityHint={t('navbar:settingsHint')}
              onPress={() => shareApp(t)}>
              <View style={styles.settings}>
                <AppIcons.Share width={24} height={24} color={colors.white} />
              </View>
            </TouchableWithoutFeedback>
          )}
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
    paddingLeft: 4
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
