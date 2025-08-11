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
    ValidatorAPI {
  // ------------------------------ ACTIONS ------------------------------
  // Refactor/extracted to ActionAPI
  // ------------------------------ AGENTS ------------------------------
  // Refactor/extracted to AgentAPI
  // ------------------------------ JOBS ------------------------------
  // Refactor/extracted to JobAPI
  // ------------------------------ PHASES ------------------------------
  // Refactor/extracted to PhaseAPI
  // ------------------------------ PLANS ------------------------------
  // Refactor/extracted to PlanAPI
  // ------------------------------ PROJECTS ------------------------------
  // Refactor/extracted to ProjectAPI
  // ------------------------------ ROLES ------------------------------
  // Refactor/extracted to RoleAPI
  // ------------------------------ TASKS ------------------------------
  // Refactor/extracted to TaskAPI
  // ------------------------------ TEAMS ------------------------------
  // Refactor/extracted to TeamAPI
  // ------------------------------ VALIDATORS ------------------------------
  // Refactor/extracted to ValidatorAPI
}
