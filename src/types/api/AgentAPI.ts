import {
  AgentDTO,
  CreateAgentDTO,
  AgentResult,
  AgentListResult,
  DeleteResult,
} from "../domain";

export interface AgentAPI {
  createAgent: (agentDTO: CreateAgentDTO) => Promise<AgentResult>;
  getAgent: (id: string) => Promise<AgentResult>;
  getAgents: () => Promise<AgentListResult>;
  updateAgent: (agentDTO: AgentDTO) => Promise<AgentResult>;
  deleteAgent: (id: string) => Promise<DeleteResult>;
}
