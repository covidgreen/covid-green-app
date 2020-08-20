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
  ContactTracingSettings = 'settings.contactTracing',
  HealthLogSettings = 'settings.checkIn',
  PrivacySettings = 'settings.privacy',
  TermsSettings = 'settings.terms',
  UsageSettings = 'settings.metrics',
  LeaveSettings = 'settings.leave',
  DebugSettings = 'settings.debug',
  Privacy = 'privacy',
  Terms = 'terms',
  CloseContact = 'closeContact',
  UploadKeys = 'uploadKeys',
  PositiveResult = 'positiveResult',

  Dashboard = 'dashboard',
  Settings = 'settings'
}
