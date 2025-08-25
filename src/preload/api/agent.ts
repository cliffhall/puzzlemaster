import { ipcRenderer } from "electron";
import { AgentAPI } from "../../types/api/AgentAPI";
import { AgentAPIMethods, AgentDTO, CreateAgentDTO } from "../../types/domain";

export const agent: AgentAPI = {
  createAgent: (agentDTO: CreateAgentDTO) =>
    ipcRenderer.invoke(AgentAPIMethods.CREATE_AGENT, agentDTO),
  getAgent: (id: string) => ipcRenderer.invoke(AgentAPIMethods.GET_AGENT, id),
  getAgents: () => ipcRenderer.invoke(AgentAPIMethods.GET_AGENTS),
  updateAgent: (agentDTO: AgentDTO) =>
    ipcRenderer.invoke(AgentAPIMethods.UPDATE_AGENT, agentDTO),
  deleteAgent: (id: string) =>
    ipcRenderer.invoke(AgentAPIMethods.DELETE_AGENT, id),
};
