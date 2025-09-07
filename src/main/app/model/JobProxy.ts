import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { Job, JobDTO, DomainError } from "../../../domain";
import { Result, ok, err } from "neverthrow";
import { PrismaClient, JobStatus } from "db";

export class JobProxy extends Proxy {
  static NAME: string = "JobProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    super(JobProxy.NAME, process);
    this.prismaClient = prismaClient;
  }

  /**
   * Create a new job in the database
   * @param jobDTO The job data transfer object
   * @returns A Result containing the created job or a DomainError
   */
  public async createJob(jobDTO: JobDTO): Promise<Result<Job, DomainError>> {
    try {
      const job = await this.prismaClient.job.create({
        data: {
          id: jobDTO.id,
          name: jobDTO.name,
          description: jobDTO.description,
          status: jobDTO.status,
          phase: {
            connect: { id: jobDTO.phaseId },
          },
        },
      });

      return Job.create({
        id: job.id,
        name: job.name,
        description: job.description || undefined,
        status: job.status,
        phaseId: job.phaseId,
        tasks: [],
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create job", error));
    }
  }

  /**
   * Get a job by ID
   * @param id The job ID
   * @returns A Result containing the job or a DomainError
   */
  public async getJob(id: string): Promise<Result<Job, DomainError>> {
    try {
      const job = await this.prismaClient.job.findUnique({
        where: { id },
        include: {
          tasks: true,
        },
      });

      if (!job) {
        return err(new DomainError(`Job with ID ${id} not found`));
      }

      return Job.create({
        id: job.id,
        name: job.name,
        description: job.description || undefined,
        status: job.status,
        phaseId: job.phaseId,
        tasks: job.tasks.map((task) => task.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get job", error));
    }
  }

  /**
   * Get all jobs
   * @returns A Result containing an array of jobs or a DomainError
   */
  public async getJobs(): Promise<Result<Job[], DomainError>> {
    try {
      const jobs = await this.prismaClient.job.findMany({
        include: {
          tasks: true,
        },
      });

      const jobResults = jobs.map((job) =>
        Job.create({
          id: job.id,
          name: job.name,
          description: job.description || undefined,
          status: job.status,
          phaseId: job.phaseId,
          tasks: job.tasks.map((task) => task.id),
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(jobResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get jobs", error));
    }
  }

  /**
   * Update a job
   * @param id The job ID
   * @param jobDTO The job data transfer object (can be only fields that changed)
   * @returns A Result containing the updated job or a DomainError
   */
  public async updateJob(
    id: string,
    jobDTO: Partial<JobDTO>,
  ): Promise<Result<Job, DomainError>> {
    try {
      // First check if the job exists
      const existingJob = await this.prismaClient.job.findUnique({
        where: { id },
        include: {
          tasks: true,
        },
      });

      if (!existingJob) {
        return err(new DomainError(`Job with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        name?: string;
        description?: string;
        status?: JobStatus;
        phase?: { connect: { id: string } };
      } = {};
      if (jobDTO.name) updateData.name = jobDTO.name;
      if (jobDTO.description !== undefined)
        updateData.description = jobDTO.description;
      if (jobDTO.status) updateData.status = jobDTO.status as JobStatus;
      if (jobDTO.phaseId)
        updateData.phase = { connect: { id: jobDTO.phaseId } };

      // Update the job
      const job = await this.prismaClient.job.update({
        where: { id },
        data: updateData,
        include: {
          tasks: true,
        },
      });

      return Job.create({
        id: job.id,
        name: job.name,
        description: job.description || undefined,
        status: job.status,
        phaseId: job.phaseId,
        tasks: job.tasks.map((task) => task.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update job", error));
    }
  }

  /**
   * Delete a job
   * @param id The job ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteJob(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the job exists
      const existingJob = await this.prismaClient.job.findUnique({
        where: { id },
      });

      if (!existingJob) {
        return err(new DomainError(`Job with ID ${id} not found`));
      }

      // Delete the job
      await this.prismaClient.job.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete job", error));
    }
  }
}
