import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';

import {Spacing} from 'components/atoms/spacing';
import {Card} from 'components/atoms/card';
import {TrackerBarChart} from 'components/molecules/bar-chart';

interface TrackerChartsProps {
  data: any;
  county: string;
}

export type AxisData = Date[];
export type ChartData = number[];

interface ExtractedData {
  axisData: AxisData;
  chartData: ChartData;
}

const chartDataIsAvailable = (data: ExtractedData) => {
  return !!(data.axisData?.length && data.chartData?.length);
};

const getBarchartData = (data: any, quantityKey: string) => {
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

  return {
    chartData,
    axisData
  };
};

const getComparableDate = (date: Date | string) => {
  return format(new Date(date), 'yyyy-mm-dd');
};

export const TrackerCharts: FC<TrackerChartsProps> = ({data, county = 'u'}) => {
  const {t} = useTranslation();

  const localData =
    county !== 'u' ? data?.byCounty?.counties[county] : data?.byDate?.aggregate;

  if (!localData) {
    return null;
  }

  const testsData = getBarchartData(localData, 'total_number_of_tests');
  const positivesData = getBarchartData(localData, 'new_positives');
  let percentData = {
    axisData: [],
    chartData: []
  } as ExtractedData;

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
      return {...newData};
    }, percentData);
  }

  return (
    <>
      {chartDataIsAvailable(testsData) && (
        <>
          <Card padding={{h: 12}}>
            <TrackerBarChart
              title={t('charts:tests:title')}
              hint={t('charts:tests:hint')}
              axisData={testsData.axisData}
              chartData={testsData.chartData}
            />
          </Card>
          <Spacing s={20} />
        </>
      )}
      {chartDataIsAvailable(percentData) && (
        <>
          <Card padding={{h: 12}}>
            <TrackerBarChart
              title={t('charts:positivityPercent:title')}
              hint={t('charts:positivityPercent:hint')}
              axisData={percentData.axisData}
              chartData={percentData.chartData}
              yMin={0.5}
              ySuffix="%"
            />
          </Card>
          <Spacing s={20} />
        </>
      )}
      {chartDataIsAvailable(positivesData) && (
        <Card padding={{h: 12}}>
          <TrackerBarChart
            title={t('charts:positiveTests:title')}
            hint={t('charts:positiveTests:hint')}
            axisData={positivesData.axisData}
            chartData={positivesData.chartData}
          />
        </Card>
      )}
    </>
  );
};
