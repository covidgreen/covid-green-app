# Day-to-Day Contact Tracing Flow

*Outcome: Protect Yourself & Protect Others*
![Day-to-Day](../assets/Day%202%20Day.png)
_*Day-to-Day COntact Tracing*_

NOTE: COVID  Tracker is implemented using the Google/Apple Exposure Notification API. This ensures reliable operation of Contact Tracing on all compatible devices
- Google - https://www.google.com/covid19/exposurenotifications/
- Apple  - https://developer.apple.com/documentation/exposurenotification
- Must support exposure event detection based on current ECDC Case Definition
    -   2 Metres
    -   15 minutes
- Must support Contact Tracing by collecting Exposure events from other devices without user interaction
- *Should not detect users that do not match the case definition
- Diagnosis keys of people who have tested positive for COVID-19 will be checked at least 1 time every 2 hours
- Exposure checks will not require user interaction
- The system will _NOT_ use any other phone sensor data e.g. geol location
## Exposure Event Detection
*Outcome: Notify a user when they get a close contact exposure notification and get them to take appropriate measures*
- App must download and refresh Diagnosis keys at least every 2 hours
- User must compare downloaded Diagnosis keys against locally collected Rolling Proximity Identifiers
- App must alert a user if a Close Contact Exposure Event has occurred that matches the current Case Definition
- App must maintain an alert in the app for a user on all core app cards to ensure the user knows an Close Contact Exposure Event occurred
- User should be able to dismiss and remove the Close Contact Exposure Event in the app
- App should store the date the Close Contact Exposure Event received and the days since the last Close Contact Exposure Event occurred.
- when an exposure event is detected the app will immediately notify the user via in-app notification
- when an exposure event is detected the app will prominently display the exposure event in the app
- when an exposure event is detected the app will provide the user with guidance on what to do now & next
- the app will remove the notification from within the app 14 days after the date of exposure
- the app will notifiy the user of all subsequent exposure events after the first event

| **Path ID** | **Path**                                                                                       | **App**                                                                                                                             |
|-------------|------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| 1           | User has phone turned off                                                                      | App will refresh Diagnosis Keys for the period for which the app was closed                                                         |
| 2           | User has disabled background processing for the app                                            | App will refresh Diagnosis Keys for the period for which the app was offline                                                        |
| 3           | User has selected for a Close Contact Follow-up call from HSE                                  | App will send a message to the CCT backend system requesting a follow-up call with the Contacts Phone Number and Last Exposure Date |
| 4           | User receives a subsequent Close Contact Exposure Event                                        | App should only send 1 request for a Follow-up Call within a XX hour period                                                         |
| 5           | User requested to upload future Diagnosis Keys for periods after the first upload is completed | App should allow multiple uploads of Diagnosis Keys from a user in receipt of a valid OTC                                           |


![Day-to-Day Contact Tracing Broadcast](https://app.lucidchart.com/publicSegments/view/b76146fb-b735-42cf-9eda-a03b9be96502/image.png)
*Broadcasting Flow*
![Day-to-Day Contact Tracing Scanning & Exposure](https://app.lucidchart.com/publicSegments/view/76028296-c2e4-4c6a-aa13-84c42891ed95/image.png)
*Scanning & Exposure Check/Notification*

## Alternate Paths
| **Path ID** | **Path**                                                    | **App**                                                                                                        |
|-------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| 1           | Exposure Notification Services not enabled                  | Alert user to that Exposure Notification Services are not enabled and Contact Tracing is not functioning       |
| 2           | Bluetooth Services not enabled                              | Alert user to that Bluetooth Services are not enabled and Contact Tracing is not functioning                   |
| 3           | Notification Services not enabled                           | Alert user to that Notification Services are not enabled and Exposure Notification events will not be received |
| 4           | Device doesn’t support contact tracing                      | Alert user that Contact Tracing is not supported                                                               |
| 5           | Device requires software upgrade to support contact tracing | Alert user that upgrade required                                                                               |

## Follow-on call Notification
![Follow-on Call Notifcation](https://app.lucidchart.com/publicSegments/view/820fd0ad-ad6e-4818-b9d3-abe799bf29b0/image.png)
If a user has requested a follow-on call from the HSE based on receipt of a close contact exposure notification request
- the App will upload the request using the CallBack Request service
- the request is queued to speed response to the app and to support retry attempts to  CCT
- the CCT worker processes requests and sends them to the API
- requests are held on a SNS queue until processed max 48 hours (average retention <1  hour)

| **System** | **Description**                                                                                                  | **Role** | **End Point** | **Processing**                                                                          |
|------------|------------------------------------------------------------------------------------------------------------------|----------|---------------|-----------------------------------------------------------------------------------------|
| CCT        | COVID Care Tracker is a Case Management and CRM system used by Contact Tracing Centres to manage Contact Tracing | Provider | API           | CCT Queues the received message in a call queue in CCT for service from a CCT operative |


