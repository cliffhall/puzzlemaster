import { RoleAPI } from "./api/RoleAPI";
import { ActionAPI } from "./api/ActionAPI";
import { AgentAPI } from "./api/AgentAPI";
import { JobAPI } from "./api/JobAPI";
import { PhaseAPI } from "./api/PhaseAPI";
import { PlanAPI } from "./api/PlanAPI";
import { ProjectAPI } from "./api/ProjectAPI";
import { TaskAPI } from "./api/TaskAPI";
import { TeamAPI } from "./api/TeamAPI";
import { ValidatorAPI } from "./api/ValidatorAPI";

export interface API
  extends RoleAPI,
    ActionAPI,
    AgentAPI,
    JobAPI,
    PhaseAPI,
    PlanAPI,
    ProjectAPI,
    TaskAPI,
    TeamAPI,
    ValidatorAPI {}
