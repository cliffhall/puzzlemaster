import { ipcRenderer } from "electron";
import { ActionAPI } from "../../domain/api/ActionAPI";
import { ActionAPIMethods, ActionDTO, CreateActionDTO } from "../../domain";

export const action: ActionAPI = {
  createAction: (actionDTO: CreateActionDTO) =>
    ipcRenderer.invoke(ActionAPIMethods.CREATE_ACTION, actionDTO),
  getAction: (id: string) =>
    ipcRenderer.invoke(ActionAPIMethods.GET_ACTION, id),
  getActions: () => ipcRenderer.invoke(ActionAPIMethods.GET_ACTIONS),
  getActionsByPhase: (phaseId: string) =>
    ipcRenderer.invoke(ActionAPIMethods.GET_ACTIONS_BY_PHASE, phaseId),
  updateAction: (actionDTO: ActionDTO) =>
    ipcRenderer.invoke(ActionAPIMethods.UPDATE_ACTION, actionDTO),
  deleteAction: (id: string) =>
    ipcRenderer.invoke(ActionAPIMethods.DELETE_ACTION, id),
};
