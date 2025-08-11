import {
  AgentDTO,
  AgentResult,
  AgentListResult,
  DeleteResult,
} from "../domain";

export interface AgentAPI {
  createAgent: (agentDTO: AgentDTO) => Promise<AgentResult>;
  getAgent: (id: string) => Promise<AgentResult>;
  getAgents: () => Promise<AgentListResult>;
  updateAgent: (agentDTO: AgentDTO) => Promise<AgentResult>;
  deleteAgent: (id: string) => Promise<DeleteResult>;
}
