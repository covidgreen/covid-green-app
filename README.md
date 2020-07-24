<img alttext="COVID Green Logo" src="https://raw.githubusercontent.com/lfph/artwork/master/projects/covidgreen/stacked/color/covidgreen-stacked-color.png" width="300" />

## Getting Started

Following these instructions will allow you to run and build the project on your local machine for development and testing purposes.

**Currently, Google / Apple are only making the ENS entitlement (GAEN API) required by this application to function available to one app per country / state and the account has to be associated with the government or public health authority. It's not currently possible for individual developers to have this entitlement enabled on their accounts. See https://www.google.com/covid19/exposurenotifications/ and https://developer.apple.com/contact/request/download/Exposure_Notification_Addendum.pdf for details. The Linux Foundation Public Health Project provides a [template](https://github.com/lfph/exposure-notification-playbook/blob/master/entitlement.md) that may be used to start the process of requesting entitlement.**

### Prerequisites

Follow the official guide "[Setting up the development environment](https://reactnative.dev/docs/environment-setup)" to set up your local machine to develop iOS and Android applications with React Native.

Install an Xcode version that supports iOS 13.5, required by the [ExposureNotification framework](https://developer.apple.com/documentation/exposurenotification) used by the app. The Exposure Notification capability is not yet available in iOS 14 beta (last beta published: beta 2).

Install `yarn` globally:

```bash
npm install -g yarn
```

For other installation methods, follow the official [Installation guide](https://classic.yarnpkg.com/en/docs/install).

### Installing

Clone this repository.

Install the npm dependencies:

```bash
yarn install
```

Create your `.env` file or copy it from the `.env.sample`:

```bash
cp .env.sample .env
```

Move to `ios/` folder and install the CocoaPods dependencies:

```bash
cd ios && pod install
```

## Running the applications locally

Start the React Native bundler:

```bash
yarn start
```

To start the Android application, run:

```bash
yarn android
```

To start the iOS one, run:

```bash
yarn ios
```

## Team

### Lead Maintainers

* @colmharte - Colm Harte <colm.harte@nearform.com>
* @jasnell - James M Snell <jasnell@gmail.com>
* @aspiringarc - Gar Mac Críosta <gar.maccriosta@hse.ie>

### Core Team

* @ShaunBaker - Shaun Baker <shaun.baker@nearform.com>
* @floridemai - Paul Negrutiu <paul.negrutiu@nearform.com>
* @jackdclark - Jack Clark <jack.clark@nearform.com>
* @andreaforni - Andrea Forni <andrea.forni@nearform.com>
* @jackmurdoch - Jack Murdoch <jack.murdoch@nearform.com>

### Contributors

* TBD
* TBD

### Past Contributors

* TBD
* TBD

## Hosted By

<a href="https://www.lfph.io"><img alttext="Linux Foundation Public Health Logo" src="https://raw.githubusercontent.com/lfph/artwork/master/lfph/stacked/color/lfph-stacked-color.svg" width="200"></a>

[Linux Foundation Public Health](https://www.lfph.io)

## Acknowledgements

<a href="https://www.hse.ie"><img alttext="HSE Ireland Logo" src="https://www.hse.ie/images/hse.jpg" width="200" /></a><a href="https://nearform.com"><img alttext="NearForm Logo" src="https://openjsf.org/wp-content/uploads/sites/84/2019/04/nearform.png" width="400" /></a>

## License

Copyright (c) 2020 HSEIreland
Copyright (c) The COVID Green Contributors

[Licensed](LICENSE) under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
