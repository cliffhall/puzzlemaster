import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { AgentDTO, AgentAPIMethods } from "../../../../types/domain";
import { AgentProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
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
        return agentProxy.createAgent(agentDTO);
      },
    );

    // Get an agent by id
    ipcMain.handle(AgentAPIMethods.GET_AGENT, async (_, id: string) => {
      return agentProxy.getAgent(id);
    });

    // Get all agents
    ipcMain.handle(AgentAPIMethods.GET_AGENTS, async () => {
      return agentProxy.getAgents();
    });

    // Update an agent
    ipcMain.handle(
      AgentAPIMethods.UPDATE_AGENT,
      async (_, agentDTO: AgentDTO) => {
        const { id, ...updateData } = agentDTO;
        return agentProxy.updateAgent(id, updateData);
      },
    );

    // Delete an agent
    ipcMain.handle(AgentAPIMethods.DELETE_AGENT, async (_, id: string) => {
      return agentProxy.deleteAgent(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
