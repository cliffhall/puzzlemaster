# Puzzlemaster

An MCP client that allows teams of agents to complete long-horizon tasks.

## [About](./index.md) · Development · [Domain Model](domain-model.md)

### Status
Work in Progress
- [x] Tech Stack
- [x] Electron Project Structure
- [x] Domain Model / Tests
- [x] Database Schema
- [x] Development / Production Database
- [x] IPCMain API for Frontend <-> Backend Comms
- [x] Node / PureMVC Backend Application / Tests [WIP]
- [x] React Frontend Application [WIP]
- [ ] Backend PureMVC Agent Cores
- [ ] Backend MCP Server Cores
- [ ] Frontend Role CRUD
- [ ] Frontend Job / Task execution

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

### Run Unit Tests

```bash
$ npm run test
```

### Run App

```bash
# Launch, run UI from local server, and watch for changes
$ npm run dev

OR

# Launch built app with Electron
$ npm run start

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
