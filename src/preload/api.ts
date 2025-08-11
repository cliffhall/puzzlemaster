import { ipcRenderer } from "electron";
import { API } from "../types/api";
import {
  ActionAPIMethods,
  ActionDTO,
  AgentAPIMethods,
  AgentDTO,
  JobAPIMethods,
  JobDTO,
  PhaseAPIMethods,
  PhaseDTO,
  PlanAPIMethods,
  PlanDTO,
  ProjectAPIMethods,
  ProjectDTO,
  RoleAPIMethods,
  RoleDTO,
  TaskAPIMethods,
  TaskDTO,
  TeamAPIMethods,
  TeamDTO,
  ValidatorAPIMethods,
  ValidatorDTO,
} from "../types/domain";

export const api: API = {
  // ------------------------------ ACTIONS ------------------------------
  createAction: (actionDTO: ActionDTO) =>
    ipcRenderer.invoke(ActionAPIMethods.CREATE_ACTION, actionDTO),
  getAction: (id: string) =>
    ipcRenderer.invoke(ActionAPIMethods.GET_ACTION, id),
  getActions: () => ipcRenderer.invoke(ActionAPIMethods.GET_ACTIONS),
  getActionsByPhase: (phaseId: string) =>
    ipcRenderer.invoke(ActionAPIMethods.GET_ACTIONS_BY_PHASE, phaseId),
  updateAction: (actionDTO: ActionDTO) =>
    ipcRenderer.invoke(ActionAPIMethods.UPDATE_ACTION, actionDTO),
  deleteAction: (id: string) =>
    ipcRenderer.invoke(ActionAPIMethods.DELETE_ACTION, id),
  // ------------------------------ AGENTS ------------------------------
  createAgent: (agentDTO: AgentDTO) =>
    ipcRenderer.invoke(AgentAPIMethods.CREATE_AGENT, agentDTO),
  getAgent: (id: string) => ipcRenderer.invoke(AgentAPIMethods.GET_AGENT, id),
  getAgents: () => ipcRenderer.invoke(AgentAPIMethods.GET_AGENTS),
  updateAgent: (agentDTO: AgentDTO) =>
    ipcRenderer.invoke(AgentAPIMethods.UPDATE_AGENT, agentDTO),
  deleteAgent: (id: string) =>
    ipcRenderer.invoke(AgentAPIMethods.DELETE_AGENT, id),
  // ------------------------------ JOBS ------------------------------
  createJob: (jobDTO: JobDTO) =>
    ipcRenderer.invoke(JobAPIMethods.CREATE_JOB, jobDTO),
  getJob: (id: string) => ipcRenderer.invoke(JobAPIMethods.GET_JOB, id),
  getJobs: () => ipcRenderer.invoke(JobAPIMethods.GET_JOBS),
  updateJob: (jobDTO: JobDTO) =>
    ipcRenderer.invoke(JobAPIMethods.UPDATE_JOB, jobDTO),
  deleteJob: (id: string) => ipcRenderer.invoke(JobAPIMethods.DELETE_JOB, id),
  // ------------------------------ PHASES ------------------------------
  createPhase: (phaseDTO: PhaseDTO) =>
    ipcRenderer.invoke(PhaseAPIMethods.CREATE_PHASE, phaseDTO),
  getPhase: (id: string) => ipcRenderer.invoke(PhaseAPIMethods.GET_PHASE, id),
  getPhases: () => ipcRenderer.invoke(PhaseAPIMethods.GET_PHASES),
  updatePhase: (phaseDTO: PhaseDTO) =>
    ipcRenderer.invoke(PhaseAPIMethods.UPDATE_PHASE, phaseDTO),
  deletePhase: (id: string) =>
    ipcRenderer.invoke(PhaseAPIMethods.DELETE_PHASE, id),
  // ------------------------------ PLANS ------------------------------
  createPlan: (planDTO: PlanDTO) =>
    ipcRenderer.invoke(PlanAPIMethods.CREATE_PLAN, planDTO),
  getPlan: (id: string) => ipcRenderer.invoke(PlanAPIMethods.GET_PLAN, id),
  getPlans: () => ipcRenderer.invoke(PlanAPIMethods.GET_PLANS),
  updatePlan: (planDTO: PlanDTO) =>
    ipcRenderer.invoke(PlanAPIMethods.UPDATE_PLAN, planDTO),
  deletePlan: (id: string) =>
    ipcRenderer.invoke(PlanAPIMethods.DELETE_PLAN, id),
  // ------------------------------ PROJECTS ------------------------------
  createProject: (projectDTO: ProjectDTO) =>
    ipcRenderer.invoke(ProjectAPIMethods.CREATE_PROJECT, projectDTO),
  getProject: (id: string) =>
    ipcRenderer.invoke(ProjectAPIMethods.GET_PROJECT, id),
  getProjects: () => ipcRenderer.invoke(ProjectAPIMethods.GET_PROJECTS),
  updateProject: (projectDTO: ProjectDTO) =>
    ipcRenderer.invoke(ProjectAPIMethods.UPDATE_PROJECT, projectDTO),
  deleteProject: (id: string) =>
    ipcRenderer.invoke(ProjectAPIMethods.DELETE_PROJECT, id),
  // ------------------------------ ROLES ------------------------------
  createRole: (roleDTO: RoleDTO) =>
    ipcRenderer.invoke(RoleAPIMethods.CREATE_ROLE, roleDTO),
  getRole: (id: string) => ipcRenderer.invoke(RoleAPIMethods.GET_ROLE, id),
  getRoles: () => ipcRenderer.invoke(RoleAPIMethods.GET_ROLES),
  updateRole: (roleDTO: RoleDTO) =>
    ipcRenderer.invoke(RoleAPIMethods.UPDATE_ROLE, roleDTO),
  deleteRole: (id: string) =>
    ipcRenderer.invoke(RoleAPIMethods.DELETE_ROLE, id),
  // ------------------------------ TASKS ------------------------------
  createTask: (taskDTO: TaskDTO) =>
    ipcRenderer.invoke(TaskAPIMethods.CREATE_TASK, taskDTO),
  getTask: (id: string) => ipcRenderer.invoke(TaskAPIMethods.GET_TASK, id),
  getTasks: () => ipcRenderer.invoke(TaskAPIMethods.GET_TASKS),
  updateTask: (taskDTO: TaskDTO) =>
    ipcRenderer.invoke(TaskAPIMethods.UPDATE_TASK, taskDTO),
  deleteTask: (id: string) =>
    ipcRenderer.invoke(TaskAPIMethods.DELETE_TASK, id),
  // ------------------------------ TEAMS ------------------------------
  createTeam: (teamDTO: TeamDTO) =>
    ipcRenderer.invoke(TeamAPIMethods.CREATE_TEAM, teamDTO),
  getTeam: (id: string) => ipcRenderer.invoke(TeamAPIMethods.GET_TEAM, id),
  getTeams: () => ipcRenderer.invoke(TeamAPIMethods.GET_TEAMS),
  updateTeam: (teamDTO: TeamDTO) =>
    ipcRenderer.invoke(TeamAPIMethods.UPDATE_TEAM, teamDTO),
  deleteTeam: (id: string) =>
    ipcRenderer.invoke(TeamAPIMethods.DELETE_TEAM, id),
  // ------------------------------ VALIDATORS ------------------------------
  createValidator: (validatorDTO: ValidatorDTO) =>
    ipcRenderer.invoke(ValidatorAPIMethods.CREATE_VALIDATOR, validatorDTO),
  getValidator: (id: string) =>
    ipcRenderer.invoke(ValidatorAPIMethods.GET_VALIDATOR, id),
  getValidators: () => ipcRenderer.invoke(ValidatorAPIMethods.GET_VALIDATORS),
  updateValidator: (validatorDTO: ValidatorDTO) =>
    ipcRenderer.invoke(ValidatorAPIMethods.UPDATE_VALIDATOR, validatorDTO),
  deleteValidator: (id: string) =>
    ipcRenderer.invoke(ValidatorAPIMethods.DELETE_VALIDATOR, id),
};
