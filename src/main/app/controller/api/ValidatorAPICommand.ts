import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ValidatorDTO, ValidatorAPIMethods } from "../../../../types/domain";
import { ValidatorProxy } from "../../model";
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
      ValidatorAPIMethods.CREATE_VALIDATOR,
      async (_, validatorDTO: ValidatorDTO) => {
        const result = await validatorProxy.createValidator(validatorDTO);
        if (result.isOk()) return { success: true, data: result.value };
        return { success: false, error: result.error.message };
      },
    );

    // Get a validator by id
    ipcMain.handle(ValidatorAPIMethods.GET_VALIDATOR, async (_, id: string) => {
      const result = await validatorProxy.getValidator(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get all validators
    ipcMain.handle(ValidatorAPIMethods.GET_VALIDATORS, async () => {
      const result = await validatorProxy.getValidators();
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Update a validator
    ipcMain.handle(
      ValidatorAPIMethods.UPDATE_VALIDATOR,
      async (_, validatorDTO: ValidatorDTO) => {
        const { id, ...updateData } = validatorDTO;
        const result = await validatorProxy.updateValidator(id, updateData);
        if (result.isOk()) return { success: true, data: result.value };
        return { success: false, error: result.error.message };
      },
    );

    // Delete a validator
    ipcMain.handle(
      ValidatorAPIMethods.DELETE_VALIDATOR,
      async (_, id: string) => {
        const result = await validatorProxy.deleteValidator(id);
        if (result.isOk()) return { success: true, data: result.value };
        return { success: false, error: result.error.message };
      },
    );

    // Signal completion
    this.commandComplete();
  }
}
