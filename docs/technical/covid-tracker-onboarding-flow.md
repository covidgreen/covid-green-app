# Onboarding Flow
*Outcome: User is successfully onboarded and contact tracing enabled*
1.  Ensure user is over the Age of Digital Consent 16
2.  Ensure user understands and is fully informed about the nature of the app
3.  Ensure user is adequately informed about the data being collected by the COVID Tracker App
    -   Personal Data
    -   App Metrics
4.  Ensure user has consented according to Data Protection and Privacy regulations to participate in Contact Tracing before enabling Contact Tracing app features
5.  Ensure user has been informed about contact tracing data
6.  Ensure user has been informed about app metrics data being collected
7.  Ensure user has been the option to accept collection of app metrics
8.  Ensure user has accepted the COVID Tracker App Terms & Conditions before enabling Contact Tracing app features
9.  Ensure the user has access to the Data Protection Information Notice
10. Ensure the user has access to the Terms & Conditions
11. Ensure user enables contact tracing functionality
12. Ensure user enables notifications to be notified of close contact exposure events
13. Support users who want phone support from HSE should they receive an close contact exposure notification
    -   Country Code – global phone numbers supported; default
    -   Phone Number - landline and mobile numbers
    -   Validation: validate Irish and International numbers
14. App should allow onboarding to complete and COVID Tracker App to be used without completing the Contact Tracing onboarding (see alternate paths)
![Image of Onboarding Flow](https://app.lucidchart.com/publicSegments/view/cd55d847-7892-4441-bff0-5229edfb0b32/image.png)

| **Path ID** | **Path**                                                                      | **App**                                                                                                                                                                                                                                                                                        |
|-------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1           | User \<16                                                                     | Prevent use of app Restarting app reinitiates the Onboarding flow                                                                                                                                                                                                                              |
| 2           | User closes app without completing onboarding flow                            | Users who close the app without completing the onboarding flow will reinitiate onboarding flow when they reopen the app                                                                                                                                                                        |
| 3           | User doesn’t accept Contact Tracing consent terms                             | Users who do not accept Contact Tracing consent agreement will open the app to the News & Information App must indicate to the User that the Contact Tracing features are disabled App must allow the user to subsequently enable Contact Tracing and redo the Contact Tracing onboarding flow |
| 4           | User doesn’t allow permissions for Contact Tracing to be enabled              | App must allow the user to subsequently enable Contact Tracing and redo the Contact Tracing onboarding flow                                                                                                                                                                                    |
| 5           | User doesn’t allow permissions of Notifications to be sent to them by the app | App must provide information to the user to; how to enable Notifications                                                                                                                                                                                                                       |
| 6           | User provides an invalid phone number                                         | App should check for valid phone numbers based landline and mobile numbers. IE and Global                                                                                                                                                                                                      |
| 7           | User provides a phone number and then Opts-out                                | App should confirm if the user meant to opt-in or out before continuing                                                                                                                                                                                                                        |
| 8           | User doesn’t provide a phone number for contact                               | App should allow the User to add a phone number at a later stage in Contact Tracing app settings                                                                                                                                                                                               |
| 9           | User on device that doesn’t support Contact Tracing                           | App must inform user that contact tracing is not supported on their device                                                                                                                                                                                                                     |
| 10          | User on device that requires an upgrade to support Contact Tracing            | App must inform user that contact tracing requires an upgrade of device software to enable Contact Tracing                                                                                                                                                                                     |
