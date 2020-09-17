import React, {MutableRefObject} from 'react';
import {NavigationContainerRef} from '@react-navigation/native';

export const isMountedRef = React.createRef<boolean>() as MutableRefObject<
  boolean
>;

export const navigationRef = React.createRef<NavigationContainerRef | null>() as MutableRefObject<NavigationContainerRef | null>;

export enum ScreenNames {
  Introduction = 'introduction',
  Permissions = 'permissions',
  Completion = 'completion',
  Tour = 'tour',
  CloseContactInfo = 'closeContactInfo',
  CloseContactAlert = 'closeContactAlert',
  ContactTracingSettings = 'settings.covidAlerts',
  HealthLogSettings = 'settings.checkIn',
  PrivacySettings = 'settings.privacy',
  TermsSettings = 'settings.terms',
  UsageSettings = 'settings.metrics',
  LeaveSettings = 'settings.leave',
  DebugSettings = 'settings.debug',
  FeedbackSettings = 'settings.feedback',
  LanguageSetttings = 'settings.language',
  Privacy = 'privacy',
  Terms = 'terms',
  CloseContact = 'closeContact',
  UploadKeys = 'uploadKeys',
  PositiveResult = 'positiveResult',
  MyCovidAlerts = 'myCovidAlerts',
  History = 'history',

  Dashboard = 'dashboard',
  Settings = 'settings'
}

// Always navigate to CloseContactAlert so that back action takes user to MyCovidAlerts
export const covidAlertReset = {
  index: 1,
  routes: [
    {name: 'main', params: { screen: ScreenNames.MyCovidAlerts }},
    {name: ScreenNames.CloseContactAlert}
  ]
};
