import React from 'react';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useFormik} from 'formik';

import {SelectList} from 'components/atoms/select-list';

import {Symptom, SymptomRecord, symptoms} from 'constants/symptoms';

import {Spacing} from 'components/atoms/layout';
import {Card} from 'components/atoms/card';
import {Button} from 'components/atoms/button';
import {Scrollable} from 'components/templates/scrollable';

import {text, colors} from 'theme';
import {useApplication} from 'providers/context';

interface FormikReturn {
  values: SymptomRecord;
  setFieldValue: (
    field: Symptom,
    value: number,
    shouldValidate: boolean
  ) => void;
}

interface SymptomListItem {
  value: Symptom;
  label: string;
}

export const CheckInSymptoms = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const app = useApplication();

  const {values, setFieldValue}: FormikReturn = useFormik({
    initialValues: app.checkerSymptoms,
    onSubmit: () => {},
    enableReinitialize: true
  });

  const gotoResults = () => {
    try {
      app.checkIn(app.checkerSymptoms, {feelingWell: false});
    } catch (err) {
      console.log('Check-in error', err);
    }
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'history',
          params: {feelingWell: false, symptoms: app.checkerSymptoms}
        }
      ]
    });
  };

  const items: SymptomListItem[] = symptoms.map((symptom) => ({
    label: t(`checker:symptoms:${symptom}`),
    value: symptom
  }));

  const selectedValue: Symptom[] = items.reduce((selectedSymptoms, item) => {
    const symptom: Symptom = item.value;

    return values[symptom] ? [...selectedSymptoms, symptom] : selectedSymptoms;
  }, [] as Symptom[]);

  const handleItemSelected = async (symptom: Symptom) => {
    const newValue = Number(!values[symptom]);
    setFieldValue(symptom, newValue, false);
    await app.setContext({
      checkerSymptoms: {
        ...app.checkerSymptoms,
        ...values,
        [symptom]: newValue
      }
    });
  };

  return (
    <Scrollable
      safeArea={false}
      backgroundColor={colors.white}
      heading={t('checker:title')}>
      <Card>
        <Text style={text.largeBold}>{`${t(
          'checker:symptoms:subtitle'
        )}`}</Text>
        <Spacing s={36} />
        <SelectList
          items={items}
          selectedValue={selectedValue}
          multiSelect={true}
          onItemSelected={handleItemSelected}
        />
        <Spacing s={36} />
        <Button onPress={gotoResults}>
          {t('checker:symptoms:nextButton')}
        </Button>
      </Card>
    </Scrollable>
  );
};
