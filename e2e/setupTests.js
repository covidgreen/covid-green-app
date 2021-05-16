import {waitForReactNativeReload, launchApp} from './utils.js';

beforeEach(async () => {
  await launchApp();
  await waitForReactNativeReload();
});
