import React, {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Spacing} from 'components/atoms/layout';
import {Heading} from 'components/atoms/heading';
import {Card} from 'components/atoms/card';
import {Progress} from 'components/atoms/progress';
import {colors, text} from 'theme';
import {BubbleIcons} from 'assets/icons';

export interface AppStats {
  totalCheckins: number;
  noSymptoms: number;
  someSymptoms: number;
}

interface AppStatsProps {
  data: AppStats;
}

export const AppStats: FC<AppStatsProps> = ({data}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Heading text={t('appStats:title')} />
      <Card>
        <View style={styles.row} accessible accessibilityRole="text">
          <View style={styles.icon}>
            <BubbleIcons.Shield width={56} height={56} />
          </View>
          <View style={styles.col}>
            <Text style={text.xxlargeBlack}>
              {new Intl.NumberFormat('en-IE').format(data.totalCheckins)}
            </Text>
            <Text style={styles.text}>{t('appStats:totalCheckins')}</Text>
          </View>
        </View>
        <Spacing s={12} />
        <View style={styles.row} accessible accessibilityRole="text">
          <View style={styles.progress}>
            <Progress
              width={56}
              value={data.noSymptoms}
              color={colors.success}
            />
          </View>
          <View style={styles.rowPercentage}>
            <Text style={text.xxlargeBlack}>
              {new Intl.NumberFormat('en-IE').format(data.noSymptoms)}
            </Text>
            <Text style={text.xlargeBlack}>%</Text>
            <Text>&nbsp;</Text>
            <Text style={styles.text}>{t('appStats:noSymptoms')}</Text>
          </View>
        </View>
        <Spacing s={12} />
        <View style={styles.row} accessible accessibilityRole="text">
          <View style={styles.progress}>
            <Progress width={56} value={data.someSymptoms} color={colors.red} />
          </View>
          <View style={styles.rowPercentage}>
            <Text style={text.xxlargeBlack}>
              {new Intl.NumberFormat('en-IE').format(data.someSymptoms)}
            </Text>
            <Text style={text.xlargeBlack}>%</Text>
            <Text>&nbsp;</Text>
            <Text style={styles.text}>{t('appStats:someSymptoms')}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  col: {
    flex: 1,
    flexDirection: 'column'
  },
  text: {
    flex: 1,
    ...text.defaultBoldOpacity70
  },
  rowPercentage: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  icon: {
    marginRight: 20
  },
  progress: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20
  }
});
