import {Platform} from 'react-native';

// app
import Alert from './app/alert.svg';
import ArrowRight from './app/arrow-right.svg';
import BackAndroid from './app/back-android.svg';
import BackIOS from './app/back-ios.svg';
import Bluetooth from './app/bluetooth.svg';
import Close from './app/close.svg';
import Notification from './app/notification.svg';
import ShareAndroid from './app/share-android.svg';
import ShareIOS from './app/share-ios.svg';
import Success from './app/success.svg';
import Filter from './app/filter.svg';
import Selected from './app/selected.svg';

// bubble
import BubbleCases from './bubble/cases.svg';
import BubbleCheckIn from './bubble/check-in.svg';
import BubbleDeaths from './bubble/deaths.svg';
import BubbleHospital from './bubble/hospital.svg';
import BubbleICU from './bubble/icu.svg';
import BubbleInfo from './bubble/info.svg';
import BubbleMapPin from './bubble/map-pin.svg';
import BubblePhoneCall from './bubble/phone-call.svg';
import BubbleCallGreen from './bubble/call-green.svg';
import BubbleShield from './bubble/shield.svg';
import BubbleSurvey from './bubble/survey.svg';
import BubbleSymptom from './bubble/symptom.svg';
import BubbleTestedPositive from './bubble/tested-positive.svg';

// tab-bar
import Updates from './tab-bar/updates.svg';
import CheckIn from './tab-bar/check-in.svg';
import ContactTracingOff from './tab-bar/contact-tracing-off.svg';
import ContactTracingOn from './tab-bar/contact-tracing-on.svg';
import ContactTracingUnknown from './tab-bar/contact-tracing-unknown.svg';
import SettingsAndroid from './tab-bar/settings-android.svg';
import SettingsIOS from './tab-bar/settings-ios.svg';

// icons
import CheckMark from './check-mark.svg';
import CheckMarkMultiSelect from './check-mark-multiselect.svg';
import Logo from './logo.svg';
import Privacy from './privacy.svg';

import StateLogo from './app-logo.svg';

import StateErrorBluetooth from './states/error-bluetooth.svg';
import StateErrorENS from './states/error-ens.svg';
import StateErrorUpgrade from './states/error-upgrade.svg';
import StateSuccess from './states/success.svg';
import StateSuccessPhone from './states/success-phone.svg';
import StateExposureAlert from './states/exposure-alert.svg';
import StateExposureUnset from './states/exposure-unset.svg';

import Call from './how-to-keep-others-safe/call.svg';
import Food from './how-to-keep-others-safe/food.svg';
import Garbage from './how-to-keep-others-safe/garbage.svg';
import Isolate from './how-to-keep-others-safe/isolate.svg';
import Mask from './how-to-keep-others-safe/mask.svg';
import SecureLiving from './how-to-keep-others-safe/secure-living.svg';
import Sleep from './how-to-keep-others-safe/sleep.svg';
import StayHome from './how-to-keep-others-safe/stay-home.svg';
import Temperature from './how-to-keep-others-safe/temperature.svg';
import Wash from './how-to-keep-others-safe/wash.svg';

export const AppIcons = {
  Alert,
  ArrowRight,
  Back: Platform.OS === 'ios' ? BackIOS : BackAndroid,
  Bluetooth,
  Close,
  Notification,
  Share: Platform.OS === 'ios' ? ShareIOS : ShareAndroid,
  Success,
  Filter,
  Selected
};

export const BubbleIcons = {
  Cases: BubbleCases,
  CheckIn: BubbleCheckIn,
  Deaths: BubbleDeaths,
  Hospital: BubbleHospital,
  ICU: BubbleICU,
  Info: BubbleInfo,
  MapPin: BubbleMapPin,
  PhoneCall: BubblePhoneCall,
  Shield: BubbleShield,
  Survey: BubbleSurvey,
  Symptom: BubbleSymptom,
  TestedPositive: BubbleTestedPositive,
  CallGreen: BubbleCallGreen
};

export const TabBarIcons = {
  Updates,
  CheckIn,
  ContactTracing: {
    Off: ContactTracingOff,
    On: ContactTracingOn,
    Unknown: ContactTracingUnknown
  },
  Settings: Platform.OS === 'ios' ? SettingsIOS : SettingsAndroid
};

export const StateIcons = {
  ErrorBluetooth: StateErrorBluetooth,
  ErrorENS: StateErrorENS,
  ErrorUpgrade: StateErrorUpgrade,
  Success: StateSuccess,
  SuccessPhone: StateSuccessPhone,
  ExposureAlert: StateExposureAlert,
  ExposureUnset: StateExposureUnset
};

// Maintain order = content markdown is dependant on this - needs refactoring
export const KeepSafeIcons = {
  Isolate,
  StayHome,
  SecureLiving,
  Wash,
  Sleep,
  Food,
  Garbage,
  Mask,
  Temperature,
  Call
};

export default {
  CheckMark,
  CheckMarkMultiSelect,
  Logo,
  Privacy,
  StateLogo
};
