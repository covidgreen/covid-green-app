import React, {FC} from 'react';
import {ViewStyle, StyleProp, StyleSheet} from 'react-native';
import {Rect, G, Path} from 'react-native-svg';
import {BarChart, Grid} from 'react-native-svg-charts';
import {colors} from 'theme';
import {line, curveMonotoneX} from 'd3-shape';

interface BarChartContentProps {
  chartData: number[];
  contentInset: {top: number; bottom: number};
  rollingAverage?: number;
  days?: number;
  primaryColor?: string;
  backgroundColor?: string;
  secondaryColor?: string;
  cornerRoundness?: number;
  gapPercent?: number;
  style?: StyleProp<ViewStyle>;
  yMax?: number;
}

interface BarChildProps {
  x: (index: number) => number;
  y: (value: number) => number;
  bandwidth: number; // width of bar
  data: number[];
}

export const BarChartContent: FC<BarChartContentProps> = ({
  chartData,
  contentInset,
  rollingAverage = 0,
  days = chartData.length,
  primaryColor = colors.orange,
  secondaryColor = colors.lightOrange,
  backgroundColor = colors.white,
  cornerRoundness = 4,
  gapPercent = 25,
  style,
  yMax
}) => {
  const rollingOffset = Math.max(0, rollingAverage - 1);
  const startPoint = Math.max(0, chartData.length - (days + rollingOffset));
  const visibleChartData = chartData.slice(startPoint);

  const RoundedBarToppers: FC<BarChildProps> = (props) => {
    const {x, y, bandwidth, data} = props;
    return (
      <G>
        {data.map((value, index) => (
          <Rect
            x={x(index)}
            y={y(value) - cornerRoundness}
            rx={cornerRoundness}
            ry={cornerRoundness}
            width={bandwidth}
            height={cornerRoundness * 2} // Height of the Rect
            fill={secondaryColor}
            key={`bar-${index}`}
          />
        ))}
      </G>
    );
  };

  const TrendLine: FC<BarChildProps> = (props) => {
    const {x, y, bandwidth} = props;
    const rollingData = rollingAverage
      ? visibleChartData.map((_, index) => {
          const avStart =
            rollingAverage + index > chartData.length
              ? Math.max(0, index - rollingAverage)
              : index;
          const avEnd = Math.min(rollingAverage + index, chartData.length - 1);
          const avValues = chartData.slice(avStart, avEnd);
          const total = avValues.reduce((sum, num) => sum + num, 0);
          return total / avValues.length;
        })
      : chartData;

    const lineGenerator = line();
    lineGenerator.curve(curveMonotoneX);
    const pathDef = lineGenerator(
      rollingData.map((value, index) => [x(index) + bandwidth / 2, y(value)])
    );
    return pathDef ? (
      <Path
        d={pathDef}
        stroke={primaryColor}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : null;
  };

  // Covers ends of bars hanging below line due to corner roundnesss
  const XAxisTrim: FC<BarChildProps> = (props) => {
    if (!props) {
      return null;
    }
    const {x, y, bandwidth, data} = props;
    return (
      <Rect
        x={x && x(0)}
        y={y && y(0) - cornerRoundness}
        width={x(data?.length - 1) + bandwidth} // Full width of x axis
        height={cornerRoundness + 2}
        fill={backgroundColor}
      />
    );
  };

  return (
    <BarChart
      style={style}
      data={visibleChartData}
      gridMin={0}
      numberOfTicks={3}
      spacingInner={gapPercent / 100}
      spacingOuter={gapPercent / 100}
      contentInset={{
        top: contentInset.top + cornerRoundness,
        bottom: contentInset.bottom - cornerRoundness
      }}
      yMax={yMax}
      svg={{
        fill: secondaryColor
      }}>
      <Grid
        svg={{
          y: 0 - cornerRoundness,
          strokeWidth: 1,
          stroke: colors.dot,
          strokeDasharray: [5, 3],
          strokeDashoffset: 0
        }}
      />
      {/* @ts-ignore: gets BarChildProps from BarChart parent */}
      <RoundedBarToppers />
      {/* @ts-ignore: gets BarChildProps from BarChart parent */}
      <XAxisTrim />
      {/* @ts-ignore: gets BarChildProps from BarChart parent */}
      <TrendLine />
    </BarChart>
  );
};
