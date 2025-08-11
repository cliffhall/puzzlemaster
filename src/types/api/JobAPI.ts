import { JobDTO, JobResult, JobListResult, DeleteResult } from "../domain";

export interface JobAPI {
  createJob: (jobDTO: JobDTO) => Promise<JobResult>;
  getJob: (id: string) => Promise<JobResult>;
  getJobs: () => Promise<JobListResult>;
  updateJob: (jobDTO: JobDTO) => Promise<JobResult>;
  deleteJob: (id: string) => Promise<DeleteResult>;
}
