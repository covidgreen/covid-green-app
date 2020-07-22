# COVID Tracker Backend Data
![App Backend Data Model](https://app.lucidchart.com/publicSegments/view/be0282b3-87f7-4d07-9837-d793da229266/image.png)

## Registrations 
Purpose: Registration Management & App/API  Authentication 
| Name                     | Type     | Description                                                                                         | Reason why it is required   | Optional                        | Retention                                                              |
|--------------------------|----------|-----------------------------------------------------------------------------------------------------|-----------------------------|---------------------------------|------------------------------------------------------------------------|
| id                       | GUID     | GUID generated during onboarding and used as part of the authentication scheme to secure API access | Security/API Authentication | Required                        | In-use life of the app Y – removed when user uses Leave or Deletes app |
| CreatedAt                | DateTime | Date the registration was created                                                                   | Security/API Authentication | Required                        | In-use life of the app Y – removed when user uses Leave or Deletes app |
| LastVerification Attempt | DateTime | The last time the App attempted to verify an auth token                                             | Security/API Authentication | Required                        | In-use life of the app Y – removed when user uses Leave or Deletes app |
| Refresh                  | DateTime | The last time the App refreshed                                                                     | Security/API Authentication | Required                        | 24 hours Y – removed when user uses Leave or Deletes app               |
| UploadRequested          | DateTime | Date & time the user uploaded diagnosis keys                                                        | Contact Tracing             | Required - Contact Tracing Only | In-use life of the app Y – removed when user uses Leave or Deletes app |
| LastCheckIn              | DateTime | Date & time the user last checked in                                                                | Check-in                    | Required - Contact Tracing Only | In-use life of the app Y – removed when user uses Leave or Deletes app |
| Nonce                    | JWT      | JWT-based Authentication Token used to secure API access                                            | Security/API Authentication | Required                        | In-use life of the app Y – removed when user uses Leave or Deletes app |

## Exposures
Purpose: Diagnosis Key Registry Management; data is anonymous

| Name                    | Type     | Description                                                                                                                                                                                                                                                        | Reason why it is required                                                                                             | Optional                        | Retention                                              |
|-------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|---------------------------------|--------------------------------------------------------|
| id                      | GUID     | GUID generated when diagnosis keys uploaded                                                                                                                                                                                                                        | Diagnosis Key Registry Management Tracking Diagnosis Key Uploads and publication to Diagnosis Key Registry            | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |
| created_at              | dateTime | Date of record for upload                                                                                                                                                                                                                                          | Diagnosis Key Registry Management Tracking Date of upload                                                             | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |
| key_data                | JSON     | Key Data from ENS in JSON format                                                                                                                                                                                                                                   | Diagnosis Key Registry Management Keys for distribution to notify close contacts of exposure events                   | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |
| rolling_start_number    | Integer  | Time                                                                                                                                                                                                                                                               | Diagnosis Key Registry Management tracking large uploads \>100 keys Describes the time at which the key was generated | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |
| transmission_risk_level | Integer  | 0: Unused 1: Confirmed test - Low transmission risk level 2: Confirmed test - Standard transmission risk level 3: Confirmed test - High transmission risk level 4: Confirmed clinical diagnosis 5: Self report 6: Negative case 7: Recursive case 8: Unused/custom | Default in current risk model S Specifies the level of risk of cross-exposure during the interaction between devices. | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |
| rolling_period          | integer  | Date                                                                                                                                                                                                                                                               | Used for Key Expiration Stores the expiration date of the key                                                         | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |


## Exposures_Export_Files
Purpose: Diagnosis Key Registry Management; data is anonymous
| Name             | Type     | Description                                          | Reason why it is required                                                                                                  | Optional                        | Right to be forgotten                                  |
|------------------|----------|------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|---------------------------------|--------------------------------------------------------|
| id               | numeric  | ID generated when diagnosis keys uploaded            | Diagnosis Key Registry Management Tracking Diagnosis Key Uploads and publication to Diagnosis Key Registry                 | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |
| created_at       | dateTime | Date of record for upload                            | Diagnosis Key Registry Management Tracking Date of upload                                                                  | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |
| last_exposure_id | numeric  | Id of the last key that was added to the export file | Diagnosis Key Registry Management Sequencing                                                                               | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |
| path             | URL      | Path to a key file in S3 bucket                      | Diagnosis Key Registry Management File is used as the distribution mechanism for diagnosis keys and exposure notifications | Required - Contact Tracing Only | 14 days rolling No - data is not connected with a user |

## Verifications
Purpose: Diagnosis Key Registry Management; data is anonymous
| Name         | Type     | Description                                               | Reason why it is required                                                                                  | Optional                        | Retention                                         |
|--------------|----------|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------|---------------------------------|---------------------------------------------------|
| id           | GUID     | GUID generated when diagnosis keys uploaded               | Diagnosis Key Registry Management Tracking Diagnosis Key Uploads and publication to Diagnosis Key Registry | Required - Contact Tracing Only | 14 days rolling Data is not connected with a user |
| created_at   | dateTime | Date of record for upload                                 | Diagnosis Key Registry Management Tracking Date of upload                                                  | Required - Contact Tracing Only | 14 days rolling Data is not connected with a user |
| Control      | String   | Rate limiting on OCT submissions                          | Diagnosis Key Registry Management Rate limiting                                                            | Required - Contact Tracing Only | 14 days rolling Data is not connected with a user |
| Code         | string   | OTC generated by HSE and sent via SMS by Twilio to a user | Diagnosis Key Registry Management OTC used to validate the upload from a user devices                      | Required - Contact Tracing Only | 14 days rolling Data is not connected with a user |
| Last_attempt | dateTime | Last attempt by a code to verify within the time period   | Diagnosis Key Registry Management Used to manage resending of codes and code timeouts                      | Required - Contact Tracing Only | 14 days rolling Data is not connected with a user |

## Upload Tokens
Purpose: Used to manage authentication tokens used during a diagnosis key upload
| Name       | Type     | Description                         | Reason why it is required                                                                                  | Optional?                       | Retention                                       |
|------------|----------|-------------------------------------|------------------------------------------------------------------------------------------------------------|---------------------------------|-------------------------------------------------|
| id         | GUID     | GUID generated to track auth tokens | Diagnosis Key Registry Management Tracking Diagnosis Key Uploads and publication to Diagnosis Key Registry | Required - Contact Tracing Only | 24 hours No - data is not connected with a user |
| created_at | dateTime | Date of record for upload           | Diagnosis Key Registry Management Tracking Date of upload                                                  | Required - Contact Tracing Only | 24 hours No - data is not connected with a user |
| reg_id     | GUID     | GUID used for session management    | Diagnosis Key Registry Management Tracking Diagnosis Key Uploads and publication to Diagnosis Key Registry | Required - Contact Tracing Only | 24 hours No - data is not connected with a user |


##	Check_Ins
Purpose: Store for CheckIn Data en-route to CSO and for statistics in the app
| name       | Type     | Description                                                                     | Reason why it is required                                                                                         | Optional                                   | Retention                                            |
|------------|----------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|--------------------------------------------|------------------------------------------------------|
| id         | GUID     | Created to identify a unique check-in                                           | Syndromic Surveillance/Analytics/News & Info App Data Source                                                      | Y – only if user has consented to Check-in | 24 hours removed when user uses Leave or Deletes app |
| created_at | dateTime | Date of record for upload                                                       | Syndromic Surveillance/Analytics/News & Info App Data Source Tracking Date of upload                              | Required - Check-in Only                   | 24 hours Data is not connected with a user           |
| sex        | array    | Array of symptoms covering 28 days                                              | Syndromic Surveillance/Analytics/News & Info App Data Source User Symptom Tracking/ Symptomatic Data for Analysis | Y – only if user has consented to Check-in | 24 hours Removed when user uses Leave or Deletes app |
| locality   | String   | County, Town                                                                    | Syndromic Surveillance/Analytics/News & Info App Data Source User Symptom Tracking/ Symptomatic Data for Analysis | Y – only if user has consented to Check-in | 24 hours Removed when user uses Leave or Deletes app |
| ok         | bool     | Indication of whether user has no symptoms or has some symptoms cough Yes \| No | Syndromic Surveillance/Analytics/News & Info App Data Source User Symptom Tracking/ Symptomatic Data for Analysis | Y – only if user has consented to Check-in | 24 hours Removed when user uses Leave or Deletes app |
| payload    | JSON     | 28 days of symptomatic data                                                     | Syndromic Surveillance/Analytics/News & Info App Data Source Symptomatic Data for Analysis                        | Y – only if user has consented to Check-in | 24 hours Removed when user uses Leave or Deletes app |

## Settings
Purpose: Used to hold all app settings, including dynamic content related, apps regularly check for setting changes to ensure all settings are current 
| name          | Type     | Description                                | Reason why it is required                                    | Optional      | Retention |
|---------------|----------|--------------------------------------------|--------------------------------------------------------------|---------------|-----------|
| id            | GUID     | Created to identify a unique setting value | App Configuration & Content Readonly Configuration & Content | N – read only | N/A       |
| Setting_key   | string   | Key used by app to refer to setting        | App Configuration & Content Readonly Configuration & Content | N – read only | N/A       |
| Setting_value | string   | Setting Value                              | App Configuration & Content Readonly Configuration & Content | N – read only | N/A       |
| created_at    | dateTime | Date of record for creation of setting     | Tracking Date for settings Readonly Configuration & Content  | N – read only | N/A       |

## Setting Keys
| **Key**                          | **Type**        | **Current Value (V1.0-17/5/2020)**                                                                                               |
|----------------------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------|
| exposureCheckFrequency           |                 | how frequently we look for new exposure keys,                                                                                    |
| exposedTodo                      | Structured Text | the text to display on a close contact page                                                                                      |
| checkerThankYouText              | Structured Text | the txt displayed at the end of the symptom checker                                                                              |
| minimumRiskScore                 | Integer         | minimumRiskScore, an integer value that specifies how strong a calculated risk needs to be in order to be recorded.              |
| attenuationLevelValues           | Integer         | an array in which you specify how much risk to associate with the Bluetooth attenuation value from an exposure.                  |
| attenuationWeight                | Integer         | Risk weighting for signal strength                                                                                               |
| daysSinceLastExposureLevelValues | Integer         | an array in which you specify how much risk to associate to an exposure based on the number of days since the exposure happened. |
| daysSinceLastExposureWeight      | Integer         | Risk weighting for Exposure time                                                                                                 |
| durationLevelValues              | Integer         | an array in which you specify how much risk to associate with an exposure based on the duration of the exposure                  |
| durationWeight                   | Integer         | Risk weighting for duration of exposure                                                                                          |
| transmissionRiskLevelValues      | Integer         | an array of custom values that specify how much risk to associate with a risk factor you designate.                              |
| transmissionRiskWeight           | Integer         | Risk weighting for duration of exposure                                                                                          |

## Flow/App Backend Entity Access
|                                          | Registrations | Exposures | Exposure_Export_Files | Verifications | UploadTokens | Check_Ins | Settings |
|------------------------------------------|---------------|-----------|-----------------------|---------------|--------------|-----------|----------|
| Onboarding Flow                          | CR            | \-        | \-                    | \-            | C            | \-        | R        |
| News & Information Flow                  | R             | \-        | \-                    | \-            | \-           | \-        | R        |
| Day-to-Day Contact Tracing Flow          | R             | \-        | CRU                   | \-            | \-           | \-        | R        |
| Positive Result Flow                     | R             | CR        | \-                    | \-            | \-           | \-        | R        |
| Close Contact Exposure Notification Flow | R             | \-        | \-                    | \-            | \-           | \-        | R        |
| Check-In Onboarding Flow                 | CR            | \-        | \-                    | \-            | \-           | \-        |          |
| Daily Check-In Flow                      | R             | \-        | \-                    | CR            | \-           |           |          |
| Leave Flow                               | RD            | \-        | D                     | D             | D            | \-        |          |
| Share Flow                               | N/A           | N/A       | N/A                   | N/A           | \-           | \-        |          |
| Settings                                 | U             | \-        | \-                    | \-            | \-           | \-        |          |





