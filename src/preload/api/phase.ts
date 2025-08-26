import { ipcRenderer } from "electron";
import { PhaseAPI } from "../../domain/api/PhaseAPI";
import { PhaseAPIMethods, PhaseDTO, CreatePhaseDTO } from "../../domain";

export const phase: PhaseAPI = {
  createPhase: (phaseDTO: CreatePhaseDTO) =>
    ipcRenderer.invoke(PhaseAPIMethods.CREATE_PHASE, phaseDTO),
  getPhase: (id: string) => ipcRenderer.invoke(PhaseAPIMethods.GET_PHASE, id),
  getPhases: () => ipcRenderer.invoke(PhaseAPIMethods.GET_PHASES),
  updatePhase: (phaseDTO: PhaseDTO) =>
    ipcRenderer.invoke(PhaseAPIMethods.UPDATE_PHASE, phaseDTO),
  deletePhase: (id: string) =>
    ipcRenderer.invoke(PhaseAPIMethods.DELETE_PHASE, id),
};
