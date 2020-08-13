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

// bubble
import BubbleCases from './bubble/cases.svg';
import BubbleCheckIn from './bubble/check-in.svg';
import BubbleDeaths from './bubble/deaths.svg';
import BubbleHospital from './bubble/hospital.svg';
import BubbleICU from './bubble/icu.svg';
import BubbleInfo from './bubble/info.svg';
import BubbleMapPin from './bubble/map-pin.svg';
import BubblePhoneCall from './bubble/phone-call.svg';
import BubbleShield from './bubble/shield.svg';
import BubbleSurvey from './bubble/survey.svg';
import BubbleSymptom from './bubble/symptom.svg';

// tab-bar
import Updates from './tab-bar/updates.svg';
import CheckIn from './tab-bar/check-in.svg';
import ContactTracingOff from './tab-bar/contact-tracing-off.svg';
import ContactTracingOn from './tab-bar/contact-tracing-on.svg';
import ContactTracingUnknown from './tab-bar/contact-tracing-unknown.svg';
import SettingsAndroid from './tab-bar/settings-android.svg';
import SettingsIOS from './tab-bar//settings-ios.svg';

// icons
import CheckMark from './check-mark.svg';
import CheckMarkMultiSelect from './check-mark-multiselect.svg';
import Logo from './logo.svg';
import Privacy from './privacy.svg';

export const AppIcons = {
  Alert,
  ArrowRight,
  Back: Platform.OS === 'ios' ? BackIOS : BackAndroid,
  Bluetooth,
  Close,
  Notification,
  Share: Platform.OS === 'ios' ? ShareIOS : ShareAndroid,
  Success
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
  Symptom: BubbleSymptom
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

export default {
  CheckMark,
  CheckMarkMultiSelect,
  Logo,
  Privacy
};
