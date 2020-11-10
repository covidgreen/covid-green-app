import React, {FC} from 'react';
import {
  ViewStyle,
  StyleProp,
  View,
  Text,
  StyleSheet,
  I18nManager
} from 'react-native';
import {Rect, G, Path} from 'react-native-svg';
import {BarChart, Grid} from 'react-native-svg-charts';
import {colors, text} from 'theme';
import {directionChar} from 'services/i18n/common';

import {line, curveMonotoneX} from 'd3-shape';
import {ScaleBand} from 'd3-scale';
import {ChartData, AxisData} from 'components/organisms/tracker-charts';

interface BarChartContentProps {
  chartData: number[];
  axisData: AxisData;
  averagesData: ChartData;
  contentInset: {top: number; bottom: number};
  rollingAverage?: number;
  days: number;
  primaryColor: string;
  backgroundColor: string;
  secondaryColor: string;
  cornerRoundness?: number;
  gapPercent?: number;
  style?: StyleProp<ViewStyle>;
  scale: ScaleBand<any>;
  yMax?: number;
  ySuffix?: string;
}

interface BarChildProps {
  x: (index: number) => number;
  y: (value: number) => number;
  bandwidth: number; // width of bar
  data: Array<{value: number}>;
}

interface TrendLineProps extends BarChildProps {
  lineWidth: number;
  color: string;
}

const lastBarIndex = (data: any[]) => (I18nManager.isRTL ? 0 : data.length - 1);

export const BarChartContent: FC<BarChartContentProps> = ({
  chartData,
  averagesData,
  contentInset,
  primaryColor,
  secondaryColor,
  backgroundColor,
  cornerRoundness = 4,
  gapPercent = 25,
  style,
  scale,
  yMax,
  ySuffix = ''
}) => {
  const RoundedBarToppers: FC<BarChildProps> = (props) => {
    const {x, y, bandwidth, data} = props;
    return (
      <G>
        {data.map((value, index) => (
          <Rect
            x={x(index)}
            y={y(value.value) - cornerRoundness}
            rx={cornerRoundness}
            ry={cornerRoundness}
            width={bandwidth}
            height={cornerRoundness * 2} // Height of the Rect
            fill={index === lastBarIndex(data) ? colors.purple : secondaryColor}
            key={`bar-${index}`}
          />
        ))}
      </G>
    );
  };

  const TrendLine: FC<TrendLineProps> = (props) => {
    const {x, y, bandwidth, lineWidth, color} = props;

    const lineGenerator = line();
    lineGenerator.curve(curveMonotoneX);
    const pathDef = lineGenerator(
      averagesData.reduce((points, value, index) => {
        if (isNaN(x(index))) {
          return points;
        }
        return [...points, [(x(index) || 0) + bandwidth / 2, y(value) || 0]];
      }, [] as [number, number][])
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
    <TrendLine lineWidth={5} color={backgroundColor} {...props} />
  );
  const ForegroundTrendLine: FC<BarChildProps> = (props) => (
    /* @ts-ignore: gets BarChildProps from BarChart parent */
    <TrendLine lineWidth={3} color={primaryColor} {...props} />
  );

  const Label: FC<BarChildProps> = (props) => {
    const {y, bandwidth, data} = props;
    const lastValue = data[lastBarIndex(data)];
    return lastValue ? (
      <View
        accessible={true}
        style={[
          styles.label,
          {
            top: y(lastValue.value) - 35,
            right: bandwidth / 2 - 13
          }
        ]}
        key={`label-${lastValue.value}`}>
        <View style={styles.triangle} />
        <View style={styles.triangle2} />
        <Text maxFontSizeMultiplier={1} style={styles.labelText}>
          {ySuffix !== '%'
            ? new Intl.NumberFormat('en-US').format(lastValue.value)
            : `${lastValue.value.toFixed(2)}${directionChar}%`}
        </Text>
      </View>
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

  const showTrendLine = !!averagesData.length;
  return (
    <View accessible>
      <BarChart
        style={[
          style,
          {marginStart: contentInset.left - 2, marginEnd: contentInset.right}
        ]}
        data={chartData.map((value: number, index: number) =>
          index === lastBarIndex(chartData)
            ? {value, svg: {fill: colors.purple}}
            : {value}
        )}
        yAccessor={({item}: {item: {value: number}}) => item.value}
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
        <Label />
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
        {<RoundedBarToppers />}
        {/* @ts-ignore: gets BarChildProps from BarChart parent */}
        {<XAxisTrim />}
        {/* @ts-ignore: gets BarChildProps from BarChart parent */}
        {showTrendLine && <BackgroundTrendLine />}
        {/* @ts-ignore: gets BarChildProps from BarChart parent */}
        {showTrendLine && <ForegroundTrendLine />}
      </BarChart>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ACAFC4',
    position: 'absolute',
    minWidth: 60,
    borderRadius: 5,
    backgroundColor: `${colors.white}E4`,
    paddingBottom: 1
  },
  triangle: {
    width: 5,
    height: 11,
    position: 'absolute',
    bottom: -11,
    left: 36,
    borderLeftWidth: 7,
    borderLeftColor: 'transparent',
    borderRightWidth: 7,
    borderRightColor: 'transparent',
    borderTopWidth: 7,
    borderTopColor: '#ACAFC4'
  },
  triangle2: {
    width: 5,
    height: 11,
    position: 'absolute',
    bottom: -11,
    left: 37,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderTopWidth: 6,
    borderTopColor: 'white'
  },
  labelText: {...text.smallBold, color: colors.text, textAlign: 'center'}
});
