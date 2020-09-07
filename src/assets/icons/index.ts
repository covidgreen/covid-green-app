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
import ErrorWarning from './app/error-warning.svg';

// bubble
import BubbleCheckIn from './bubble/check-in.svg';
import BubbleInfo from './bubble/info.svg';
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
import ContactTracingAlert from './tab-bar/contact-tracing-alert.svg';
import SettingsAndroid from './tab-bar/settings-android.svg';
import SettingsIOS from './tab-bar/settings-ios.svg';

// icons
import CheckMark from './check-mark.svg';
import CheckMarkMultiSelect from './check-mark-multiselect.svg';
import Privacy from './privacy.svg';
import LogoLaunch from './logo-launch.svg';
import LogoNav from './logo-nav.svg';
import LogoState from './logo-state.svg';

// states
import StateErrorBluetooth from './states/error-bluetooth.svg';
import StateErrorENS from './states/error-ens.svg';
import StateErrorPhone from './states/error-phone.svg';
import StateErrorUpgrade from './states/error-upgrade.svg';
import StateSuccess from './states/success.svg';
import StateSuccessPhone from './states/success-phone.svg';
import StateExposureAlert from './states/exposure-alert.svg';
import StateExposureUnset from './states/exposure-unset.svg';
import StateAppENS from './states/app-ens.svg';

import Call from './how-to-keep-others-safe/call.svg';
import Food from './how-to-keep-others-safe/food.svg';
import Garbage from './how-to-keep-others-safe/garbage.svg';
import SecureLiving from './how-to-keep-others-safe/secure-living.svg';
import Sleep from './how-to-keep-others-safe/sleep.svg';
import StayHome from './how-to-keep-others-safe/stay-home.svg';
import NoTouch from './how-to-keep-others-safe/temperature.svg';
import Wash from './how-to-keep-others-safe/wash.svg';
import TouchPets from './how-to-keep-others-safe/dont-touch-pets.svg';
import ChildCare from './how-to-keep-others-safe/child-care.svg';
import SeparateBathroom from './how-to-keep-others-safe/separate-bathroom.svg';
import GetTested from './how-to-keep-others-safe/get-tested.svg';

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
  Selected,
  ErrorWarning
};

export const BubbleIcons = {
  CheckIn: BubbleCheckIn,
  Info: BubbleInfo,
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
    Alert: ContactTracingAlert
  },
  Settings: Platform.OS === 'ios' ? SettingsIOS : SettingsAndroid
};

export const StateIcons = {
  ErrorBluetooth: StateErrorBluetooth,
  ErrorENS: StateErrorENS,
  ErrorPhone: StateErrorPhone,
  ErrorUpgrade: StateErrorUpgrade,
  Success: StateSuccess,
  SuccessPhone: StateSuccessPhone,
  ExposureAlert: StateExposureAlert,
  ExposureUnset: StateExposureUnset,
  AppENS: StateAppENS
};

// Maintain order = content markdown is dependant on this - needs refactoring
export const KeepSafeIcons = {
  StayHome,
  Call,
  Sleep,
  SecureLiving,
  SeparateBathroom,
  Food,
  Garbage,
  TouchPets,
  ChildCare,
  Wash,
  GetTested,
  NoTouch
};

export default {
  CheckMark,
  CheckMarkMultiSelect,
  LogoLaunch,
  LogoNav,
  LogoState,
  Privacy
};
