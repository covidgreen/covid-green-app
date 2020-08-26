import React, {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {shareApp} from 'components/atoms/navbar';

import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {Spacing} from 'components/atoms/layout';

import {text} from 'theme';
import {StateIcons} from 'assets/icons';

import {styles as sharedStyles} from './styles';

export const Active: FC<{share?: boolean}> = ({share = false}) => {
  const {t} = useTranslation();

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={sharedStyles.cardImageSuccess}>
        <StateIcons.Success height={144} width={144} />
      </View>
      <Spacing s={12} />
      <View style={sharedStyles.messageWrapper}>
        <Text style={text.defaultBold}>
          {t('closenessSensing:active:title')}
        </Text>
        <Spacing s={20} />
        <Text style={text.default}>{t('closenessSensing:active:text')}</Text>
        {share && (
          <>
            <Spacing s={20} />
            <Text style={text.default}>
              {t('closenessSensing:active:shareText')}
            </Text>
            <Spacing s={24} />
            <View style={styles.buttonsWrapper}>
              <Button type="empty" onPress={() => shareApp(t)}>
                {t('closenessSensing:active:share')}
              </Button>
            </View>
          </>
        )}
      </View>
    </Card>
  );
};

export const styles = StyleSheet.create({
  buttonsWrapper: {
    width: '100%'
  }
});
