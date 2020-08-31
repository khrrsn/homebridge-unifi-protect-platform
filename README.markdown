<p align="center">
<a href="https://www.npmjs.com/package/homebridge-unifi-protect-platform"><img src="https://img.shields.io/npm/v/homebridge-unifi-protect-platform.svg" alt="Latest Version"></a>
<a href="https://www.npmjs.com/package/homebridge-unifi-protect-platform"><img src="https://img.shields.io/npm/dt/homebridge-unifi-protect-platform.svg" alt="Total Downloads"></a>
<a href="./LICENSE"><img src="https://img.shields.io/npm/l/homebridge-unifi-protect-platform.svg" alt="License"></a>
</p>

# homebridge-unifi-protect-platform

UniFi Protect platform for Homebridge with support for realtime events from UniFi Cameras and Doorbells.

> _NOTE:_ This only works with UniFi OS capable devices (UDM-Pro); it has been not been tested with the vanilla UCK-G2.

- [Installation](#installation)
  - [Supported Features](#supported-features)
  - [Tested Devices](#tested-devices)
- [Configuration](#configuration)
  - [Advanced Config](#advanced-config)
- [To Do](#to-do)
- [Development](#development)
  - [Environment](#environment)
  - [Tools](#tools)
- [Credits](#credits)
- [License](#license)

## Installation

1. [Homebridge](https://github.com/nfarina/homebridge)
2. `npm i -g homebridge-unifi-protect-platform`
3. [Add platform to your config file](#configuration)

### Supported Features

Unlike other UniFi Homebridge platforms, this platform provides realtime events and does not poll at set intervals. This means you’ll get doorbell and motion events pushed to HomeKit instantaneously.

- Camera
- Doorbell Events (Push)
- Motion Event (Push)

### Tested Devices

- UDM-Pro
- UVC-G3
- UVC-G3-Dome
- UVC-G4-Doorbell

## Configuration

In order to use this plugin, you’ll need to add the following JSON object to your Homebridge config file:

```json
{
  "platform": "unifi-protect",
  "name": "unifi-protect",
  "unifi": {
    "controller": "https://controller-ip:controller-port",
    "username": "homekit",
    "password": "homekit"
  }
}
```

| Config Key         | Description                                                                                                 | Required |
| ------------------ | ----------------------------------------------------------------------------------------------------------- | -------- |
| `platform`         | Homebridge Platform name.<br>This value should always be unifi-protect.                                     | Y        |
| `name`             | The name of this platform within Homebridge.<br>This is mainly used for logs and can be any value you want. | N        |
| `unifi`            | This contains the settings that will be passed to OpenZWave.                                                | Y        |
| `unifi.controller` | The URL to your controller.                                                                                 | Y        |
| `unifi.username`   | The username to login to your controller.                                                                   | Y        |

### Advanced Config

The values above are the basics to get you started, however you can fine tune your config if needed:

| Config Key                | Description                                                                                                              | Required |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| `unifi.api_url`           | The URL to the Protect API.<br>By default, this resolves to: `{unifi.controller}/proxy/protect/api`                      | N        |
| `unifi.ws_url`            | The URL to the Protect WebSocket API.<br>By default, this resolves to: `ws(s)://{controllerip}/proxy/protect/ws/updates` | N        |
| `unifi.timeouts`          | Override request timeouts                                                                                                | N        |
| `unifi.timeouts.default`  | Timeout in milliseconds for most requests<br>The default value is 30s.                                                   | N        |
| `unifi.timeouts.snapshot` | Timeout in milliseconds for snapshot requests<br>The default value is 15s.                                               | N        |

## To Do

- [ ] Two Way Audio
- [ ] Move off of RTSP

## Development

### Environment

All development tooling dynamically configures Homebridge through environment vars that should be set to match your environment. These values can be found in the [dev/start.ts](./dev/start.ts) file.

A `.env` file is supported in the root of the project directory.

### Tools

`homebridge-unifi-protect-platform` has some tooling to help making development easier:

- `yarn dev` will launch Homebridge through TypeScript pointed towards `src`
- `yarn dev:stream` displays all events emitted from the controller
- `yarn dev:inspect` displays an output of your current Protect enviroment

## Credits

Much of the initial charactistic/services code has been lifted and repurposed from [dgreif/ring](https://github.com/dgreif/ring). Huge thanks to [@dgreif](https://github.com/dgreif)!

## License

homebridge-unifi-protect-platform was created by [Shaun Harrison](https://github.com/shnhrrsn) and is made available under the [MIT license](LICENSE).
