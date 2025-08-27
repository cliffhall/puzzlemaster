import { ReactElement, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Group, Image, ScrollArea, Text } from "@mantine/core";
import {
  AddProjectForm,
  ProjectCreateForm,
  ProjectEditForm,
  ProjectList,
} from "../Project";
import { TitleBar } from "../TitleBar";
import { getProjects } from "../../client/project";
import type { Project } from "../../../../domain";

export function Shell(): ReactElement {
  const [opened, { toggle }] = useDisclosure(true);

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [draftProjectName, setDraftProjectName] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const loadProjects = async (): Promise<void> => {
    const list = await getProjects();
    setProjects(list ?? []);
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  return (
    <AppShell
      padding="md"
      header={{ height: 45 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { desktop: !opened } }}
    >
      <TitleBar opened={opened} toggle={toggle} />
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
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelect={(id) => {
              setDraftProjectName(null);
              setSelectedProjectId(id);
            }}
            onDeleted={async (id) => {
              // If the deleted project is currently selected, clear selection
              if (selectedProjectId === id) {
                setSelectedProjectId(null);
              }
              await loadProjects();
            }}
          />
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
