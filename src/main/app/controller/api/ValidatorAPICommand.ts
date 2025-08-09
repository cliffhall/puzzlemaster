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
        return validatorProxy.createValidator(validatorDTO);
      },
    );

    // Get a validator by id
    ipcMain.handle(ValidatorAPIMethods.GET_VALIDATOR, async (_, id: string) => {
      return validatorProxy.getValidator(id);
    });

    // Get all validators
    ipcMain.handle(ValidatorAPIMethods.GET_VALIDATORS, async () => {
      return validatorProxy.getValidators();
    });

    // Update a validator
    ipcMain.handle(
      ValidatorAPIMethods.UPDATE_VALIDATOR,
      async (_, validatorDTO: ValidatorDTO) => {
        const { id, ...updateData } = validatorDTO;
        return validatorProxy.updateValidator(id, updateData);
      },
    );

    // Delete a validator
    ipcMain.handle(
      ValidatorAPIMethods.DELETE_VALIDATOR,
      async (_, id: string) => {
        return validatorProxy.deleteValidator(id);
      },
    );

    // Signal completion
    this.commandComplete();
  }
}
