import React, {MutableRefObject} from 'react';
import {NavigationContainerRef} from '@react-navigation/native';

export const isMountedRef = React.createRef<boolean>() as MutableRefObject<
  boolean
>;

export const navigationRef = React.createRef<
  NavigationContainerRef
>() as MutableRefObject<NavigationContainerRef | null>;
