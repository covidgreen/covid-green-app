import React, {FC, useState, useRef} from 'react';
import {Text, View, TextInput, ViewStyle, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import phone from 'phone';
import * as Haptics from 'expo-haptics';

import {Spacing} from 'components/atoms/layout';
import {Button} from 'components/atoms/button';

import {baseStyles, inputStyle, colors} from 'theme';

import countryCodes from 'assets/country-codes';

export interface CallBackData {
  iso: string;
  code: string;
  number: string;
  mobile: string;
}

interface PhoneNumberValues {
  iso: string;
  number: string;
}

const callBackDefaultValues: PhoneNumberValues = {
  iso: 'US',
  number: ''
};

function isValidPhoneNumber(value: string = ''): boolean {
  if (!value) {
    return true;
  }

  const country = countryCodes.find((cc) => cc.iso === this.parent.iso);
  if (!country) {
    return false;
  }

  const number = value.replace(/^0+/, '');
  const result = phone(`${country.code}${number}`, country.iso);
  return result && result.length > 0;
}

const callBackSchema = Yup.object().shape({
  iso: Yup.string(),
  number: Yup.string()
    .matches(/^[\d\s-]+$/, 'invalid')
    .test('is-valid', 'invalid', isValidPhoneNumber)
});

const phoneStyle = inputStyle();

interface PhoneNumberUsProps {
  style?: ViewStyle;
  buttonLabel: string;
  onSuccess?: (value: CallBackData) => void;
}

export const PhoneNumberUs: FC<PhoneNumberUsProps> = ({
  style,
  buttonLabel,
  onSuccess
}) => {
  const {t} = useTranslation();

  const [initialValues] = useState<PhoneNumberValues>(callBackDefaultValues);
  const numberInputRef = useRef<TextInput | null>(null);

  const callBackForm = useFormik({
    initialValues,
    validationSchema: callBackSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async ({iso, number}) => {
      const country = countryCodes.find((cc) => cc.iso === iso);
      const [mobile] = phone(
        `${country?.code}${number.replace(/^0+/, '')}`,
        iso
      );

      const callbackData: CallBackData = {
        iso,
        code: country?.code || callBackDefaultValues.iso,
        number,
        mobile
      };
      onSuccess && onSuccess(callbackData);
    }
  });

  return (
    <View style={style}>
      <Text style={baseStyles.label}>{t('phoneNumberUs:label')}</Text>
      <Spacing s={4} />
      <TextInput
        ref={(e) => {
          numberInputRef.current = e;
        }}
        style={phoneStyle}
        placeholderTextColor={colors.main}
        keyboardType="number-pad"
        returnKeyType="done"
        maxLength={14}
        placeholder={t('phoneNumberUs:placeholder')}
        onChangeText={(value) => {
          if (value.length === 0 || /^\d+$/.test(value)) {
            callBackForm.setFieldValue('number', value || '');
          }
        }}
        onBlur={() => callBackForm.setFieldTouched('number', true)}
        value={callBackForm.values.number}
      />
      {callBackForm.errors.number && callBackForm.touched.number && (
        <>
          <Spacing s={8} />
          <Text style={baseStyles.error}>
            {t(`phoneNumberUs:error:${callBackForm.errors.number}`)}
          </Text>
        </>
      )}
      <Spacing s={32} />
      <Button
        disabled={!callBackForm.isValid || !callBackForm.dirty}
        onPress={async () => {
          callBackForm.handleSubmit();
          const errors = await callBackForm.validateForm(callBackForm.values);
          if (!callBackForm.isValid || errors.number || errors.iso) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }}>
        {buttonLabel}
      </Button>
    </View>
  );
};
