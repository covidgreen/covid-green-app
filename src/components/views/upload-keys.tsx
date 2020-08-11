import React, {useState, useEffect, useCallback} from 'react';
import {Text, StyleSheet} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {useTranslation} from 'react-i18next';

import {DataProtectionLink} from './data-protection-policy';

import {useApplication} from 'providers/context';
import {useExposure} from 'providers/exposure';
import {
  validateCode,
  uploadExposureKeys,
  ValidationResult
} from 'services/api/exposures';
import {AppIcons} from 'assets/icons';
import {Button} from 'components/atoms/button';
import {Card} from 'components/atoms/card';
import {CodeInput} from 'components/molecules/code-input';
import {colors, text, baseStyles} from 'theme';
import {KeyboardScrollable} from 'components/templates/keyboard-scrollable';
import {Markdown} from 'components/atoms/markdown';
import {Spacing} from 'components/atoms/layout';
import {Toast} from 'components/atoms/toast';

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
  const exposure = useExposure();
  const {showActivityIndicator, hideActivityIndicator} = useApplication();

  const [status, setStatus] = useState<UploadStatus>('initialising');
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string>('');
  const [uploadToken, setUploadToken] = useState('');

  useEffect(() => {
    const readUploadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('uploadToken');
        if (token) {
          setUploadToken(token);
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
    const {result, token} = await validateCode(code);
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
      return;
    }

    try {
      await SecureStore.setItemAsync('uploadToken', token!);
    } catch (e) {
      console.log('Error (secure) storing upload token', e);
    }
    setValidationError('');

    setUploadToken(token!);
    setStatus('upload');
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
      exposureKeys = await exposure.getDiagnosisKeys();
    } catch (err) {
      console.log('getDiagnosisKeys error:', err);
      return setStatus('permissionError');
    }

    try {
      showActivityIndicator();
      await uploadExposureKeys(uploadToken, exposureKeys);
      hideActivityIndicator();

      setStatus('success');
    } catch (err) {
      console.log('error uploading exposure keys:', err);
      hideActivityIndicator();

      setStatus('error');
    }

    try {
      await SecureStore.deleteItemAsync('uploadToken');
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
            <Text style={baseStyles.error}>{validationError}</Text>
          </>
        )}
        <Spacing s={16} />
      </>
    );
  };

  const renderUpload = () => {
    return (
      <>
        <Markdown>{t('uploadKeys:upload:intro')}</Markdown>
        <Spacing s={8} />
        <Button type="default" onPress={uploadDataHandler}>
          {t('uploadKeys:upload:button')}
        </Button>
        <Spacing s={16} />
        <DataProtectionLink />
      </>
    );
  };

  const renderPermissionError = () => {
    return (
      <>
        <Toast
          color={colors.red}
          message={t('uploadKeys:permissionError')}
          icon={<AppIcons.Alert width={24} height={24} />}
        />
        <Spacing s={8} />
      </>
    );
  };

  const renderUploadError = () => {
    return (
      <>
        <Toast
          color={colors.red}
          message={t('uploadKeys:uploadError')}
          icon={<AppIcons.Alert width={24} height={24} />}
        />
        <Spacing s={8} />
      </>
    );
  };

  const renderUploadSuccess = () => {
    return (
      <Card padding={{v: 4}}>
        <Spacing s={16} />
        <Toast
          color="rgba(0, 207, 104, 0.16)"
          message={t('uploadKeys:uploadSuccess:toast')}
          type="success"
          icon={<AppIcons.Success width={24} height={24} color={colors.success} />}
        />
        <Text style={[text.default, styles.successText]}>
          {t('uploadKeys:uploadSuccess:thanks')}
        </Text>
        <Button
          type="empty"
          onPress={() => navigation.navigate('main', {screen: 'dashboard'})}>
          {t('uploadKeys:uploadSuccess:updates')}
        </Button>
        <Spacing s={16} />
      </Card>
    );
  };

  return (
    <KeyboardScrollable heading={t('uploadKeys:title')}>
      {(status === 'validate' || status === 'upload') && renderValidation()}
      {status === 'permissionError' && renderPermissionError()}
      {status === 'error' && renderUploadError()}
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
  successText: {
    marginTop: 16,
    marginBottom: 16
  },
  codeInput: {
    marginTop: -12
  }
});
