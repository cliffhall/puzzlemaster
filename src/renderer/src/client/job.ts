import {
  Job,
  JobResult,
  JobListResult,
  DeleteResult,
  JobDTO,
  CreateJobDTO,
} from "../../../types/domain";

export async function createJob(
  jobData: CreateJobDTO,
): Promise<Job | undefined> {
  const result: JobResult = await window.puzzlemaster.job.createJob(jobData);
  let returnValue: Job | undefined;

  if (result.success) {
    console.log("Created Job:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getJob(id: string): Promise<Job | undefined> {
  const result: JobResult = await window.puzzlemaster.job.getJob(id);
  let returnValue: Job | undefined;

  if (result.success) {
    console.log("Retrieved Job:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getJobs(): Promise<Job[] | undefined> {
  const result: JobListResult = await window.puzzlemaster.job.getJobs();
  let returnValue: Job[] | undefined;

  if (result.success) {
    console.log("Retrieved Jobs:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updateJob(jobData: JobDTO): Promise<Job | undefined> {
  const result: JobResult = await window.puzzlemaster.job.updateJob(jobData);
  let returnValue: Job | undefined;

  if (result.success) {
    console.log("Updated Job:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deleteJob(id: string): Promise<boolean | undefined> {
  const result: DeleteResult = await window.puzzlemaster.job.deleteJob(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Job:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
