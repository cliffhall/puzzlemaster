import { ipcRenderer } from "electron";
import { JobAPI } from "../../domain/api/JobAPI";
import { JobAPIMethods, JobDTO, CreateJobDTO } from "../../domain";

export const job: JobAPI = {
  createJob: (jobDTO: CreateJobDTO) =>
    ipcRenderer.invoke(JobAPIMethods.CREATE_JOB, jobDTO),
  getJob: (id: string) => ipcRenderer.invoke(JobAPIMethods.GET_JOB, id),
  getJobs: () => ipcRenderer.invoke(JobAPIMethods.GET_JOBS),
  updateJob: (jobDTO: JobDTO) =>
    ipcRenderer.invoke(JobAPIMethods.UPDATE_JOB, jobDTO),
  deleteJob: (id: string) => ipcRenderer.invoke(JobAPIMethods.DELETE_JOB, id),
};
