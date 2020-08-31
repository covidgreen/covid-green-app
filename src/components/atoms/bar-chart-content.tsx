import React, {FC} from 'react';
import {ViewStyle, StyleProp} from 'react-native';
import {Rect, G, Path} from 'react-native-svg';
import {BarChart, Grid} from 'react-native-svg-charts';
import {colors} from 'theme';
import {line, curveMonotoneX} from 'd3-shape';
import {ScaleBand} from 'd3-scale';
import {ChartData, AxisData} from 'components/organisms/tracker-charts';

interface BarChartContentProps {
  chartData: ChartData;
  axisData: AxisData;
  averagesData?: ChartData;
  contentInset: {top: number; bottom: number};
  rollingAverage?: number;
  days?: number;
  primaryColor: string;
  backgroundColor: string;
  secondaryColor: string;
  cornerRoundness?: number;
  gapPercent?: number;
  style?: StyleProp<ViewStyle>;
  scale: ScaleBand<any>;
  yMax?: number;
}

interface BarChildProps {
  x: (index: number) => number;
  y: (value: number) => number;
  bandwidth: number; // width of bar
  data: number[];
}

interface TrendLineProps extends BarChildProps {
  lineWidth: number;
  color: string;
}

const calculateRollingAverages = (
  rollingAverage: number | undefined,
  visibleChartData: ChartData,
  chartData: ChartData
) =>
  rollingAverage
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

export const BarChartContent: FC<BarChartContentProps> = ({
  chartData,
  averagesData,
  contentInset,
  rollingAverage = 0,
  days = chartData.length,
  primaryColor,
  secondaryColor,
  backgroundColor,
  cornerRoundness = 4,
  gapPercent = 25,
  style,
  scale,
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

  const TrendLine: FC<TrendLineProps> = (props) => {
    const {x, y, bandwidth, lineWidth, color} = props;
    const rollingData =
      averagesData ||
      calculateRollingAverages(rollingAverage, visibleChartData, chartData);

    const lineGenerator = line();
    lineGenerator.curve(curveMonotoneX);
    const pathDef = lineGenerator(
      rollingData.map((value, index) => [x(index) + bandwidth / 2, y(value)])
    );
    return pathDef ? (
      <Path
        d={pathDef}
        stroke={color}
        strokeWidth={lineWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : null;
  };

  const BackgroundTrendLine: FC<BarChildProps> = (props) => (
    /* @ts-ignore: gets BarChildProps from BarChart parent */
    <TrendLine lineWidth={9} color={backgroundColor} {...props} />
  );
  const ForegroundTrendLine: FC<BarChildProps> = (props) => (
    /* @ts-ignore: gets BarChildProps from BarChart parent */
    <TrendLine lineWidth={3} color={primaryColor} {...props} />
  );

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

  const showTrendLine = !!rollingAverage || averagesData;

  return (
    <BarChart
      style={style}
      data={visibleChartData}
      gridMin={0}
      scale={scale}
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
      {showTrendLine && <BackgroundTrendLine />}
      {/* @ts-ignore: gets BarChildProps from BarChart parent */}
      {showTrendLine && <ForegroundTrendLine />}
    </BarChart>
  );
};
