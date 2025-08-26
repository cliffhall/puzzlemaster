import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ValidatorDTO, ValidatorAPIMethods } from "../../../../domain";
import { ValidatorProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
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
        return flattenResult(result);
      },
    );

    // Get a validator by id
    ipcMain.handle(ValidatorAPIMethods.GET_VALIDATOR, async (_, id: string) => {
      const result = await validatorProxy.getValidator(id);
      return flattenResult(result);
    });

    // Get all validators
    ipcMain.handle(ValidatorAPIMethods.GET_VALIDATORS, async () => {
      const result = await validatorProxy.getValidators();
      return flattenResult(result);
    });

    // Update a validator
    ipcMain.handle(
      ValidatorAPIMethods.UPDATE_VALIDATOR,
      async (_, validatorDTO: ValidatorDTO) => {
        const { id, ...updateData } = validatorDTO;
        const result = await validatorProxy.updateValidator(id, updateData);
        return flattenResult(result);
      },
    );

    // Delete a validator
    ipcMain.handle(
      ValidatorAPIMethods.DELETE_VALIDATOR,
      async (_, id: string) => {
        const result = await validatorProxy.deleteValidator(id);
        return flattenResult(result);
      },
    );

    // Signal completion
    this.commandComplete();
  }
}
