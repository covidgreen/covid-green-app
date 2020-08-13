import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text, TouchableWithoutFeedback} from 'react-native';

import {Scrollable} from 'components/templates/scrollable';
import {Button} from 'components/atoms/button';
import {Spacing} from 'components/atoms/spacing';
import {AppIcons, StateIcons} from 'assets/icons';

import {styles} from './styles';
import {colors} from 'theme';

import {shareApp} from 'components/organisms/tab-bar-bottom';

export const Completion: FC<any> = () => {
  const {t} = useTranslation();
  const nav = useNavigation();

  return (
    <Scrollable>
      <Spacing s={10} />
      <View style={styles.fill}>
        <View style={styles.cardContainer}>
          <View style={styles.cardImage}>
            <StateIcons.Success height={144} width={144} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.bold}>{t('onboarding:completion:title')}</Text>
            <Spacing s={10} />
            <Text style={styles.text}>{t('onboarding:completion:text')}</Text>
            <Spacing s={30} />
            <TouchableWithoutFeedback onPress={() => shareApp(t)}>
              <View style={styles.shareContainer}>
                <View style={styles.listIcon}>
                  <AppIcons.Share
                    color={colors.purple}
                    width={24}
                    height={24}
                  />
                </View>
                <View style={styles.listContent}>
                  <Text style={styles.shareText}>
                    {t('onboarding:completion:shareText')}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <Spacing s={30} />
            <Button
              onPress={() =>
                nav.reset({
                  index: 0,
                  routes: [{name: 'main'}]
                })
              }>
              {t('onboarding:completion:next')}
            </Button>
          </View>
        </View>
      </View>
      <Spacing s={30} />
    </Scrollable>
  );
};
