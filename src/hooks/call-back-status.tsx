import {useCallback, useState} from 'react';
import {AppState} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {useSettings} from 'providers/settings';
import {useApplication} from 'providers/context';

const isCallBackQueued = (
  callBackQueuedTs: number = 0,
  callBackResetHrs: number
) => callBackQueuedTs + callBackResetHrs * 3600 * 1000 > Date.now();

export const useCallBackStatus = () => {
  const {callBackQueuedTs} = useApplication();
  const {
    appConfig: {callBackResetHrs}
  } = useSettings();

  const [callBackIsQueued, setCallBackIsQueued] = useState<boolean>(() =>
    isCallBackQueued(callBackQueuedTs, callBackResetHrs)
  );

  const updateCallBackIsQueued = useCallback(
    () =>
      setCallBackIsQueued(isCallBackQueued(callBackQueuedTs, callBackResetHrs)),
    [callBackQueuedTs, callBackResetHrs]
  );
  useFocusEffect(
    useCallback(() => {
      updateCallBackIsQueued();
      AppState.addEventListener('change', updateCallBackIsQueued);
      return () =>
        AppState.removeEventListener('change', updateCallBackIsQueued);
    }, [updateCallBackIsQueued])
  );

  return {
    callBackIsQueued,
    setCallBackIsQueued
  };
};
