import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { AgentDTO, AgentAPIMethods } from "../../../../domain";
import { AgentProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class AgentAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ AgentAPICommand - Installing Agent API Handlers", 2);
    const agentProxy = f.retrieveProxy(AgentProxy.NAME) as AgentProxy;

    // Create an agent and return it
    ipcMain.handle(
      AgentAPIMethods.CREATE_AGENT,
      async (_, agentDTO: AgentDTO) => {
        const result = await agentProxy.createAgent(agentDTO);
        return flattenResult(result);
      },
    );

    // Get an agent by id
    ipcMain.handle(AgentAPIMethods.GET_AGENT, async (_, id: string) => {
      const result = await agentProxy.getAgent(id);
      return flattenResult(result);
    });

    // Get all agents
    ipcMain.handle(AgentAPIMethods.GET_AGENTS, async () => {
      const result = await agentProxy.getAgents();
      return flattenResult(result);
    });

    // Update an agent
    ipcMain.handle(
      AgentAPIMethods.UPDATE_AGENT,
      async (_, agentDTO: AgentDTO) => {
        const { id, ...updateData } = agentDTO;
        const result = await agentProxy.updateAgent(id, updateData);
        return flattenResult(result);
      },
    );

    // Delete an agent
    ipcMain.handle(AgentAPIMethods.DELETE_AGENT, async (_, id: string) => {
      const result = await agentProxy.deleteAgent(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
