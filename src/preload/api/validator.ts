import { ipcRenderer } from "electron";
import { ValidatorAPI } from "../../types/api/ValidatorAPI";
import { ValidatorAPIMethods, ValidatorDTO } from "../../types/domain";

export const validator: ValidatorAPI = {
  createValidator: (validatorDTO: ValidatorDTO) =>
    ipcRenderer.invoke(ValidatorAPIMethods.CREATE_VALIDATOR, validatorDTO),
  getValidator: (id: string) =>
    ipcRenderer.invoke(ValidatorAPIMethods.GET_VALIDATOR, id),
  getValidators: () => ipcRenderer.invoke(ValidatorAPIMethods.GET_VALIDATORS),
  updateValidator: (validatorDTO: ValidatorDTO) =>
    ipcRenderer.invoke(ValidatorAPIMethods.UPDATE_VALIDATOR, validatorDTO),
  deleteValidator: (id: string) =>
    ipcRenderer.invoke(ValidatorAPIMethods.DELETE_VALIDATOR, id),
};
