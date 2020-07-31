# COVID Check-In End To End Flow
![Check-In FLow](https://app.lucidchart.com/publicSegments/view/d9383a13-51c0-49c7-ae48-39c3312b8e21/image.png)
## COVID Check-in Onboarding Flow
_*Outcome: Allow user to start tracking symptoms and sharing data with HSE*_
- App should ask users to provide demographic information
    - Sex – Male | Female | Prefer not to say
    - Age – CSO Age Ranges | Prefer not to say
    - Locality  - lookup on SSA & ED based on Eircode or Address | Prefer not to say
- App should allow users to set ‘Prefer not to say’ for all  options
- App should only ask the user for demographic data the first time the complete the Check-Onboarding flow

### Alternate Paths
| **Path ID** | **Path**                                                                         | **App**                                                                                |
|-------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| 1           | User abandons onboarding flow by closing the app of entering another app feature | App must restart the Check-in onboarding flow the next time a user taps COVID Check-In |


## COVID Check-in Daily Use
_*Outcome: Gather & track symptoms*_
-   App should ask user how they are feeling today in the context of COVID-19
    -   I’m good no symptoms
    -   I’m not feeling well today
-   Symptom tracker should only collect 28 days worth of symptoms
-   Option 1: I’m good no symptoms
    -   App creates a local record of the check-in with no symptoms
    -   App sends a anonymous data message to the CSO containing the users demographic data, 28 days worth of symptoms
-   Option 2: I’m not feeling well today
    -   App presents to user with a series of yes no questions based on the current COVID-19 Case Definition
    -   App presents guidance based on the current COVID-19 Case Definition based on symptoms
    -   App presents specific guidance to users based on age if provided in Check-In demographic data
-   App should only allow the user to Check-In once a day
-   App should allow the user to see a 28 day rolling history of symptoms
### Alternate Paths
| **Path ID** | **Path**                                               | **App**                                                                                            |
|-------------|--------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| 1           | User abandons check-in without answering all questions | App should store the record of symptoms provided App should send a partial symptom message to CSO2 |

### Check-In Integration
TODO: text
![Check-In FLow Integration](https://app.lucidchart.com/publicSegments/view/10c3eb90-0a0e-4732-8cf5-2400d20c6c19/image.png)


