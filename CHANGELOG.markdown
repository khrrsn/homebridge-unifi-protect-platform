# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0-beta.1 (2020-08-31)

### 🐛 Bug Fixes

- add event param to filterEvents ([0216644](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/0216644e3ceb02451d278e31e73ffc89313ccf57))
- add eventTransformer allowing ring/motion events to actually fire ([e030292](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/e030292c06a0bc451786d1f2b248e07aa62d2c6b))
- bug in eventTransformer that wouldn’t populate id for ring events ([b11d6ba](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/b11d6bad4ce92e0a915cfafa713db8deaa7dbbc2))
- fixed rx issue where messages weren’t passing through ([5dc9b00](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/5dc9b0065cdaeb95f8fcfe2390f4014ad7a760e5))
- support motion detection eents ([7075874](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/7075874f804a8b2443dccb807d0633d0466f6d60))

### ✨ Features

- add accessory info ([640306e](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/640306efe486b99ec71553ef26470ab8a38ff509))
- add BootstrappedResourceProvider ([a05ac4f](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/a05ac4fda1b26e319a1242e36cad4ea26229cb2c))
- add doorbell as switch ([69df492](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/69df492c4dd45ff3d232b11d2ced6e569544994d))
- add pruneUnused to ServicesProvider to clean up ([992cccd](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/992cccd6348ec4b17c5f8735ee0ea2a23ad48d91))
- added snapshot support ([de277dc](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/de277dc0923fa182f8c5211c859d7644801278ac))
- added support for batteries ([b31ce19](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/b31ce196629524874cfe375d7d1bf2e72047dc95))
- added timeout support ([70b2e81](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/70b2e8119dff7792263d0ff98a649cf0fb3a7720))
- began building out platform ([9ccb720](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/9ccb72059445ff1cf8807f96b5f7914de3e2a275))
- initial commit ([4cddd8f](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/4cddd8f37302d8ae8c76c4164d5903da9cce7b41))
- initial doorbell support ([d492fd1](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/d492fd197e92b2e81863f73aa72afab72fd5debd))
- initial support for camera streams ([ff54718](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/ff54718a213f4e866a1cb16279465e856ce2f92a))
- motion detection ([500bf11](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/500bf11fb696cf2f6020a89e92a07f41c0fe5f62))
- remove controller_rtsp in favor of detecting from bootstrap ([09d303e](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/09d303e2eed07b9a7a7660036ae9c821f7431916))
