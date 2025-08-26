import {
  ActionDTO,
  CreateActionDTO,
  ActionResult,
  ActionListResult,
  DeleteResult,
} from "../index";

export interface ActionAPI {
  createAction: (actionDTO: CreateActionDTO) => Promise<ActionResult>;
  getAction: (id: string) => Promise<ActionResult>;
  getActions: () => Promise<ActionListResult>;
  getActionsByPhase: (phaseId: string) => Promise<ActionListResult>;
  updateAction: (actionDTO: ActionDTO) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<DeleteResult>;
}
