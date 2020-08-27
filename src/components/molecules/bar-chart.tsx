import React, {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {YAxis, XAxis} from 'react-native-svg-charts';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';

import {text, colors} from 'theme';
import {BarChartContent} from 'components/atoms/bar-chart-content';
import {Spacing} from 'components/atoms/spacing';
import {scaleBand} from 'd3-scale';

interface TrackerBarChartProps {
  title?: string;
  label?: string;
  hint?: string;
  yesterday?: string;
  data: any;
  days?: number;
  rollingAverage?: number;
  intervalsCount?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  quantityKey: string;
}

const legendLineSize = 24;
const nbsp = ' ';

function formatLabel(value: number) {
  if (value > 1000000) {
    const millions = parseFloat((value / 1000000).toFixed(1));
    return `${millions}m`;
  }

  if (value > 1000) {
    const thousands = parseFloat((value / 1000).toFixed(1));
    return `${thousands}k`;
  }

  return value;
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

export const TrackerBarChart: FC<TrackerBarChartProps> = ({
  title,
  data,
  hint,
  yesterday,
  rollingAverage = 7,
  days = 30,
  intervalsCount = 6,
  primaryColor,
  backgroundColor,
  secondaryColor,
  quantityKey
}) => {
  const {t} = useTranslation();

  if (!data) {
    return null;
  }

  let axisData: Date[] = [];
  let chartData: number[] = [];
  const dataKeys = Object.keys(data);

  if (!Array.isArray(data)) {
    const reducedData = dataKeys.reduce(
      (records, date: string, index: number) => {
        const dataRecord = data[date] || data[index];
        return {
          axisData: [...records.axisData, new Date(date)],
          chartData: [...records.chartData, dataRecord[quantityKey]]
        };
      },
      {
        axisData: [],
        chartData: []
      } as {
        axisData: Date[];
        chartData: number[];
      }
    );
    axisData = reducedData.axisData;
    chartData = reducedData.chartData;
  } else {
    data.forEach((record) => {
      axisData.push(new Date(record.test_date || record.last_test_date));
      chartData.push(record[quantityKey]);
    });
  }
  const daysLimit = Math.min(days, chartData.length);

  chartData = trimData(chartData, daysLimit, rollingAverage);
  axisData = trimAxisData(axisData, daysLimit);

  if (!chartData.length || !axisData.length) {
    return null;
  }

  const last = chartData[chartData.length - 1];
  const labelString = `${last} ${yesterday}`;

  // Give x and y axis label text space to not get cropped
  const insetY = 6;
  const insetX = insetY + styles.chart.marginHorizontal;
  const contentInset = {
    top: insetY,
    bottom: insetY,
    left: insetX,
    right: insetX
  };

  // Where numbers are very small, don't labels like "0.5", or make one case look huge
  const maxValue = chartData.reduce((max, value) => Math.max(max, value), 0);
  const yMax = maxValue < 5 ? 5 : undefined;

  return (
    <>
      {title && (
        <>
          <Text style={styles.title}>{title}</Text>
          <Spacing s={16} />
        </>
      )}
      <View
        style={styles.chartingRow}
        accessible
        accessibilityHint={hint}
        accessibilityLabel={labelString}>
        <YAxis
          style={styles.yAxis}
          data={chartData}
          numberOfTicks={3}
          contentInset={contentInset}
          svg={{fontSize: 12, fill: colors.text}}
          formatLabel={formatLabel}
          max={yMax}
          min={0}
        />
        <View style={styles.chartingCol}>
          <BarChartContent
            chartData={chartData}
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
              if (chartData.length > 10 && index % intervalsCount) {
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
              if (index % intervalsCount) {
                return '';
              }
              const date = new Date(axisData[index]);
              return `${index === 0 ? nbsp : ''}${format(
                date,
                'MMM'
              ).toUpperCase()}${index === axisData.length - 1 ? nbsp : ''}`;
            }}
          />
        </View>
      </View>
      <Spacing s={16} />
      <View style={styles.legend}>
        <Svg height={legendLineSize} width={legendLineSize}>
          <Line
            x1={0}
            x2={legendLineSize}
            y={legendLineSize / 2}
            strokeWidth={3}
            stroke={colors.orange}
          />
        </Svg>
        <Text style={styles.legendLabel}>{t('charts:legend:averageLine')}</Text>
      </View>
    </>
  );
};

const xAxisSvg = {
  ...text.xsmallBold,
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
    marginHorizontal: 4
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
    justifyContent: 'center'
  },
  legendLabel: {
    textAlign: 'left',
    marginLeft: 16
  }
});
