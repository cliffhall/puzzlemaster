import {
  ActionDTO,
  AgentDTO,
  JobDTO,
  PhaseDTO,
  PlanDTO,
  ProjectDTO,
  RoleDTO,
  TaskDTO,
  TeamDTO,
  ValidatorDTO,
} from "./domain";

export type DemoUser = { id: number; name: string | null; email: string };

export type CreateDemoUserResult = Promise<DemoUser>;

export interface API {
  // ------------------------------ DEMO ------------------------------
  createDemoUser: () => CreateDemoUserResult;
  // ------------------------------ ACTIONS ------------------------------
  createAction: (actionDTO: ActionDTO) => Promise<ActionDTO>;
  getAction: (id: string) => Promise<ActionDTO | null>;
  getActions: () => Promise<ActionDTO[]>;
  getActionsByPhase: (phaseId: string) => Promise<ActionDTO[]>;
  updateAction: (actionDTO: ActionDTO) => Promise<ActionDTO>;
  deleteAction: (id: string) => Promise<void>;
  // ------------------------------ AGENTS ------------------------------
  createAgent: (agentDTO: AgentDTO) => Promise<AgentDTO>;
  getAgent: (id: string) => Promise<AgentDTO | null>;
  getAgents: () => Promise<AgentDTO[]>;
  updateAgent: (agentDTO: AgentDTO) => Promise<AgentDTO>;
  deleteAgent: (id: string) => Promise<void>;
  // ------------------------------ JOBS ------------------------------
  createJob: (jobDTO: JobDTO) => Promise<JobDTO>;
  getJob: (id: string) => Promise<JobDTO | null>;
  getJobs: () => Promise<JobDTO[]>;
  updateJob: (jobDTO: JobDTO) => Promise<JobDTO>;
  deleteJob: (id: string) => Promise<void>;
  // ------------------------------ PHASES ------------------------------
  createPhase: (phaseDTO: PhaseDTO) => Promise<PhaseDTO>;
  getPhase: (id: string) => Promise<PhaseDTO | null>;
  getPhases: () => Promise<PhaseDTO[]>;
  updatePhase: (phaseDTO: PhaseDTO) => Promise<PhaseDTO>;
  deletePhase: (id: string) => Promise<void>;
  // ------------------------------ PLANS ------------------------------
  createPlan: (planDTO: PlanDTO) => Promise<PlanDTO>;
  getPlan: (id: string) => Promise<PlanDTO | null>;
  getPlans: () => Promise<PlanDTO[]>;
  updatePlan: (planDTO: PlanDTO) => Promise<PlanDTO>;
  deletePlan: (id: string) => Promise<void>;
  // ------------------------------ PROJECTS ------------------------------
  createProject: (projectDTO: ProjectDTO) => Promise<ProjectDTO>;
  getProject: (id: string) => Promise<ProjectDTO | null>;
  getProjects: () => Promise<ProjectDTO[]>;
  updateProject: (projectDTO: ProjectDTO) => Promise<ProjectDTO>;
  deleteProject: (id: string) => Promise<void>;
  // ------------------------------ ROLES ------------------------------
  createRole: (roleDTO: RoleDTO) => Promise<RoleDTO>;
  getRole: (id: string) => Promise<RoleDTO | null>;
  getRoles: () => Promise<RoleDTO[]>;
  updateRole: (roleDTO: RoleDTO) => Promise<RoleDTO>;
  deleteRole: (id: string) => Promise<void>;
  // ------------------------------ TASKS ------------------------------
  createTask: (taskDTO: TaskDTO) => Promise<TaskDTO>;
  getTask: (id: string) => Promise<TaskDTO | null>;
  getTasks: () => Promise<TaskDTO[]>;
  updateTask: (taskDTO: TaskDTO) => Promise<TaskDTO>;
  deleteTask: (id: string) => Promise<void>;
  // ------------------------------ TEAMS ------------------------------
  createTeam: (teamDTO: TeamDTO) => Promise<TeamDTO>;
  getTeam: (id: string) => Promise<TeamDTO | null>;
  getTeams: () => Promise<TeamDTO[]>;
  updateTeam: (teamDTO: TeamDTO) => Promise<TeamDTO>;
  deleteTeam: (id: string) => Promise<void>;
  // ------------------------------ VALIDATORS ------------------------------
  createValidator: (validatorDTO: ValidatorDTO) => Promise<ValidatorDTO>;
  getValidator: (id: string) => Promise<ValidatorDTO | null>;
  getValidators: () => Promise<ValidatorDTO[]>;
  updateValidator: (validatorDTO: ValidatorDTO) => Promise<ValidatorDTO>;
  deleteValidator: (id: string) => Promise<void>;
}
