import {
  ActionDTO,
  ActionResult,
  ActionListResult,
  DeleteResult,
} from "../domain";

export interface ActionAPI {
  createAction: (actionDTO: ActionDTO) => Promise<ActionResult>;
  getAction: (id: string) => Promise<ActionResult>;
  getActions: () => Promise<ActionListResult>;
  getActionsByPhase: (phaseId: string) => Promise<ActionListResult>;
  updateAction: (actionDTO: ActionDTO) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<DeleteResult>;
}
