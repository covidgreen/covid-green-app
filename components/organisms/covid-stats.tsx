import React, {FC} from 'react';
import {StyleSheet, View, ViewStyle, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {CovidStatistics} from '../../services/api';
import {Spacing} from '../atoms/spacing';
import {Heading} from '../atoms/heading';
import {CountyBreakdownCard} from '../molecules/county-breakdown-card';
import {text} from '../../theme';
import {Card} from '../atoms/card';
import {BubbleIcons} from '../../assets/icons';

interface CovidStatsProps {
  style?: ViewStyle;
  data: CovidStatistics;
  onCountyBreakdown: () => void;
}

export const CovidStats: FC<CovidStatsProps> = ({
  style,
  data,
  onCountyBreakdown
}) => {
  const {t} = useTranslation();

  return (
    <View style={[styles.container, style]}>
      <Heading text={t('stats:title')} />
      <CountyBreakdownCard onPress={onCountyBreakdown} />
      <Spacing s={16} />
      <Card>
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.confirmedBackground]}>
            <BubbleIcons.Cases width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={[text.xxlargeBlack, styles.columnText]}>
              {new Intl.NumberFormat('en-IE').format(data.confirmed)}
            </Text>
            <Text style={[text.defaultBoldOpacity70, styles.columnText]}>
              {t('stats:totalConfirmed')}
            </Text>
          </View>
        </View>
        <Spacing s={16} />
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.deathsBackground]}>
            <BubbleIcons.Deaths width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={text.xxlargeBlack}>
              {new Intl.NumberFormat('en-IE').format(data.deaths)}
            </Text>
            <Text style={text.defaultBoldOpacity70}>
              {t('stats:totalDeaths')}
            </Text>
          </View>
        </View>
        <Spacing s={16} />
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.hospitalisedBackground]}>
            <BubbleIcons.Hospital width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={text.xxlargeBlack}>
              {new Intl.NumberFormat('en-IE').format(data.hospitalised)}
            </Text>
            <Text style={text.defaultBoldOpacity70}>
              {t('stats:totalHospitalised')}
            </Text>
          </View>
        </View>
        <Spacing s={16} />
        <View style={styles.row}>
          <View style={[iconStyle.icon, styles.icuBackground]}>
            <BubbleIcons.ICU width={56} height={56} />
          </View>
          <View style={styles.column} accessible accessibilityRole="text">
            <Text style={text.xxlargeBlack}>
              {new Intl.NumberFormat('en-IE').format(data.requiredICU)}
            </Text>
            <Text style={text.defaultBoldOpacity70}>
              {t('stats:requiredICU')}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const iconStyle = StyleSheet.create({
  icon: {
    borderRadius: 28,
    marginRight: 20
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  icuBackground: {
    backgroundColor: '#ebf8ff'
  },
  hospitalisedBackground: {
    backgroundColor: '#f4eafc'
  },
  deathsBackground: {
    backgroundColor: '#a1a1a1'
  },
  confirmedBackground: {
    backgroundColor: '#fed7e2'
  },
  iconSize: {
    width: 36,
    height: 36
  },
  column: {
    flexDirection: 'column'
  },
  columnText: {
    width: '100%'
  }
});
