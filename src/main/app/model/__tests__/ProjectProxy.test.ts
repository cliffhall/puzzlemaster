import { createTestProjectProxy } from "../../../../test/project-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ProjectDTO } from "../../../../domain";
import { ProjectProxy } from "../ProjectProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

/**
 * Helper function to create test project data
 * @returns A project DTO for testing
 */
function createTestProjectDTO(): ProjectDTO {
  return {
    id: randomUUID(),
    name: "Test Project",
    description: "A test project description",
  };
}

describe("ProjectProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    projectProxy: ProjectProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestProjectProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createProject", () => {
    it("should create a project in the database", async () => {
      // Set up test data
      const projectDTO = createTestProjectDTO();

      // Call the method under test
      const result = await testSetup.projectProxy.createProject(projectDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const project = result.value;
        expect(project.id).toBe(projectDTO.id);
        expect(project.name).toBe(projectDTO.name);
        expect(project.description).toBe(projectDTO.description);
      }

      // Verify the project was created in the database
      const dbProject = await testSetup.prisma.project.findUnique({
        where: { id: projectDTO.id },
      });

      expect(dbProject).not.toBeNull();
      expect(dbProject?.name).toBe(projectDTO.name);
      expect(dbProject?.description).toBe(projectDTO.description);
    });

    it("should create a project without description", async () => {
      // Set up test data without description
      const projectDTO: ProjectDTO = {
        id: randomUUID(),
        name: "Test Project No Description",
      };

      // Call the method under test
      const result = await testSetup.projectProxy.createProject(projectDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const project = result.value;
        expect(project.id).toBe(projectDTO.id);
        expect(project.name).toBe(projectDTO.name);
        expect(project.description).toBeUndefined();
      }
    });
  });

  describe("getProject", () => {
    it("should retrieve a project from the database", async () => {
      // Set up test data
      const projectDTO = createTestProjectDTO();

      // Create the project in the database
      await testSetup.projectProxy.createProject(projectDTO);

      // Call the method under test
      const result = await testSetup.projectProxy.getProject(projectDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const project = result.value;
        expect(project.id).toBe(projectDTO.id);
        expect(project.name).toBe(projectDTO.name);
        expect(project.description).toBe(projectDTO.description);
      }
    });

    it("should return an error when project does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.projectProxy.getProject(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(
          `Project with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("getProjects", () => {
    it("should retrieve all projects from the database", async () => {
      // Set up test data for multiple projects
      const project1DTO = createTestProjectDTO();
      const project2DTO = createTestProjectDTO();
      project2DTO.name = "Test Project 2";

      // Create the projects in the database
      await testSetup.projectProxy.createProject(project1DTO);
      await testSetup.projectProxy.createProject(project2DTO);

      // Call the method under test
      const result = await testSetup.projectProxy.getProjects();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const projects = result.value;
        expect(projects.length).toBe(2);

        // Find the projects in the result by ID
        const foundProject1 = projects.find(
          (project) => project.id === project1DTO.id,
        );
        const foundProject2 = projects.find(
          (project) => project.id === project2DTO.id,
        );

        // Verify both projects were found
        expect(foundProject1).toBeDefined();
        expect(foundProject2).toBeDefined();

        // Verify project properties
        if (foundProject1) {
          expect(foundProject1.name).toBe(project1DTO.name);
          expect(foundProject1.description).toBe(project1DTO.description);
        }

        if (foundProject2) {
          expect(foundProject2.name).toBe(project2DTO.name);
          expect(foundProject2.description).toBe(project2DTO.description);
        }
      }
    });

    it("should return an empty array when no projects exist", async () => {
      // Call the method under test (without creating any projects)
      const result = await testSetup.projectProxy.getProjects();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const projects = result.value;
        expect(projects).toEqual([]);
      }
    });
  });

  describe("updateProject", () => {
    it("should update a project's name", async () => {
      // Set up test data
      const projectDTO = createTestProjectDTO();

      // Create the project in the database
      await testSetup.projectProxy.createProject(projectDTO);

      // Update the project
      const updatedName = "Updated Project Name";
      const result = await testSetup.projectProxy.updateProject(projectDTO.id, {
        name: updatedName,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const project = result.value;
        expect(project.id).toBe(projectDTO.id);
        expect(project.name).toBe(updatedName);
        expect(project.description).toBe(projectDTO.description);
      }

      // Verify the project was updated in the database
      const dbProject = await testSetup.prisma.project.findUnique({
        where: { id: projectDTO.id },
      });

      expect(dbProject?.name).toBe(updatedName);
    });

    it("should update a project's description", async () => {
      // Set up test data
      const projectDTO = createTestProjectDTO();

      // Create the project in the database
      await testSetup.projectProxy.createProject(projectDTO);

      // Update the project
      const updatedDescription = "Updated project description";
      const result = await testSetup.projectProxy.updateProject(projectDTO.id, {
        description: updatedDescription,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const project = result.value;
        expect(project.id).toBe(projectDTO.id);
        expect(project.name).toBe(projectDTO.name);
        expect(project.description).toBe(updatedDescription);
      }
    });

    it("should return an error when project does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.projectProxy.updateProject(nonExistentId, {
        name: "Updated Name",
      });

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(
          `Project with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("deleteProject", () => {
    it("should delete a project from the database", async () => {
      // Set up test data
      const projectDTO = createTestProjectDTO();

      // Create the project in the database
      await testSetup.projectProxy.createProject(projectDTO);

      // Call the method under test
      const result = await testSetup.projectProxy.deleteProject(projectDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the project was deleted from the database
      const dbProject = await testSetup.prisma.project.findUnique({
        where: { id: projectDTO.id },
      });

      expect(dbProject).toBeNull();
    });

    it("should return an error when project does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.projectProxy.deleteProject(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(
          `Project with ID ${nonExistentId} not found`,
        );
      }
    });
  });
});
