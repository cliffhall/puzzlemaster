# Puzzlemaster

An MCP host application that allows teams of agents to complete long-horizon tasks.

## About · [Development](./development.md) · [Domain Model](./domain-model.md)

### What is this?
Puzzlemaster is a novel approach to team-based agentic workflow coordination.

Our earlier experiment with agentic collaboration, [GooseTeam](https://github.com/cliffhall/GooseTeam),
was an MCP server environment where multiple Goose Agents could collaborate, break down requests in to tasks,
assign and finish those tasks, and send messages between agents. But all the agents followed the same protocol
and some models were better than others at following the rules and staying in the game.

What we learned was that for teams of agents to complete complex, long-horizon tasks, they not
only need to collaborate, they need coordination. Otherwise, it can devolve into a Three Stooges
episode.

To implement this, we looked to one of the most successful organizations in nature: The enterprise.

### How does it work?
In the real world, a large project is typically approached in phases.
Each of the phases typically requires different teams of people with different roles, skill-sets, and collaboration patterns.

For example, in a software project, it might be:
* **Inception** - decide generally what the system should do, conceive your "North Star", what you should be aiming for
* **Requirements** - detail the domain language with a glossary, define the functional requirements, choose the tech stack
* **Design** - design the database, API, front end, documentation style
* **Development** - coding services, SDK, frontend, documentation
* **Deployment** - set up hosts, deployment scripts, monitoring, analytics

Puzzlemaster takes the approach that powers successful enterprise projects and uses it
to keep teams of specialized agents on the rails as they work on your long-horizon tasks.

* A Project has a Plan.
* A Plan has Phases.
* A Phase has a Team and a Job.
* A Team is composed of Agents.
* A Job has Tasks.
* Each Agent has a Role and one or more Tasks to complete.
* A Team finishes its Job when all of its Tasks are complete.
* A Validator is a prompt and a set of resources produced by the Team, and sent to the human or an LLM.
* The Validator is used to determine if the output of a Team is passable.
* If the Validator approves the output, the next Phase of the Plan is entered; otherwise the Team continues to work based upon its feedback.
* When a new Phase is entered, a different Team gets to work with the resources produced in the previous Phases.
