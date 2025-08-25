import {
  Agent,
  AgentResult,
  AgentListResult,
  DeleteResult,
  AgentDTO,
  CreateAgentDTO,
} from "../../../types/domain";

export async function createAgent(
  agentData: CreateAgentDTO,
): Promise<Agent | undefined> {
  const result: AgentResult =
    await window.puzzlemaster.agent.createAgent(agentData);
  let returnValue: Agent | undefined;

  if (result.success) {
    console.log("Created Agent:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getAgent(id: string): Promise<Agent | undefined> {
  const result: AgentResult = await window.puzzlemaster.agent.getAgent(id);
  let returnValue: Agent | undefined;

  if (result.success) {
    console.log("Retrieved Agent:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getAgents(): Promise<Agent[] | undefined> {
  const result: AgentListResult = await window.puzzlemaster.agent.getAgents();
  let returnValue: Agent[] | undefined;

  if (result.success) {
    console.log("Retrieved Agents:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updateAgent(
  agentData: AgentDTO,
): Promise<Agent | undefined> {
  const result: AgentResult =
    await window.puzzlemaster.agent.updateAgent(agentData);
  let returnValue: Agent | undefined;

  if (result.success) {
    console.log("Updated Agent:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deleteAgent(id: string): Promise<boolean | undefined> {
  const result: DeleteResult = await window.puzzlemaster.agent.deleteAgent(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Agent:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
