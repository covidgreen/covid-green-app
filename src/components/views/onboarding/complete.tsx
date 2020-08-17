import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';

import {StateIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {Scrollable} from 'components/templates/scrollable';
import {Spacing} from 'components/atoms/spacing';
import {styles} from './styles';
import {shareApp} from 'components/atoms/navbar';

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
            <Text style={styles.shareText}>
              {t('onboarding:completion:shareText')}
            </Text>
            <Spacing s={30} />
            <Button onPress={() => shareApp(t)} type="empty">
              {t('onboarding:completion:share')}
            </Button>
            <Spacing s={20} />
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
