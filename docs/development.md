# Puzzlemaster

An MCP client that allows teams of agents to complete long-horizon tasks.

## [About](../README.md) · [Domain Model](domain-model.md) · Development

### Status
Work in Progress

### Tech Stack
- Puzzlemaster uses the [Puzzlebox MCP server](https://github.com/cliffhall/puzzlebox) for agent coordination. Puzzlebox serves dynamic state machines to represent the phases of a project plan.
- Built with 100% Open Source Software ❤️
```
  - Electron / Electron Builder
  - Model Context Protocol
  - Vercel AI SDK
  - better-sqlite
  - TypeScript
  - neverthrow
  - prettier
  - PureMVC
  - Node.js
  - Mantine
  - Prisma
  - React
  - Vite
  - MCP
  - npm
```

### Requirements
* **Node + npm** - Javascript runtime environment
  * <a href="https://nodejs.org/en/download" target="_blank">Install</a> the latest stable Node release (comes with npm).

### Install Dependencies

```bash
$ npm install
```

### Create Database

```bash
# Create the puzzlemaster database from the Prisma schema
$ npm run create:db
```

### Run App

```bash
# Launch, run UI from local server, and watch for changes
$ npm run dev

OR

# Launch built app with Electron
$ npm run start

```

### Run Unit Tests

```bash
$ npm run test
```

### Build Runtime

```bash
# For a directory build
$ npm run build:dir

# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
