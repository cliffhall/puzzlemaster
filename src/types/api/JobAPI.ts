import {
  JobDTO,
  CreateJobDTO,
  JobResult,
  JobListResult,
  DeleteResult,
} from "../domain";

export interface JobAPI {
  createJob: (jobDTO: CreateJobDTO) => Promise<JobResult>;
  getJob: (id: string) => Promise<JobResult>;
  getJobs: () => Promise<JobListResult>;
  updateJob: (jobDTO: JobDTO) => Promise<JobResult>;
  deleteJob: (id: string) => Promise<DeleteResult>;
}
