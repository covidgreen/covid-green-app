import * as SecureStore from 'expo-secure-store';
import RNSimpleCrypto from 'react-native-simple-crypto';
import {getBundleId} from 'react-native-device-info';
import {request} from '.';
import {networkError} from 'services/api';
import {urls} from 'constants/urls';

export enum ValidationResult {
  NetworkError,
  Error,
  Invalid,
  Expired,
  Valid
}

interface ValidateCodeResponse {
  result: ValidationResult;
  symptomDate?: string;
  token?: string;
}

export const validateCode = async (
  code: string
): Promise<ValidateCodeResponse> => {
  try {
    const resp = await request(`${urls.api}/verify`, {
      authorizationHeaders: true,
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({code})
    });

    if (!resp) {
      throw new Error('Invalid response');
    }
    const responseData = await resp.json();

    return {
      result: ValidationResult.Valid,
      symptomDate: responseData.symptomDate,
      token: responseData.token
    };
  } catch (err) {
    console.log('Code validation error: ', err, err.message);

    if (err.message === networkError) {
      return {result: ValidationResult.NetworkError};
    }

    if (err.status === 410) {
      return {result: ValidationResult.Expired};
    } else if (err.status >= 400 && err.status <= 499) {
      return {result: ValidationResult.Invalid};
    }

    return {
      result: ValidationResult.Error
    };
  }
};

export const uploadExposureKeys = async (
  uploadToken: string,
  symptomDate: string,
  exposures: any[]
): Promise<void> => {
  if (!exposures.length) {
    console.log('No keys to upload, aborting upload');
    return;
  }

  const data = exposures
    .sort((a, b) => {
      if (a.keyData < b.keyData) {
        return -1;
      }

      if (a.keyData > b.keyData) {
        return 1;
      }

      return 0;
    })
    .map(
      ({keyData, rollingStartNumber, rollingPeriod, transmissionRiskLevel}) =>
        `${keyData}.${rollingStartNumber}.${rollingPeriod}.${transmissionRiskLevel}`
    )
    .join(',');

  const hmacKey = await RNSimpleCrypto.utils.randomBytes(128);
  const hmacData = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(data);
  const ekeyhmac = await RNSimpleCrypto.HMAC.hmac256(hmacData, hmacKey);
  const padding = await RNSimpleCrypto.utils.randomBytes(
    Math.floor(Math.random() * 1024 + 1024)
  );

  const certificateResponse = await request(`${urls.api}/certificate`, {
    authorizationHeaders: true,
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: uploadToken,
      ekeyhmac: RNSimpleCrypto.utils.convertArrayBufferToBase64(ekeyhmac)
    })
  });

  if (!certificateResponse || certificateResponse.status !== 200) {
    throw new Error('Upload failed');
  }

  const certificateJson = await certificateResponse.json();
  const revisionToken = await SecureStore.getItemAsync('revisionToken');

  const publishData = {
    hmacKey: RNSimpleCrypto.utils.convertArrayBufferToBase64(hmacKey),
    healthAuthorityID: getBundleId(),
    verificationPayload: certificateJson.certificate,
    symptomOnsetInterval: Math.floor(
      new Date(symptomDate).getTime() / 1000 / 600
    ),
    revisionToken: revisionToken || '',
    traveler: false,
    temporaryExposureKeys: exposures.map((exposure) => ({
      key: exposure.keyData,
      rollingStartNumber: exposure.rollingStartNumber,
      rollingPeriod: exposure.rollingPeriod,
      transmissionRisk: exposure.transmissionRiskLevel
    })),
    padding: RNSimpleCrypto.utils.convertArrayBufferToBase64(padding)
  };

  console.log(`uploading keys to ${urls.keyPublish}/publish`, publishData);

  const resp = await fetch(`${urls.keyPublish}/publish`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(publishData)
  });

  if (!resp || resp.status !== 200) {
    throw new Error('Upload failed');
  }

  const respJson = await resp.json();

  if (respJson.revisionToken) {
    await SecureStore.setItemAsync('revisionToken', respJson.revisionToken);
  }
};
