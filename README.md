# node-red-contrib-tractive

A Node-RED palette for integrating [Tractive](https://tractive.com) GPS trackers into your flows.

## Installation

```bash
cd ~/.node-red
npm install node-red-contrib-tractive
```

Or install directly from the Node-RED palette manager by searching for `node-red-contrib-tractive`.

## Nodes

| Node | Description |
|------|-------------|
| `tractive-config` | Shared credentials node — stores your Tractive email/password securely |
| `tractive-location` | Get the current GPS location of a tracker |
| `tractive-tracker` | Get tracker info or hardware status (battery level, signal) |
| `tractive-history` | Get location history for a tracker over a time window |
| `tractive-pets` | Get all pets or a specific pet on the account |
| `tractive-control` | Send commands to a tracker (live tracking on/off) |

## Usage

1. Add a **tractive-config** node and enter your Tractive account credentials.
2. Connect any other Tractive node to the config node.
3. Pass a `trackerID` in `msg.payload` or configure it directly on the node.
4. Results are returned in `msg.payload`.

## Attribution

Built on [tractive](https://github.com/FAXES/tractive) by [FAXES](https://github.com/FAXES) — ISC licence.

## Licence

MIT
