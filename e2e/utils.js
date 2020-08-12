import {element, by, waitFor, device} from 'detox';

export function isIOS() {
  return device.getPlatform() === 'ios';
}

/**
 * Launch the app on the device.
 *
 * The app is uninstalled and reinstalled every time (delete option).
 * Detox is unable to accept a permission notification on iOS when running tests, so we need to
 * launch the application with the notifications permission pre-approved (permissions option).
 */
export async function launchApp() {
  await device.launchApp({delete: true, permissions: {notifications: 'YES'}});
}

/**
 * The time it takes for react-native to reload the application can very depending on
 * lots of different circumstances.
 *
 * This method waits for react-native to reload the app so we don't run tests before we're ready.
 */
export async function waitForReactNativeReload() {
  await waitForElement(by.id('base'), 'toExist');
}

/**
 * A helper for times when we need to wait for an element.
 *
 * If the element is ready before the timeout is over the test will continue so there's
 * no need to reduce this time to speed up tests.
 */
export async function waitForElement(
  elementSelector,
  matcher,
  timeoutInSeconds = 10
) {
  await waitFor(element(elementSelector))
    [matcher]()
    .withTimeout(timeoutInSeconds * 1000);
}
