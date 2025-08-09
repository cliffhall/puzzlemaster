import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { AgentDTO } from "../../../../types/domain";
import { AgentProxy } from "../../model/AgentProxy";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class AgentAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ AgentAPICommand - Installing Agent API Handlers", 2);
    const agentProxy = f.retrieveProxy(AgentProxy.NAME) as AgentProxy;

    // Create an agent and return it
    ipcMain.handle("create-agent", async (_, agentDTO: AgentDTO) => {
      return await agentProxy.createAgent(agentDTO);
    });

    // Get an agent by id
    ipcMain.handle("get-agent", async (_, id: string) => {
      return await agentProxy.getAgent(id);
    });

    // Get all agents
    ipcMain.handle("get-agents", async () => {
      return await agentProxy.getAgents();
    });

    // Update an agent
    ipcMain.handle("update-agent", async (_, agentDTO: AgentDTO) => {
      const { id, ...updateData } = agentDTO;
      return await agentProxy.updateAgent(id, updateData);
    });

    // Delete an agent
    ipcMain.handle("delete-agent", async (_, id: string) => {
      return await agentProxy.deleteAgent(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
