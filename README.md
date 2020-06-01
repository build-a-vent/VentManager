# Build a vent Android app

## Project setup

A guide to setup your environment can foud here https://reactnative.dev/docs/environment-setup

Use the React Native CLI Quickstart, you can't use the Expo CLI

Use Yarn to load the packages

## Grandle release setup

Add this to your grande.properties file in ~/grandle

```

BUILD_A_VENT_UPLOAD_STORE_FILE=YOUR_KEYSTORE_FILE
BUILD_A_VENT_UPLOAD_KEY_ALIAS=YOUR_KEY_ALIAS
BUILD_A_VENT_UPLOAD_STORE_PASSWORD=YOUR_STORE_PASSWORD
BUILD_A_VENT_UPLOAD_KEY_PASSWORD=YOUR_KEY_PASSWORD

```

_DO NOR STORE PASSWORDS IN THE PROJECT_

### Build cmd

cd ./android && ./grandlew bundleRelease -Dgradle.user.home

## Scripts

To start the dev server

``` javascript

yarn run start

```

Start app in debug mode

``` javascript

yarn run android

```

## Vent simulater

start the simulator with:

``` javascript

node ./simulator

```

This cmd starts simulator with 1 device

### Options

Options are Env settings for node.

Number of vents can be set by:

VENTS= < number >

Simulate a network error:

VENT_ERROR=1

A vent will after a while no longer responding to your broadcast

## calc.pl reference for calculations

perl calc.pl totime <minutenvolumen_ltr> <rpm> <ratio> <o2-gehalt>

perl calc.pl toval <ms_luft> <ms_o2> <ms_inspir> <ms_cycle>

## Grandle build

```

./gradlew clean
./gradlew buildRelease
./gradlew assembleRelease

```

### Credits

Icons from:
https://freeicons.io/

#### Iconsets

https://freeicons.io/profile/714

https://freeicons.io/icon-list/business-and-online-icons

### Dev tools

https://www.npmjs.com/package/react-devtools

adb reverse tcp:8097 tcp:8097

## License

[MIT](LICENSE)
