import {expect, element, by, waitFor} from 'detox';
import {isIOS, waitForElement} from './utils';
import en from '../src/assets/lang/en.json';

// Test timeout for long-running tests (default value is 120 seconds).
const longRunningTestTimeout = 240 * 1000;

describe('user onboarding flow', () => {
  describe('when the user opens the app with no data stored', () => {
    it(
      'should show the user the relevant data protection and metric notices',
      async () => {
        // Confirm you're over 16 and continue past the get started view.
        await element(by.text(en.ageRequirement.over)).tap();
        await element(by.text(en.onboarding.intro.action)).tap();

        // Ensure the data protection view is displayed.
        await expect(element(by.text(en.yourData.title))).toBeVisible();

        // Tap on the data protection information notice and ensure it displays.
        await element(by.text(en.dataProtectionPolicy.link)).tap();
        await expect(element(by.text(en.settings.privacyPolicy))).toBeVisible();

        // Go back to the previous view.
        await element(by.text(en.navbar.back)).tap();

        // Scroll until the contiune button is visible and tap it.
        const continueButtonEl = element(by.text(en.yourData.continue));
        const scrollViewId = by.id('your-data');
        await waitFor(continueButtonEl)
          .toBeVisible()
          .whileElement(scrollViewId)
          .scroll(100, 'down');
        await continueButtonEl.tap();

        // The try/catch block tries to solve an edge case on Android:
        // 1. The emulator is not running.
        // 2. Detox runs the emulator and then the test.
        // 3. Tapping the continue button calls, among other things, the Google SafetyNet Attestation API.
        // 4. The attestation call fails with error code "7".
        // 5. The app remains in Your Data screen and displays an error toast.
        // Note: the attestation call does not fail if the emulator is already running before Detox runs the test.
        // If the app doesn't move to the App Metrics screen, the test taps the continue button again.
        // This time the attestation call should succeed.
        const appMetricsTitle = by.text(en.appUsage.title);
        try {
          // Ensure the app metrics view is displayed.
          await waitForElement(appMetricsTitle, 'toBeVisible', 90);
        } catch (errNotFound) {
          await waitFor(continueButtonEl)
            .toBeVisible()
            .whileElement(scrollViewId)
            .scroll(100, 'down');
          await continueButtonEl.tap();
          await waitForElement(appMetricsTitle, 'toBeVisible');
        }

        // Tap on the data protection information notice and ensure it displays.
        await element(by.text(en.dataProtectionPolicy.link)).tap();
        await expect(element(by.text(en.settings.privacyPolicy))).toBeVisible();
      },
      longRunningTestTimeout
    );

    it(
      'should allow the user to consent or not to sharing app metrics',
      async () => {
        // Confirm you're over 16 and continue past the get started view.
        await element(by.text(en.ageRequirement.over)).tap();
        await element(by.text(en.onboarding.intro.action)).tap();

        // Scroll until the contiune button is visible and tap it.
        const continueButtonEl = element(by.text(en.yourData.continue));
        const scrollViewId = by.id('your-data');
        await waitFor(continueButtonEl)
          .toBeVisible()
          .whileElement(scrollViewId)
          .scroll(100, 'down');
        await continueButtonEl.tap();

        const appMetricsTitle = by.text(en.appUsage.title);
        // For the explanation of this try/catch block, see the previous test.
        try {
          // Ensure the app metrics view is displayed.
          await waitForElement(appMetricsTitle, 'toBeVisible', 90);
        } catch (errNotFound) {
          await waitFor(continueButtonEl)
            .toBeVisible()
            .whileElement(scrollViewId)
            .scroll(100, 'down');
          await continueButtonEl.tap();
          await waitForElement(appMetricsTitle, 'toBeVisible');
        }

        // Conset to sharing app metrics.
        await element(by.text(en.appUsage.yesButton)).tap();

        // Ensure the contact tracing view is displayed.
        await expect(
          element(by.text(en.onboarding.information.title))
        ).toBeVisible();

        // Go back.
        await element(by.text(en.navbar.back)).tap();

        // Decline to sharing app metrics.
        await element(by.text(en.appUsage.noThanks)).tap();

        // Ensure the contact tracing view is displayed.
        await expect(
          element(by.text(en.onboarding.information.title))
        ).toBeVisible();
      },
      longRunningTestTimeout
    );

    describe('when the user chooses to set up contact tracing later', () => {
      it('should display the dashboard without requiring any personal details', async () => {
        // Confirm you're over 16 and continue past the get started view.
        await element(by.text(en.ageRequirement.over)).tap();
        await element(by.text(en.onboarding.intro.action)).tap();

        // Scroll to the bottom of the your data view and tap continue.
        await element(by.id('your-data')).scrollTo('bottom');
        await element(by.text(en.yourData.continue)).tap();

        // Ensure the app metrics view is displayed.
        await waitForElement(by.text(en.appUsage.title), 'toBeVisible');

        // Conset to sharing app metrics.
        await element(by.text(en.appUsage.yesButton)).tap();

        // Ensure the contact tracing view is displayed.
        await expect(
          element(by.text(en.onboarding.information.title))
        ).toBeVisible();

        // Choose to enable tracing later (different wording for iOS and Android).
        await element(
          by.text(
            isIOS()
              ? en.onboarding.information.later
              : en.onboarding.information.skip
          )
        ).tap();

        // Ensure the dashboard is displayed.
        await expect(element(by.text(en.appStats.title))).toBeVisible();
      });
    });

    if (isIOS()) {
      describe('on iOS', () => {
        describe('when the user chooses to set up contact tracing', () => {
          it('should ask for the required details', async () => {
            // Confirm you're over 16 and continue past the get started view.
            await element(by.text(en.ageRequirement.over)).tap();
            await element(by.text(en.onboarding.intro.action)).tap();

            // Scroll to the bottom of the your data view and tap continue.
            await element(by.id('your-data')).scrollTo('bottom');
            await element(by.text(en.yourData.continue)).tap();

            // Conset to sharing app metrics.
            await element(by.text(en.appUsage.yesButton)).tap();

            // Choose to enable tracing now.
            await element(by.text(en.onboarding.information.action)).tap();

            // Ensure the follow-up call view is displayed.
            await expect(element(by.text(en.followUpCall.title))).toBeVisible();

            // Tap on the country code input.
            await element(by.text(en.phoneNumber.code.label)).tap();

            // Ensure the contry code input view is displayed.
            await expect(
              element(by.id(en.phoneNumber.code.searchPlaceholder))
            ).toBeVisible();

            // Tap on the country code input.
            await element(by.id(en.phoneNumber.code.searchPlaceholder)).tap();

            // Type in a search term.
            await element(
              by.id(en.phoneNumber.code.searchPlaceholder)
            ).typeText('Uni');

            // Choose one of the suggested options.
            await element(by.text('United Kingdom (+44)')).tap();

            // Ensure the phone number input is displayed.
            await expect(
              element(by.id(en.phoneNumber.number.placeholder))
            ).toBeVisible();

            // Tap on the phone number input.
            await element(by.id(en.phoneNumber.number.placeholder)).tap();

            // Type in a number.
            await element(by.id(en.phoneNumber.number.placeholder)).typeText(
              '7000000000'
            );

            // Tap done on the keyboard.
            await element(by.label('Done')).atIndex(0).tap();

            // Confirm opt-in.
            await element(by.text(en.followUpCall.optIn)).tap();

            // Ensure the dasboard is displayed.
            await expect(element(by.text(en.appStats.title))).toBeVisible();

            // Navigate to the settings view.
            await element(by.text(en.navbar.settings)).tap();

            // Navigate to the contact tracing settings view.
            await element(by.id(en.settings.contactTracing)).tap();

            // Ensure the correct country code is saved.
            await expect(
              element(by.text('United Kingdom (+44)'))
            ).toBeVisible();

            // Ensure the correct phone number is saved.
            await expect(element(by.text('7000000000'))).toBeVisible();
          });
        });
      });
    }
  });
});
