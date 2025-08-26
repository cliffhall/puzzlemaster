import { ActionAPI } from "./ActionAPI";
import { AgentAPI } from "./AgentAPI";
import { JobAPI } from "./JobAPI";
import { PhaseAPI } from "./PhaseAPI";
import { PlanAPI } from "./PlanAPI";
import { ProjectAPI } from "./ProjectAPI";
import { RoleAPI } from "./RoleAPI";
import { TaskAPI } from "./TaskAPI";
import { TeamAPI } from "./TeamAPI";
import { ValidatorAPI } from "./ValidatorAPI";
import { WindowAPI } from "./WindowAPI";

export interface PuzzleMasterAPI {
  action: ActionAPI;
  agent: AgentAPI;
  job: JobAPI;
  phase: PhaseAPI;
  plan: PlanAPI;
  project: ProjectAPI;
  role: RoleAPI;
  task: TaskAPI;
  team: TeamAPI;
  validator: ValidatorAPI;
  window: WindowAPI;
}
