import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ValidatorProxy } from "../../model";
import { ValidatorDTO, ValidatorAPIMethods } from "../../../../types/domain";
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
        return await validatorProxy.createValidator(validatorDTO);
      },
    );

    // Get a validator by id
    ipcMain.handle(ValidatorAPIMethods.GET_VALIDATOR, async (_, id: string) => {
      return await validatorProxy.getValidator(id);
    });

    // Get all validators
    ipcMain.handle(ValidatorAPIMethods.GET_VALIDATORS, async () => {
      return await validatorProxy.getValidators();
    });

    // Update a validator
    ipcMain.handle(
      ValidatorAPIMethods.UPDATE_VALIDATOR,
      async (_, validatorDTO: ValidatorDTO) => {
        const { id, ...updateData } = validatorDTO;
        return await validatorProxy.updateValidator(id, updateData);
      },
    );

    // Delete a validator
    ipcMain.handle(
      ValidatorAPIMethods.DELETE_VALIDATOR,
      async (_, id: string) => {
        return await validatorProxy.deleteValidator(id);
      },
    );

    // Signal completion
    this.commandComplete();
  }
}
