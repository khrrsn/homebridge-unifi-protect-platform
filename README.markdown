# homebridge-unifi-protect-platform

[![Latest Version](https://img.shields.io/npm/v/homebridge-unifi-protect-platform.svg)](https://www.npmjs.com/package/homebridge-unifi-protect-platform)
[![Total Downloads](https://img.shields.io/npm/dt/homebridge-unifi-protect-platform.svg)](https://www.npmjs.com/package/homebridge-unifi-protect-platform)
[![Build Status](https://cloud.drone.io/api/badges/shnhrrsn/homebridge-unifi-protect-platform/status.svg)](https://cloud.drone.io/shnhrrsn/homebridge-unifi-protect-platform)
[![License](https://img.shields.io/npm/l/homebridge-unifi-protect-platform.svg)](https://www.npmjs.com/package/homebridge-unifi-protect-platform)

UniFi Protect platform for Homebridge with support for realtime events from UniFi Cameras and Doorbells.

> _NOTE:_ This only works with UniFi OS capable devices (UDM-Pro); it has been not been tested with the vanilla UCK-G2.

## Installation

TODO

### Supported Features

- Camera
- Doorbell Events (Push)
- Motion Event (Push)

> Unlike other UniFi Homebridge platforms, this platform provides realtime events and does not poll at set intervals. This means you’ll get doorbell and motion events pushed to HomeKit instantaneously.

### Tested Devices

- UDM-Pro
- UVC-G3
- UVC-G3-Dome
- UVC-G4-Doorbell

## Configuration

TODO

## Development

### Environment

All development tooling dynamically configures Homebridge through environment vars that should be set to match your environment. These values can be found in the [utils/start.ts](./utils/start.ts) file.

A `.env` file is supported in the root of the project directory.

### Tools

`homebridge-unifi-protect-platform` has some tooling to help making development easier:

- `yarn dev` will launch Homebridge through TypeScript pointed towards `src`
- `yarn dev:stream` displays all events emitted from the controller

## Credits

Much of the initial charactistic/services code has been lifted and repurposed from [dgreif/ring](https://github.com/dgreif/ring).
