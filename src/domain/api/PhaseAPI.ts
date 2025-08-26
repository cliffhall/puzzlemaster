import {
  PhaseDTO,
  CreatePhaseDTO,
  PhaseResult,
  PhaseListResult,
  DeleteResult,
} from "../index";

export interface PhaseAPI {
  createPhase: (phaseDTO: CreatePhaseDTO) => Promise<PhaseResult>;
  getPhase: (id: string) => Promise<PhaseResult>;
  getPhases: () => Promise<PhaseListResult>;
  updatePhase: (phaseDTO: PhaseDTO) => Promise<PhaseResult>;
  deletePhase: (id: string) => Promise<DeleteResult>;
}
