import { PuzzleMasterAPI } from "../../domain/api";
import { action } from "./action";
import { agent } from "./agent";
import { job } from "./job";
import { phase } from "./phase";
import { plan } from "./plan";
import { project } from "./project";
import { role } from "./role";
import { task } from "./task";
import { team } from "./team";
import { validator } from "./validator";
import { window } from "./window";

export const puzzleMasterAPI: PuzzleMasterAPI = {
  action,
  agent,
  job,
  phase,
  plan,
  project,
  role,
  task,
  team,
  validator,
  window,
};
