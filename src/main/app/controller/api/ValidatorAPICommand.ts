import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ValidatorProxy } from "../../model/ValidatorProxy";
import { ValidatorDTO } from "../../../../types/domain";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class ValidatorAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ ValidatorAPICommand - Installing Validator API Handlers", 2);
    const validatorProxy = f.retrieveProxy(
      ValidatorProxy.NAME,
    ) as ValidatorProxy;

    // Create a validator and return it
    ipcMain.handle(
      "create-validator",
      async (_, validatorDTO: ValidatorDTO) => {
        return await validatorProxy.createValidator(validatorDTO);
      },
    );

    // Get a validator by id
    ipcMain.handle("get-validator", async (_, id: string) => {
      return await validatorProxy.getValidator(id);
    });

    // Get all validators
    ipcMain.handle("get-validators", async () => {
      return await validatorProxy.getValidators();
    });

    // Update a validator
    ipcMain.handle(
      "update-validator",
      async (_, validatorDTO: ValidatorDTO) => {
        const { id, ...updateData } = validatorDTO;
        return await validatorProxy.updateValidator(id, updateData);
      },
    );

    // Delete a validator
    ipcMain.handle("delete-validator", async (_, id: string) => {
      return await validatorProxy.deleteValidator(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
