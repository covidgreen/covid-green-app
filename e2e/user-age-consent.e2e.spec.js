import {expect, element, by} from 'detox';
import en from '../src/assets/lang/en.json';

describe('user age consent', () => {
  describe('when the user opens the app with no data stored', () => {
    it('should ask for a user to consent that they are over 16', async () => {
      await expect(element(by.text(en.ageRequirement.notice))).toBeVisible();
    });

    describe('when the user confirms they are under 16', () => {
      it("should let the user know they're too young to use the app", async () => {
        await element(by.text(en.ageRequirement.under)).tap();

        await expect(element(by.text(en.underAge.notice))).toBeVisible();
      });
    });

    describe('when the user confirms they are 16 or over', () => {
      it('should allow them to continue through the app onboarding process', async () => {
        await element(by.text(en.ageRequirement.over)).tap();

        await expect(
          element(by.text(en.onboarding.intro.action))
        ).toBeVisible();
      });
    });
  });
});
