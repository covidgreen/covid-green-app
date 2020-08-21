import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {BUILD_VERSION, HIDE_DEBUG} from '@env';

import {AppIcons} from 'assets/icons';
import {Basic} from 'components/templates/basic';
import {colors, text, shadows} from 'theme';
import {ScreenNames} from 'navigation';

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
      await AsyncStorage.setItem('covidApp.showDebug', 'y');
      setShowDebug(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const showDebugData = await AsyncStorage.getItem('covidApp.showDebug');
        if (showDebugData) {
          setShowDebug(showDebugData === 'y');
        }
      } catch (err) {
        console.log(
          'Error reading "covidApp.showDebug" from async storage:',
          err
        );
      }
    };
    init();
  }, []);

  const settings: SettingLineItem[] = [
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
      id: 'privacy',
      title: t('settings:privacyPolicy'),
      label: t('settings:privacyPolicy'),
      hint: t('settings:privacyPolicyHint'),
      screen: ScreenNames.PrivacySettings
    },
    {
      id: 'leave',
      title: t('settings:leave'),
      label: t('settings:leave'),
      hint: t('settings:leaveHint'),
      screen: ScreenNames.LeaveSettings
    }
  ];

  if (HIDE_DEBUG !== 'y' && showDebug) {
    settings.push({
      id: 'debug',
      label: '',
      hint: '',
      title: 'Debug',
      screen: 'settings.debug'
    });
  }

  return (
    <Basic heading={t('settings:title')} backgroundColor="#FAFAFA">
      <FlatList
        style={styles.list}
        data={settings}
        renderItem={({item, index}) => {
          const {id, title, label, hint, screen} = item;

          const itemStyle: StyleProp<ViewStyle> = [styles.item];
          if (index === settings.length - 1) {
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
        }}
        keyExtractor={({id}) => id}
      />
      <View style={styles.flex} />
      <Text style={text.default} onPress={versionPressHandler}>
        App version {Platform.OS === 'ios' ? 'iOS' : 'Android'} {BUILD_VERSION}
      </Text>
    </Basic>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
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
