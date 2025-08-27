import { ReactElement, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Group,
  Image,
  NavLink,
  ScrollArea,
  Text,
} from "@mantine/core";
import { ThemeToggle } from "../../components/ThemeToggle";
import { NavToggle } from "../../components/NavToggle";
import classes from "./Shell.module.css";
import cx from "clsx";
import { useWindowState } from "../../hooks/useWindowState";
import { AddProjectForm, ProjectCreateForm, ProjectEditForm } from "../Project/Project";
import { getProjects } from "../../client/project";
import type { Project } from "../../../../domain";

export function Shell(): ReactElement {
  const [opened, { toggle }] = useDisclosure(true);
  const fullscreen = useWindowState();
  const [draftProjectName, setDraftProjectName] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);

  const loadProjects = async () => {
    const list = await getProjects();
    setProjects(list ?? []);
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  return (
    <AppShell
      header={{ height: 45 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { desktop: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group w="100%" gap="0" h="100%" wrap="nowrap">
          <Group
            pl={fullscreen ? "15px" : "80px"}
            h="100%"
            w="170px"
            gap="10px"
          >
            <NavToggle toggle={toggle} opened={opened} />
            <ThemeToggle />
          </Group>
          <Group
            className={cx(classes["header-content"])}
            justify="flex-end"
            h="100%"
            w="100%"
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <AppShell.Section h="100px">
          <Group w="100%">
            <Image src="images/icon.png" w="100px" h="100px" fit="contain" />
            <Text>
              <b>Projects</b>
            </Text>
          </Group>
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea} px="md">
          {projects === null && (
            <Text c="dimmed">Loading projects…</Text>
          )}
          {projects !== null && projects.length === 0 && (
            <Text c="dimmed">No projects yet</Text>
          )}
          {projects?.map((project) => (
            <NavLink
              href="#"
              key={project.id}
              active={selectedProjectId === project.id}
              onClick={(event) => {
                event.preventDefault();
                setDraftProjectName(null);
                setSelectedProjectId(project.id);
              }}
              label={project.name}
            />
          ))}
        </AppShell.Section>
        <AppShell.Section p="none">
          <AddProjectForm
            onAdd={async (name) => {
              setSelectedProjectId(null);
              setDraftProjectName(name);
            }}
          />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        {draftProjectName ? (
          <ProjectCreateForm
            initialName={draftProjectName}
            onCreated={async () => {
              setDraftProjectName(null);
              await loadProjects();
            }}
            onCancel={() => {
              setDraftProjectName(null);
            }}
          />
        ) : selectedProjectId ? (
          <ProjectEditForm
            projectId={selectedProjectId}
            onUpdated={async () => {
              await loadProjects();
            }}
            onCancel={() => {
              setSelectedProjectId(null);
            }}
          />
        ) : null}
      </AppShell.Main>
    </AppShell>
  );
}
