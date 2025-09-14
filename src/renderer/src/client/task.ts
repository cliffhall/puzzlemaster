import {
  Task,
  TaskResult,
  TaskListResult,
  TaskCountsResult,
  DeleteResult,
  TaskDTO,
  CreateTaskDTO,
} from "../../../domain";

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

export async function getTaskCountsByJob(): Promise<
  Record<string, number> | undefined
> {
  const result: TaskCountsResult = await window.puzzlemaster.task.getTaskCountsByJob();
  let returnValue: Record<string, number> | undefined;

  if (result.success) {
    console.log("Retrieved Task Counts by Job:", result.data);
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
