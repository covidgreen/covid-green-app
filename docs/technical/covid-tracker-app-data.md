# COVID Tracker Data

![Local App Data](https://app.lucidchart.com/publicSegments/view/68458917-16de-4874-a120-6a471b234d2e/image.png)
_*Local App Data*_
## Registered User 
### Purpose: App ID, Authentication & Refresh Tokens. Security for API access
| Name          | Type | Description                                                                                         | Reason why it is required   | Optional | Retention                                                          |
|---------------|------|-----------------------------------------------------------------------------------------------------|-----------------------------|----------|--------------------------------------------------------------------|
| Unique app id | GUID | GUID generated during onboarding and used as part of the authentication scheme to secure API access | Security/API Authentication | Required | In-use life of the app Removed when user uses Leave or Deletes app |
| AuthToken     | JWT  | JWT-based Authentication Token used to secure API access                                            | Security/API Authentication | Required | 2 hours Removed when user uses Leave or Deletes app                |
| RefreshToken  | JWT  | JWT-based Authentication Token used to refresh AuthTokens                                           | Security/API Authentication | Required | 24 hours Removed when user uses Leave or Deletes app               |

| Name      | Type   | Description                   | Reason why it is required       | Optional | Retention                                                                                            |
|-----------|--------|-------------------------------|---------------------------------|----------|------------------------------------------------------------------------------------------------------|
| Sex       | string | Demographic data for Check-in | Syndromic Surveillance Analysis | Optional | In-use life of the app Removed when user uses Leave or Deletes app or changes or removes in Settings |
| Age Range | string | Demographic data for Check-in | Syndromic Surveillance Analysis | Optional | In-use life of the app Removed when user uses Leave or Deletes app or changes or removes in Settings |
| County    | String | Demographic data for Check-in | Syndromic Surveillance Analysis | Optional | In-use life of the app Removed when user uses Leave or Deletes app or changes or removes in Settings |
| Town      | String | Demographic data for Check-in | Syndromic Surveillance Analysis | Optional | In-use life of the app Removed when user uses Leave or Deletes app or changes or removes in Settings |


## Contact Tracing
Purpose: Local entity for tracking the periodic download and comparison of diagnosis keys
| Name                      | Type   | Description                          | Reason why it is required                                                               | Optional                                          | Retention                                       |
|---------------------------|--------|--------------------------------------|-----------------------------------------------------------------------------------------|---------------------------------------------------|-------------------------------------------------|
| Id                        | string | Diagnosis Key File Index             | Diagnosis Key management Local Tracking of Diagnosis Key data during periodic downloads | Y – only if user has consented to Contact Tracing | Y – removed when user uses Leave or Deletes app |
| DateLastRan ExposureCheck | date   | Date of last check of diagnosis keys | Diagnosis Key management Local Tracking of Diagnosis Key data during periodic downloads | Y – only if user has consented to Contact Tracing | Y – removed when user uses Leave or Deletes app |
| lastFilDownloaded         | string | Last file identifier                 | Diagnosis Key management Local Tracking of Diagnosis Key data during periodic downloads | Y – only if user has consented to Contact Tracing | Y – removed when user uses Leave or Deletes app |


## Contact Summaries
Purpose: Local entity for tracking exposure notification events received on the phone. Used for local in-app notification.
| Name             | Type   | Description                                | Reason why it is required                                   | Optional                                          | Right to be forgotten                           |
|------------------|--------|--------------------------------------------|-------------------------------------------------------------|---------------------------------------------------|-------------------------------------------------|
| Id               | string | Diagnosis Key File Index                   | Exposure Event Management Local Tracking of Exposure Events | Y – only if user has consented to Contact Tracing | Y – removed when user uses Leave or Deletes app |
| CreatedAt        | date   | Date the Exposure Event Detected on Device | Exposure Event Management Local Tracking of Exposure Events | Y – only if user has consented to Contact Tracing | Y – removed when user uses Leave or Deletes app |
| LastExposureDate | date   | Date of the Exposure Event Occured         | Exposure Event Management Local Tracking of Exposure Events | Y – only if user has consented to Contact Tracing | Y – removed when user uses Leave or Deletes app |


## Check-Ins
Purpose: Local entity to Store 28 days’ worth of symptom data
| Name          | Type  | Description                                                     | Reason why it is required                                                                | Optional                                   | Use of the data                     | Retention                                                       |
|---------------|-------|-----------------------------------------------------------------|------------------------------------------------------------------------------------------|--------------------------------------------|-------------------------------------|-----------------------------------------------------------------|
| FeelingGood   | bool  | Indication of whether user has no symptoms or has some symptoms | User Symptom Tracking/ Symptomatic Data for Analysis Memory Aid & Syndromic Surveillance | Y – only if user has consented to Check-in | Memory Aid & Syndromic Surveillance | Max 28 days rolling Removed when user uses Leave or Deletes app |
| Symptoms[28]  | array | Array of symptoms covering 28 days                              | User Symptom Tracking/ Symptomatic Data for Analysis Memory Aid                          | Y – only if user has consented to Check-in | Memory Aid                          | Max 28 days rolling Removed when user uses Leave or Deletes app |
| Each Symptom… |       |                                                                 |                                                                                          |                                            |                                     |                                                                 |
| Fever         | Bool  | Does the person have a fever Yes \| No                          | User Symptom Tracking/ Symptomatic Data for Analysis Memory Aid                          | Y – only if user has consented to Check-in | Memory Aid                          | Max 28 days rolling Removed when user uses Leave or Deletes app |
| Cough         | bool  | Does the person have a cough Yes \| No                          | User Symptom Tracking/ Symptomatic Data for Analysis Memory Aid                          | Y – only if user has consented to Check-in | Memory Aid                          | Max 28 days rolling Removed when user uses Leave or Deletes app |
| Breath        | Bool  | Does the person have a difficulty breathing Yes \| No           | User Symptom Tracking/ Symptomatic Data for Analysis Memory Aid                          | Y – only if user has consented to Check-in | Memory Aid                          | Max 28 days rolling Removed when user uses Leave or Deletes app |
| Flu           | bool  | Does the person have cold/flu symptoms Yes \| No                | User Symptom Tracking/ Symptomatic Data for Analysis Memory Aid                          | Y – only if user has consented to Check-in | Memory Aid                          | Max 28 days rolling Removed when user uses Leave or Deletes app |
| Date          | date  | Date of check-in                                                | User Symptom Tracking/ Symptomatic Data for Analysis Memory Aid                          | Y – only if user has consented to Check-in | Memory Aid                          | Max 28 days rolling Removed when user uses Leave or Deletes app |

## Device Settings/Permissions
Purpose: To track the users enabling Exposure Notification Services and Notification Services
| Name                                             | Type | Description                                              | Reason why it is required                                                                                | Optional                                          | How long is this data stored | Retention                                                          |
|--------------------------------------------------|------|----------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------------------------------------------------|------------------------------|--------------------------------------------------------------------|
| Exposure notification services (ENS) permissions | bool | Indication if the user has enabled ENS                   | Contact Tracing & Exposure Notifications In-app messaging to user about the operation of contact tracing | Y – only if user has consented to Contact Tracing |                              | In-use life of the app Removed when user uses Leave or Deletes app |
| Notification services permissions                | bool | Indication if the user has enabled Notification Services | Contact Tracing & Exposure Notifications In-app messaging to user about the operation of contact tracing | Y – only if user has consented to Contact Tracing |                              | In-use life of the Removed when user uses Leave or Deletes app     |

## Flow/App Entity Access
The following table outlines the access and usage of the data entities in the operation of the app. Create/Read/Update/Delete
|                                          | Registered User | Contact Summaries | Contact Tracing | Check-Ins & Symptoms | User Device Settings |
|------------------------------------------|-----------------|-------------------|-----------------|----------------------|----------------------|
| Onboarding Flow                          | CR              | \-                | \-              | \-                   | C                    |
| News & Information Flow                  | R               | \-                | \-              | \-                   | \-                   |
| Day-to-Day Contact Tracing Flow          | R               | RU                | CRU             | \-                   | \-                   |
| Positive Result Flow                     | R               | \-                | \-              | \-                   | \-                   |
| Close Contact Exposure Notification Flow | R               | CR                | \-              | \-                   | \-                   |
| Check-In Onboarding Flow                 | CR              | \-                | \-              | \-                   | \-                   |
| Daily Check-In Flow                      | R               | \-                | \-              | CR                   | \-                   |
| Leave Flow                               | RD              | D                 | D               | D                    | D                    |
| Share Flow                               | N/A             | N/A               | N/A             | N/A                  | \-                   |
| Settings                                 | U               | U                 | \-              | U                    | \-                   |
