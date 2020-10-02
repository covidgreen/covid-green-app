import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {add, format, parseISO} from 'date-fns';

import {Spacing} from 'components/atoms/spacing';
import {Card} from 'components/atoms/card';
import {TrackerBarChart} from 'components/molecules/bar-chart';

interface TrackerChartsProps {
  data: any;
  county: string;
  days?: number;
  rollingAverage?: number;
}

export type AxisData = Date[];
export type ChartData = number[];

interface ExtractedData {
  axisData: AxisData;
  chartData: ChartData;
  averagesData: ChartData;
}

const getEmptyExtractedData = (): ExtractedData => {
  const emptyData = {
    axisData: [],
    chartData: [],
    averagesData: []
  } as ExtractedData;
  return emptyData;
};

const dateIsValid = (date: Date) => !isNaN(Number(date));

const chartDataIsAvailable = (data: ExtractedData) => {
  return !!(
    data.axisData?.length &&
    data.chartData?.length &&
    data.axisData?.every(dateIsValid)
  );
};

export function trimData(data: any[], days: number, rolling: number = 0) {
  const rollingOffset = Math.max(0, rolling - 1);
  const trimLength = days + rollingOffset;
  const excessLength = data.length - trimLength;
  const trimmedData = excessLength > 0 ? data.slice(excessLength) : data;
  return trimmedData.map((d) => Number(d) || 0);
}

function trimAxisData(axisData: any[], days: number) {
  const excessLength = axisData.length - days;
  return excessLength > 0 ? axisData.slice(excessLength) : axisData;
}

function parseDateString(dateString: string) {
  // date-fns format() and parse fns use device timezone, but new Date() uses UTC
  // On Android (but not iOS), west of GMT this causes formatted dates to be -1 day
  let date = parseISO(dateString);

  // Don't fail if the server changes date format unexpectedly
  if (!dateIsValid(date)) {
    const utcDate = new Date(dateString);
    const offsetMinutes = utcDate.getTimezoneOffset();
    date = add(utcDate, {minutes: offsetMinutes});
  }

  return date;
}

const calculateRollingAverages = (
  rollingAverage: number,
  chartData: ChartData
) => {
  const rollingOffset = Math.max(0, rollingAverage - 1);
  return chartData.map((_, index) => {
    const avStart = Math.max(0, index - rollingOffset);
    const avEnd = index + 1;
    const avValues = chartData.slice(avStart, avEnd);
    const total = avValues.reduce((sum, num) => sum + num, 0);
    return total / avValues.length;
  });
};

const getBarchartData = (
  data: any,
  quantityKey: string,
  averagesKey: string,
  days: number,
  rollingAverage: number
) => {
  let axisData: Date[] = [];
  let chartData: number[] = [];
  let averagesData: number[] = [];
  const dataKeys = Object.keys(data);

  if (!Array.isArray(data)) {
    const reducedData = dataKeys.reduce(
      (records, date: string, index: number) => {
        const dataRecord = data[date] || data[index];
        return {
          axisData: [...records.axisData, parseDateString(date)],
          chartData: [...records.chartData, dataRecord[quantityKey]],
          averagesData: averagesKey
            ? [...records.averagesData, dataRecord[averagesKey]]
            : []
        };
      },
      {
        axisData: [],
        chartData: [],
        averagesData: []
      } as ExtractedData
    );
    axisData = reducedData.axisData;
    chartData = reducedData.chartData;
    averagesData = reducedData.averagesData;
  } else {
    data.forEach((record) => {
      axisData.push(parseDateString(record.test_date || record.last_test_date));
      chartData.push(record[quantityKey]);
      if (averagesKey) {
        averagesData.push(record[averagesKey]);
      }
    });
  }

  // Calculate rolling averages here to guarentee accuracy
  // unless the server provided insufficient data
  const finalAveragesData =
    rollingAverage && chartData.length >= days + rollingAverage - 1
      ? calculateRollingAverages(rollingAverage, chartData)
      : averagesData;

  return {
    chartData: trimData(chartData, days),
    axisData: trimAxisData(axisData, days),
    averagesData: trimData(finalAveragesData, days)
  };
};

const getComparableDate = (date: Date) => {
  return format(date, 'yyyy-mm-dd');
};

export const TrackerCharts: FC<TrackerChartsProps> = ({
  data,
  county = 'u',
  days = 30,
  rollingAverage = 7 // If > 0, calculate in-app, don't use data from server
}) => {
  const {t} = useTranslation();

  const localData =
    county !== 'u' ? data?.byCounty?.counties[county] : data?.byDate?.aggregate;

  if (!localData) {
    return null;
  }

  let testsData = getEmptyExtractedData();
  let positivesData = getEmptyExtractedData();
  let percentData = getEmptyExtractedData();
  try {
    testsData = getBarchartData(
      localData,
      'total_number_of_tests',
      'average_number_of_tests',
      days,
      rollingAverage
    );
    positivesData = getBarchartData(
      localData,
      'new_positives',
      'average_new_positives',
      days,
      rollingAverage
    );

    if (testsData.axisData.length && positivesData.axisData.length) {
      percentData = testsData.axisData.reduce((newData, date, testsIndex) => {
        const positivesIndex = positivesData.axisData.findIndex(
          (pDate) => getComparableDate(date) === getComparableDate(pDate)
        );

        if (positivesIndex === -1) {
          return newData;
        }
        newData.axisData.push(date);

        const testsValue = testsData.chartData[testsIndex];
        const positivesValue = positivesData.chartData[positivesIndex];
        newData.chartData.push(
          testsValue ? (positivesValue / testsValue) * 100 : 0
        );

        const testsAv = testsData.averagesData[testsIndex];
        const posAv = positivesData.averagesData[positivesIndex];
        if (typeof testsAv === 'number' && typeof posAv === 'number') {
          newData.averagesData.push(testsAv ? (posAv / testsAv) * 100 : 0);
        }
        return {...newData};
      }, percentData);
    }
  } catch (err) {
    console.warn('Error processing chart data: ', err);
    return null;
  }

  return (
    <>
      {chartDataIsAvailable(percentData) && (
        <>
          <Card padding={{h: 12}}>
            <TrackerBarChart
              title={t('charts:positivityPercent:title')}
              description={t('charts:positivityPercent:hint')}
              axisData={percentData.axisData}
              chartData={percentData.chartData}
              averagesData={percentData.averagesData}
              yMin={1}
              ySuffix="%"
            />
          </Card>
          <Spacing s={20} />
        </>
      )}
      {chartDataIsAvailable(positivesData) && (
        <>
          <Card padding={{h: 12}}>
            <TrackerBarChart
              title={t('charts:positiveTests:title')}
              description={t('charts:positiveTests:hint')}
              axisData={positivesData.axisData}
              chartData={positivesData.chartData}
              averagesData={positivesData.averagesData}
            />
          </Card>
          <Spacing s={20} />
        </>
      )}
      {chartDataIsAvailable(testsData) && (
        <Card padding={{h: 12}}>
          <TrackerBarChart
            title={t('charts:tests:title')}
            description={t('charts:tests:hint')}
            axisData={testsData.axisData}
            chartData={testsData.chartData}
            averagesData={testsData.averagesData}
          />
        </Card>
      )}
    </>
  );
};
