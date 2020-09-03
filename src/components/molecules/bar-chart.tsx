import React, {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Svg, {Line, Rect} from 'react-native-svg';
import {YAxis, XAxis} from 'react-native-svg-charts';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';

import {text, colors} from 'theme';
import {BarChartContent} from 'components/atoms/bar-chart-content';
import {Spacing} from 'components/atoms/spacing';
import {scaleBand} from 'd3-scale';
import {ChartData, AxisData} from '../organisms/tracker-charts';

interface TrackerBarChartProps {
  title?: string;
  description?: string;
  chartData: ChartData;
  axisData: AxisData;
  days?: number;
  yMin?: number;
  ySuffix?: string;
  averagesData?: ChartData;
  rollingAverage?: number;
  intervalsCount?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const legendItemSize = 16;
const nbsp = ' ';

function formatLabel(value: number, suffix: string) {
  if (value >= 1000000) {
    const millions = parseFloat((value / 1000000).toFixed(1));
    return `${millions}m`;
  }

  if (value >= 1000) {
    const thousands = parseFloat((value / 1000).toFixed(1));
    return `${thousands}k`;
  }

  return value + suffix;
}

function trimData(data: any[], days: number, rolling: number) {
  const rollingOffset = Math.max(0, rolling - 1);
  const trimLength = days + rollingOffset;
  const excessLength = data.length - trimLength;
  return excessLength > 0 ? data.slice(excessLength) : data;
}

function trimAxisData(axisData: any[], days: number) {
  const excessLength = axisData.length - days;
  return excessLength > 0 ? axisData.slice(excessLength) : axisData;
}

function roundNumber(num: number, places: number = 2) {
  return num.toFixed(Number.isInteger(num) ? 0 : places);
}

export const TrackerBarChart: FC<TrackerBarChartProps> = ({
  title,
  chartData,
  axisData,
  averagesData,
  description,
  rollingAverage = 0,
  days = 30,
  yMin = 5,
  ySuffix = '',
  intervalsCount = 6,
  primaryColor = '#CD4000',
  secondaryColor = '#ACAFC4',
  backgroundColor = colors.white
}) => {
  const {t} = useTranslation();

  const daysLimit = Math.min(days, chartData.length);

  chartData = trimData(chartData, daysLimit, rollingAverage);
  axisData = trimAxisData(axisData, daysLimit);

  if (!chartData.length || !axisData.length) {
    return null;
  }

  const isAxisLabelHidden = (index: number, showIfLessDataThan: number = 0) =>
    chartData.length > showIfLessDataThan &&
    index % intervalsCount &&
    index !== axisData.length - 1;

  const dataSummary = axisData.reduce((summaryText, date, index) => {
    if (isAxisLabelHidden(index)) {
      return summaryText;
    }
    const previousText = summaryText ? `${summaryText}, ` : '';
    return `${previousText}${format(date, 'MMMM')} ${format(
      date,
      'do'
    )}: ${roundNumber(chartData[index])}${ySuffix}`;
  }, '');

  // Give x and y axis label text space to not get cropped
  const insetY = 8;
  const insetX = 6;
  const contentInset = {
    top: insetY,
    bottom: insetY,
    left: insetX,
    right: insetX
  };

  // Where numbers are very small, don't labels like "0.5", or make one case look huge
  const maxValue = chartData.reduce((max, value) => Math.max(max, value), 0);
  const yMax = maxValue < yMin ? yMin : undefined;

  const showLegend = !!(rollingAverage || averagesData);

  return (
    <View
      accessible
      accessibilityLabel={description}
      accessibilityHint={dataSummary}>
      {title && (
        <>
          <Text style={styles.title}>{title}</Text>
          <Spacing s={16} />
        </>
      )}
      <View
        accessibilityElementsHidden={true}
        importantForAccessibility="no-hide-descendants"
        style={styles.chartingRow}>
        <YAxis
          style={styles.yAxis}
          data={chartData}
          numberOfTicks={3}
          contentInset={contentInset}
          svg={{...text.smallBold, fill: colors.text}}
          formatLabel={(d) => formatLabel(d, ySuffix)}
          max={yMax}
          min={0}
        />
        <View style={styles.chartingCol}>
          <BarChartContent
            chartData={chartData}
            averagesData={averagesData}
            days={daysLimit}
            cornerRoundness={2}
            scale={scaleBand}
            contentInset={contentInset}
            style={styles.chart}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            backgroundColor={backgroundColor}
            rollingAverage={rollingAverage}
            yMax={yMax}
          />
          <XAxis
            data={chartData}
            contentInset={contentInset}
            scale={scaleBand}
            svg={{...xAxisSvg, y: 3}}
            formatLabel={(_, index) => {
              if (isAxisLabelHidden(index, 10)) {
                return '';
              }
              const date = new Date(axisData[index]);
              return `${format(date, 'dd')}`;
            }}
          />
          <XAxis
            data={chartData}
            contentInset={contentInset}
            scale={scaleBand}
            svg={xAxisSvg}
            formatLabel={(_, index) => {
              if (isAxisLabelHidden(index)) {
                return '';
              }
              const date = new Date(axisData[index]);
              return `${index === 0 ? nbsp + nbsp : ''}${format(
                date,
                'MMM'
              ).toUpperCase()}${
                index === axisData.length - 1 ? nbsp + nbsp : ''
              }`;
            }}
          />
        </View>
      </View>
      {!!showLegend && (
        <>
          <Spacing s={16} />
          <View style={styles.legend}>
            <View style={styles.legend}>
              <Svg height={legendItemSize} width={legendItemSize}>
                <Rect
                  x={0}
                  y={0}
                  width={legendItemSize}
                  height={legendItemSize}
                  fill={secondaryColor}
                />
              </Svg>
              <Text style={styles.legendLabel}>
                {t('charts:legend:dailyTotal')}
              </Text>
            </View>
            <View style={styles.legend}>
              <Svg height={legendItemSize} width={legendItemSize}>
                <Line
                  x1={0}
                  x2={legendItemSize}
                  y={legendItemSize / 2}
                  strokeWidth={3}
                  stroke={primaryColor}
                />
              </Svg>
              <Text style={styles.legendLabel}>
                {t('charts:legend:averageLine')}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const xAxisSvg = {
  ...text.smallBold,
  fill: colors.text
};

const styles = StyleSheet.create({
  title: {
    ...text.defaultBold,
    textAlign: 'center'
  },
  chartingRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white
  },
  yAxis: {
    ...text.smallBold,
    width: 48,
    height: 144,
    paddingRight: 4
  },
  chartingCol: {
    flex: 1,
    flexDirection: 'column'
  },
  chart: {
    flex: 1,
    height: 144,
    marginRight: 6,
    marginLeft: 5
  },
  leftAlign: {
    textAlign: 'left'
  },
  rightAlign: {
    textAlign: 'right'
  },
  legend: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16
  },
  legendLabel: {
    ...text.small,
    textAlign: 'left',
    marginLeft: 8
  }
});
