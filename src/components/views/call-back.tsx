import React, {FC, useRef, useState} from 'react';
import {Text, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {uploadCallBackData, UploadResponse} from 'services/api';
import {useApplication} from 'providers/context';
import {useCallBackStatus} from 'hooks/call-back-status';

import {Spacing} from 'components/atoms/layout';
import {Heading} from 'components/atoms/heading';
import {Toast} from 'components/atoms/toast';
import {Card} from 'components/atoms/card';

import {ResultCard} from 'components/molecules/result-card';
import {
  PhoneNumberUs,
  CallBackData
} from 'components/organisms/phone-number-us';
import {KeyboardScrollable} from 'components/templates/keyboard-scrollable';

import {text} from 'theme';
import {AppIcons, BubbleIcons} from 'assets/icons';

interface CallBackProps {
  navigation: any;
  route: any;
}

export const CallBack: FC<CallBackProps> = () => {
  const {t} = useTranslation();
  const [error, setError] = useState<'server' | 'client' | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const {setContext} = useApplication();

  const {callBackIsQueued, setCallBackIsQueued} = useCallBackStatus();

  const handlePhoneNumber = async (callBackData: CallBackData) => {
    try {
      const response: UploadResponse = await uploadCallBackData(callBackData);

      if (response?.ok || response?.status === 204) {
        const successTime = Date.now(); // or get it from the response, if they send that
        setContext({callBackQueuedTs: successTime});
        setError(null);
        setCallBackIsQueued(true);
      } else {
        // Probably a server failure processing the request
        console.error('bad response to phone number:', response);
        setError('server');
      }
    } catch (err) {
      // Probably a connection failure client side
      console.error('error on sending phone number:', err);
      setError('client');
    }
  };

  const errorToast = error && (
    <Toast
      type="warning"
      icon={<AppIcons.Alert width={24} height={24} />}
      message={t(`callBack:error:${error}`)}
    />
  );

  if (!callBackIsQueued) {
    return (
      <KeyboardScrollable toast={errorToast} scrollViewRef={scrollViewRef}>
        <Heading text={t('callBack:title')} />
        <PhoneNumberUs
          buttonLabel={t('callBack:button')}
          onSuccess={handlePhoneNumber}
        />
      </KeyboardScrollable>
    );
  }

  return (
    <KeyboardScrollable toast={errorToast} scrollViewRef={scrollViewRef}>
      <ResultCard
        messageTitle={t('callBack:success:title')}
        message={t('callBack:success:text')}
        buttonText={t('callBack:success:button')}
        onButtonPress={() => navigation.navigate('dashboard')}
      />
      <Spacing s={20} />
      <Card
        icon={<BubbleIcons.Info width={56} height={56} />}
        onPress={() => navigation.navigate('closeContactInfo')}>
        <Text style={text.largeBlack}>{t('closeContact:infoCard')}</Text>
      </Card>
    </KeyboardScrollable>
  );
};
