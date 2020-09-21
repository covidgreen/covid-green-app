import React, {useState, useEffect, useCallback} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {useTranslation} from 'react-i18next';
import {useExposure} from 'react-native-exposure-notification-service';

import {useApplication, StorageKeys} from 'providers/context';
import {
  validateCode,
  uploadExposureKeys,
  ValidationResult
} from 'services/api/exposures';

import {Spacing} from 'components/atoms/layout';
import {Button} from 'components/atoms/button';
import {CodeInput} from 'components/molecules/code-input';
import {Markdown} from 'components/atoms/markdown';
import {Toast} from 'components/atoms/toast';
import {ResultCard} from 'components/molecules/result-card';
import {KeyboardScrollable} from 'components/templates/keyboard-scrollable';
import {useFocusRef, setAccessibilityFocusRef} from 'hooks/accessibility';

import {colors, baseStyles} from 'theme';
import {AppIcons} from 'assets/icons';

type UploadStatus =
  | 'initialising'
  | 'validate'
  | 'upload'
  | 'uploadOnly'
  | 'success'
  | 'permissionError'
  | 'error';

export const UploadKeys = ({navigation}) => {
  const {t} = useTranslation();
  const {getDiagnosisKeys} = useExposure();
  const {showActivityIndicator, hideActivityIndicator} = useApplication();

  const [status, setStatus] = useState<UploadStatus>('initialising');
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string>('');
  const [uploadToken, setUploadToken] = useState('');
  const [symptomDate, setSymptomDate] = useState('');
  const [uploadRef, errorRef] = useFocusRef({
    timeout: 1000,
    count: 2
  });

  useEffect(() => {
    const readUploadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(StorageKeys.uploadToken);
        const storedSymptomDate = await SecureStore.getItemAsync(
          StorageKeys.symptomDate
        );
        if (token && storedSymptomDate) {
          setUploadToken(token);
          setSymptomDate(storedSymptomDate);
          setStatus('uploadOnly');
          return;
        }
      } catch (e) {}

      setStatus('validate');
    };
    readUploadToken();
  }, []);

  const codeValidationHandler = useCallback(async () => {
    showActivityIndicator();
    const {result, symptomDate, token} = await validateCode(code);
    hideActivityIndicator();

    if (result !== ValidationResult.Valid) {
      let errorMessage;
      if (result === ValidationResult.NetworkError) {
        errorMessage = t('common:networkError');
      } else if (result === ValidationResult.Expired) {
        errorMessage = t('uploadKeys:code:expiredError');
      } else if (result === ValidationResult.Invalid) {
        errorMessage = t('uploadKeys:code:invalidError');
      } else {
        errorMessage = t('uploadKeys:code:error');
      }
      setValidationError(errorMessage);
      setTimeout(() => {
        setAccessibilityFocusRef(errorRef);
      }, 550);
      return;
    }

    try {
      await SecureStore.setItemAsync(StorageKeys.uploadToken, token!);
      await SecureStore.setItemAsync(StorageKeys.symptomDate, symptomDate!);
    } catch (e) {
      console.log('Error (secure) storing upload token', e);
    }
    setValidationError('');

    setUploadToken(token!);
    setSymptomDate(symptomDate!);
    setStatus('upload');
    setTimeout(() => {
      setAccessibilityFocusRef(uploadRef);
    }, 250);
  }, [code, showActivityIndicator, hideActivityIndicator, t]);

  useEffect(() => {
    if (code.length !== 6) {
      setValidationError('');
      return;
    }

    codeValidationHandler();
  }, [code, codeValidationHandler]);

  const uploadDataHandler = async () => {
    let exposureKeys;
    try {
      exposureKeys = await getDiagnosisKeys();
    } catch (err) {
      console.log('getDiagnosisKeys error:', err);
      return setStatus('permissionError');
    }

    try {
      showActivityIndicator();
      await uploadExposureKeys(uploadToken, symptomDate, exposureKeys);
      hideActivityIndicator();

      setStatus('success');
    } catch (err) {
      console.log('error uploading exposure keys:', err);
      hideActivityIndicator();

      setStatus('error');
    }

    try {
      await SecureStore.deleteItemAsync(StorageKeys.uploadToken);
      await SecureStore.deleteItemAsync(StorageKeys.symptomDate);
    } catch (e) {}
  };

  const renderValidation = () => {
    return (
      <>
        <Markdown markdownStyles={{block: {marginBottom: 24}}}>
          {t('uploadKeys:code:intro')}
        </Markdown>
        <CodeInput
          style={styles.codeInput}
          count={6}
          onChange={setCode}
          disabled={status !== 'validate'}
        />
        {!!validationError && (
          <>
            <Spacing s={8} />
            <Text ref={errorRef} style={baseStyles.error}>
              {validationError}
            </Text>
          </>
        )}
        <Spacing s={16} />
      </>
    );
  };

  const renderUpload = () => {
    return (
      <>
        <View accessible={true} ref={uploadRef}>
          <Markdown>{t('uploadKeys:upload:intro')}</Markdown>
        </View>
        <Spacing s={8} />
        <Button type="default" onPress={uploadDataHandler}>
          {t('uploadKeys:upload:button')}
        </Button>
        <Spacing s={16} />
      </>
    );
  };

  const renderPermissionError = () => {
    return (
      <>
        <Toast
          type="error"
          message={t('uploadKeys:permissionError')}
          icon={<AppIcons.ErrorWarning width={24} height={24} />}
        />
        <Spacing s={8} />
      </>
    );
  };

  const renderUploadError = () => {
    return (
      <>
        <Toast
          type="error"
          message={t('uploadKeys:uploadError')}
          icon={<AppIcons.ErrorWarning width={24} height={24} />}
        />
        <Spacing s={8} />
      </>
    );
  };

  const renderUploadSuccess = () => (
    <ResultCard
      icon
      messageTitle={t('uploadKeys:uploadSuccess:toast')}
      message={t('uploadKeys:uploadSuccess:thanks')}
      buttonType={'default'}
      buttonText={t('uploadKeys:uploadSuccess:updates')}
      onButtonPress={() => navigation.navigate('main', {screen: 'dashboard'})}
      markdownStyle={styles.markdownStyle}
    />
  );

  let headerError =
    status === 'permissionError'
      ? renderPermissionError()
      : status === 'error'
      ? renderUploadError()
      : null;

  return (
    <KeyboardScrollable
      safeArea={false}
      headingShort
      backgroundColor={colors.background}
      heading={t('uploadKeys:title')}
      toast={headerError}>
      {(status === 'validate' || status === 'upload') && renderValidation()}
      {(status === 'upload' ||
        status === 'uploadOnly' ||
        status === 'error' ||
        status === 'permissionError') &&
        renderUpload()}
      {status === 'success' && renderUploadSuccess()}
    </KeyboardScrollable>
  );
};

const styles = StyleSheet.create({
  markdownStyle: {
    backgroundColor: colors.white
  },
  successText: {
    marginTop: 16,
    marginBottom: 16
  },
  codeInput: {
    marginTop: -12
  }
});
