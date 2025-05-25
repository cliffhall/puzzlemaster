# puzzlemaster

An MCP client that allows teams of agents to complete long-horizon tasks.

- Uses the [puzzlebox MCP server](https://github.com/cliffhall/puzzlebox) for agent coordination.
- Built with Electron, React, and TypeScript

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Test

```bash
$ npm run test
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Domain Model

### Entities

[**Action**](src/types/domain/Action.ts)

- An action that an agent can take to trigger a change to another phase of a plan.

[**Agent**](src/types/domain/Agent.ts)

- An agent with a specific role and assigned task list.

[**Job**](src/types/domain/Job.ts)

- A job is composed of one or more tasks that will complete a phase of a plan.

[**Phase**](src/types/domain/Phase.ts)

- A phase of a project's implementation plan. has an associated team and a job to complete before other phases can commence.

[**Plan**](src/types/domain/Plan.ts)

- A project's plan, to be implemented in one or more phases.

[**Project**](src/types/domain/Project.ts)

- A project with an implementation plan that can be executed by teams of agents.

[**Role**](src/types/domain/Role.ts)

- An agent's role within a team.

[**Task**](src/types/domain/Task.ts)

- Part of a job assigned to a single agent for completion.

[**Team**](src/types/domain/Team.ts)

- One or more agents assigned to complete a job associated with a single phase of a plan.

[**Validator**](src/types/domain/Validator.ts)

- A prompt template intended to validate whether a task is complete or if action can be taken.

[DomainError](src/types/domain/DomainError.ts)

- An error generated when creating or interacting with a domain entity.

### Entity Relationships

- [In Mermaid Editor](https://www.mermaidchart.com/app/projects/c1568af3-b180-46e6-bd34-bee129ef3c3d/diagrams/d3cd4cd7-81b3-4c28-8a38-e4158f0ea532/version/v0.1/edit)

```mermaid
erDiagram
    direction LR
    PROJECT {
        string id PK
        string planId FK
        string name
        string description
    }
    PLAN {
        string id PK
        string projectId FK
        string description
        array phases
    }
    PHASE {
        string id PK
        string jobId FK
        string name
        array actions
    }
    VALIDATOR {
        string id PK
        string template
        string resource
    }

    ACTION {
        string id PK
        string targetPhaseId FK
        string validatorId FK
        string name
    }
    TEAM {
        string id PK
        string phaseId FK
        string name
        array agents
    }
    AGENT {
        string id PK
        string teamId FK
        string roleId FK
        string name
        array tasks
    }
    ROLE {
        string id PK
        string name
        string description
    }
    JOB {
        string id PK
        string phaseId FK
        string name
        string description
        array tasks
    }
    TASK {
        string id PK
        string jobId FK
        string agentId FK
        string validatorId FK
        string name
        string description
    }
    PROJECT ||--o| PLAN : has
    PLAN ||--|{ PHASE : contains
    TEAM ||--|{ AGENT : contains
    AGENT ||--o| ROLE : has
    AGENT ||--|{ TASK : "is assigned"
    PHASE ||--|{ ACTION : contains
    PHASE ||--o| JOB : has
    PHASE ||--o| TEAM : has
    JOB ||--|{ TASK : contains
    ACTION ||--o| VALIDATOR : has
    TASK ||--o| VALIDATOR : has

```
