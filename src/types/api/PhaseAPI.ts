import {
  PhaseDTO,
  PhaseResult,
  PhaseListResult,
  DeleteResult,
} from "../domain";

export interface PhaseAPI {
  createPhase: (phaseDTO: PhaseDTO) => Promise<PhaseResult>;
  getPhase: (id: string) => Promise<PhaseResult>;
  getPhases: () => Promise<PhaseListResult>;
  updatePhase: (phaseDTO: PhaseDTO) => Promise<PhaseResult>;
  deletePhase: (id: string) => Promise<DeleteResult>;
}
