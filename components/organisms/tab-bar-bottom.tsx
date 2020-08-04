import React, {FC} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  Share,
  Platform
} from 'react-native';
import {TFunction} from 'i18next';
import {useTranslation} from 'react-i18next';
import Constants from 'expo-constants';

import {colors} from '../../constants/colors';
import {text} from '../../theme';
import {useExposure, StatusState} from '../../providers/exposure';
import {TabBarIcons, AppIcons} from '../../assets/icons';

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

const ctOnUnselected = (
  <TabBarIcons.ContactTracing.Off width={32} height={24} color={colors.teal} />
);
const ctOffUnselected = (
  <TabBarIcons.ContactTracing.Off
    width={32}
    height={24}
    color={colors.darkGray}
  />
);
const ctOnSelected = (
  <TabBarIcons.ContactTracing.On width={32} height={24} color={colors.teal} />
);
const ctOffSelected = (
  <TabBarIcons.ContactTracing.On
    width={32}
    height={24}
    color={colors.darkGray}
  />
);

const barChartInactive = (
  <TabBarIcons.Updates width={32} height={24} color={colors.darkGray} />
);
const barChartActive = (
  <TabBarIcons.Updates width={32} height={24} color={colors.teal} />
);

const checkInactive = (
  <TabBarIcons.CheckIn width={32} height={24} color={colors.darkGray} />
);
const checkActive = (
  <TabBarIcons.CheckIn width={32} height={24} color={colors.teal} />
);

const shareIcon = (
  <AppIcons.Share width={32} height={24} color={colors.darkGray} />
);

/**
 * The component assumes the order of the <Tab /> components in the BottomNavigation is correct.
 * No need for a generic approach... yet.
 */
export const TabBarBottom: FC<any> = ({navigation, state}) => {
  const {t} = useTranslation();
  const {status, enabled} = useExposure();

  const tabItems = [
    {
      label: t('tabBar:updates'),
      icon: {
        inactive: barChartInactive,
        active: barChartActive
      }
    },
    {
      label: t('tabBar:symptomCheck'),
      icon: {
        inactive: checkInactive,
        active: checkActive
      }
    },
    {
      label: t('tabBar:contactTracing'),
      icon: {
        inactive:
          status.state === StatusState.active && enabled
            ? ctOnUnselected
            : ctOffUnselected,
        active:
          status.state === StatusState.active && enabled
            ? ctOnSelected
            : ctOffSelected
      }
    },
    {
      label: t('tabBar:shareApp'),
      icon: {
        active: shareIcon,
        inactive: shareIcon
      }
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabItems.map((tab, index) => {
          const isActive = state.index === index;
          const routeName = state.routes[index] && state.routes[index].name;
          return (
            <TouchableWithoutFeedback
              key={`tab-bar-item-${index}`}
              onPress={
                index !== 3
                  ? () => navigation.navigate(routeName)
                  : () => shareApp(t)
              }>
              <View style={[styles.tab]}>
                {isActive ? tab.icon.active : tab.icon.inactive}
                <Text
                  allowFontScaling={false}
                  style={[styles.label, isActive && styles.labelActive]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingBottom: Constants.statusBarHeight === 44 ? 34 : 0
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderTopColor: colors.gray,
    borderTopWidth: 2
  },
  tab: {
    maxWidth: '22%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 3
  },
  label: {
    ...text.smallBold,
    lineHeight: 14,
    letterSpacing: -0.35,
    paddingTop: 2,
    textAlign: 'center'
  },
  labelActive: {
    color: colors.text
  }
});
