import React, {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {BubbleIcons} from 'assets/icons';
import {Card} from 'components/atoms/card';
import {colors, text} from 'theme';

interface CountyBreakdownCardProps {
  onPress: () => void;
}
export const CountyBreakdownCard: FC<CountyBreakdownCardProps> = ({
  onPress
}) => {
  const {t} = useTranslation();

  return (
    <Card padding={{r: 4}} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <BubbleIcons.MapPin width={56} height={56} />
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>{t('appStats:nationalPicture')}</Text>
          <Text style={styles.subTitle}>{t('appStats:breakdown')}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  icon: {
    marginRight: 20
  },
  title: {
    flex: 1,
    ...text.largeBlack
  },
  subTitle: {
    flex: 1,
    ...text.smallBold,
    color: colors.purple
  }
});
