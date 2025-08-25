import {
  Task,
  TaskResult,
  TaskListResult,
  DeleteResult,
  TaskDTO,
  CreateTaskDTO,
} from "../../../types/domain";

export async function createTask(
  taskData: CreateTaskDTO,
): Promise<Task | undefined> {
  const result: TaskResult =
    await window.puzzlemaster.task.createTask(taskData);
  let returnValue: Task | undefined;

  if (result.success) {
    console.log("Created Task:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getTask(id: string): Promise<Task | undefined> {
  const result: TaskResult = await window.puzzlemaster.task.getTask(id);
  let returnValue: Task | undefined;

  if (result.success) {
    console.log("Retrieved Task:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getTasks(): Promise<Task[] | undefined> {
  const result: TaskListResult = await window.puzzlemaster.task.getTasks();
  let returnValue: Task[] | undefined;

  if (result.success) {
    console.log("Retrieved Tasks:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updateTask(taskData: TaskDTO): Promise<Task | undefined> {
  const result: TaskResult =
    await window.puzzlemaster.task.updateTask(taskData);
  let returnValue: Task | undefined;

  if (result.success) {
    console.log("Updated Task:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deleteTask(id: string): Promise<boolean | undefined> {
  const result: DeleteResult = await window.puzzlemaster.task.deleteTask(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Task:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
