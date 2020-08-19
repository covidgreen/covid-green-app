import React, {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Card} from 'components/atoms/card';
import {text} from 'theme';
import {Spacing} from 'components/atoms/layout';
import {StateIcons} from 'assets/icons';

export const Active: FC = () => {
  const {t} = useTranslation();

  return (
    <Card padding={{h: 0, v: 0}}>
      <View style={styles.cardImage}>
        <StateIcons.Success height={144} width={144} />
      </View>
      <Spacing s={4} />
      <View style={styles.row}>
        <View style={styles.messageWrapper}>
          <Text style={text.defaultBold}>
            {t('contactTracing:active:title')}
          </Text>
          <Spacing s={8} />
          <Text style={text.default}>{t('contactTracing:active:text')}</Text>
        </View>
      </View>
    </Card>
  );
};

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  traceIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 207, 104, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20
  },
  image: {
    width: 24,
    height: 24
  },
  cardImage: {
    backgroundColor: '#e5f2eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingTop: 18
  },
  button: {
    width: '100%'
  }
});
