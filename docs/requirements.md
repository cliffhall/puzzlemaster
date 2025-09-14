# Requirements
Puzzlemaster will be a desktop app where users can create long-horizon Projects which Teams of Agents will complete in
Phases.

## Project Maintenance
* The left column of the screen will hold a list of Project names
* Create a project:
  - Enter a project name into the input at the bottom of the form,
  - Click the + button next to it,
  - A form for adding the project opens
  - Enter an optional description
  - Click the Save Project button.
* Delete a Project
  - Click the x to the right of a project name to delete it.
  - Click Delete on the confirmation dialog to proceed
* Edit a Project click a Project name to edit it
  - The Project list will collapse (can be reopened by the button on the title bar)
  - The Project form will be displayed
  - Maintain the Project's Plan
    - Click Add Plan (or Edit Plan if a Plan already exists for the Project)
    - Edit / Add the Plan description and click Save Plan
    - Maintain the Plan's Phases
      - Enter a Phase name in the Phase name input and click the + button next to it
      - In the Phase table, click the x a the end of a row to delete a phase
      - In the Phase table, click the + in a Phase's Job cell to add the Job for that Phase
      - Maintain a Phase's Job
        - Enter a name and optional description of the Job
        - Click the Save Job button
  -
I want to be able to maintain stock Plans, Roles, Teams, then, when creating a project, I can add a stock Plan which has
Phases with Teams of Roled Agents ready to go.

Executing a Plan is a dashboard view where we can see the current Phase of the Plan, and each Agent's status as a card.
Clicking on an Agent would cause it to go to a view where I could see all the Agent's history and progress and interact
with that agent as it is running, giving it feedback to guide its progress.
