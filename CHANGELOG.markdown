# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0-beta.3](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-09-01)

### ✨ Features

- snapshots are now cached and used if timeout occurs ([19b44a8](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/19b44a81ac1e98721f4715f197e21c3804925290))

### 🐛 Bug Fixes

- improve stream quality, fixing issue where first frame of stream would be green ([4149213](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/4149213fd6bb81be9bdd09400f056f0300439d0a))
- snapshot cache will now only live for 60s ([7536c3d](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/7536c3dfa80fbdadc2ad53dcf08af986793df905))

## [1.0.0-beta.2](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-08-31)

### 🐛 Bug Fixes

- improve timeout support via abort-controller ([e4475d3](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/e4475d387571f4a1a43770339723b443b624d57f))
- snapshot config value was not respected ([61aba67](https://github.com/shnhrrsn/homebridge-unifi-protect-platform/commit/61aba67eca87e3c611e70e1275bdc21084fb1b11))

## 1.0.0-beta.1 (2020-08-31)

### ✨ Features

- initial beta release
