import React, {useState, useEffect, Fragment} from 'react';
import {
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  Text,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {HIDE_DEBUG} from '@env';
import {getReadableVersion} from 'react-native-device-info';

import {AppIcons} from 'assets/icons';
import {Scrollable} from 'components/templates/scrollable';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';
import {colors, text, shadows} from 'theme';
import {ScreenNames} from 'navigation';
import {StorageKeys} from 'providers/context';

const REQUIRED_PRESS_COUNT = 3;

interface SettingLineItem {
  id: string;
  title: string;
  screen: string;
  label: string;
  hint: string;
}

export * from './check-in';
export * from './leave';
export * from './debug';

interface SettingsProps {
  navigation: StackNavigationProp<any>;
}

export const Settings: React.FC<SettingsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [pressCount, setPressCount] = useState<number>(0);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  const versionPressHandler = async () => {
    setPressCount(pressCount + 1);
    if (!showDebug && pressCount + 1 >= REQUIRED_PRESS_COUNT) {
      await AsyncStorage.setItem(StorageKeys.debug, 'y');
      setShowDebug(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const showDebugData = await AsyncStorage.getItem(StorageKeys.debug);
        if (showDebugData) {
          setShowDebug(showDebugData === 'y');
        }
      } catch (err) {
        console.log(
          `Error reading "${StorageKeys.debug}" from async storage:`,
          err
        );
      }
    };
    init();
  }, []);

  const settings: SettingLineItem[][] = [
    [
      {
        id: 'checkIn',
        title: t('settings:healthLog'),
        label: t('settings:healthLog'),
        hint: t('settings:healthLogHint'),
        screen: ScreenNames.HealthLogSettings
      },
      {
        id: 'contactTracing',
        title: t('settings:covidAlerts'),
        label: t('settings:covidAlerts'),
        hint: t('settings:covidAlertsHint'),
        screen: ScreenNames.ContactTracingSettings
      },
      {
        id: 'language',
        title: t('settings:language'),
        label: t('settings:language'),
        hint: t('settings:languageHint'),
        screen: ScreenNames.LanguageSetttings
      },
      {
        id: 'metrics',
        title: t('settings:metrics'),
        label: t('settings:metrics'),
        hint: t('settings:metricsHint'),
        screen: ScreenNames.UsageSettings
      },
      {
        id: 'leave',
        title: t('settings:leave'),
        label: t('settings:leave'),
        hint: t('settings:leaveHint'),
        screen: ScreenNames.LeaveSettings
      }
    ],
    [
      {
        id: 'privacy',
        title: t('settings:privacyPolicy'),
        label: t('settings:privacyPolicy'),
        hint: t('settings:privacyPolicyHint'),
        screen: ScreenNames.PrivacySettings
      },
      {
        id: 'tour',
        title: t('settings:tour'),
        label: t('settings:tour'),
        hint: t('settings:tourHint'),
        screen: ScreenNames.Tour
      }
    ]
  ];

  if (HIDE_DEBUG !== 'y' && showDebug) {
    settings.push([
      {
        id: 'debug',
        label: '',
        hint: '',
        title: 'Debug',
        screen: 'settings.debug'
      }
    ]);
  }

  const version = getReadableVersion();

  return (
    <Scrollable
      heading={t('settings:title')}
      backgroundColor={colors.background}
      scrollStyle={styles.scroll}>
      {settings.map((settingsList, listIndex) => (
        <Fragment key={`list-${listIndex}`}>
          {!!listIndex && <Spacing s={20} />}
          <Card padding={{h: 0, v: 4, r: 0}} style={styles.card}>
            {settingsList.map((item, index) => {
              const {id, title, label, hint, screen} = item;

              const itemStyle: StyleProp<ViewStyle> = [styles.item];
              if (index === settingsList.length - 1) {
                itemStyle.push(styles.itemLast);
              }

              return (
                <TouchableWithoutFeedback
                  key={id}
                  accessibilityLabel={label}
                  accessibilityRole="button"
                  accessibilityHint={hint}
                  onPress={() => navigation.navigate(screen)}>
                  <View style={itemStyle}>
                    <Text style={styles.text}>{title}</Text>
                    <AppIcons.ArrowRight
                      width={24}
                      height={24}
                      color={colors.purple}
                    />
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </Card>
        </Fragment>
      ))}
      <View style={styles.flex} />
      <Spacing s={20} />
      <Text style={text.default} onPress={versionPressHandler}>
        App version {Platform.OS === 'ios' ? 'iOS' : 'Android'} {version}
      </Text>
      <Spacing s={8} />
    </Scrollable>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start'
  },
  card: {
    flex: 0
  },
  list: {
    flexGrow: 0,
    marginTop: 0,
    ...shadows.default,
    backgroundColor: colors.white
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dot
  },
  itemLast: {
    borderBottomWidth: 0
  },
  text: {
    flex: 1,
    ...text.defaultBold
  },
  iconSize: {
    width: 24,
    height: 24
  }
});
