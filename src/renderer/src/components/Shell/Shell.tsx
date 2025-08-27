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

  const ORDER_KEY = "projectOrder";

  const readOrder = (): string[] => {
    try {
      const raw = localStorage.getItem(ORDER_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? (arr as string[]) : [];
    } catch {
      return [];
    }
  };

  const writeOrder = (ids: string[]): void => {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(ids));
    } catch {
      // ignore storage errors
    }
  };

  const sortBySavedOrder = (list: Project[]): Project[] => {
    const saved = readOrder();
    // Keep only ids that still exist and maintain their order
    const existingInSaved = saved.filter((id) => list.some((p) => p.id === id));
    // Find ids not in saved and append them (stable)
    const missing = list
      .map((p) => p.id)
      .filter((id) => !existingInSaved.includes(id));
    const finalOrder = [...existingInSaved, ...missing];
    // Persist cleaned/updated order
    writeOrder(finalOrder);
    // Return list sorted to match finalOrder
    const orderIndex = new Map(finalOrder.map((id, idx) => [id, idx] as const));
    return [...list].sort(
      (a, b) => orderIndex.get(a.id)! - orderIndex.get(b.id)!,
    );
  };

  const loadProjects = async (): Promise<void> => {
    const list = await getProjects();
    const ordered = list ? sortBySavedOrder(list) : [];
    setProjects(ordered);
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
        <AppShell.Section grow my="sm" component={ScrollArea} px="none">
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
              // remove id from saved order
              const order = readOrder().filter((oid) => oid !== id);
              writeOrder(order);
              await loadProjects();
            }}
            onReorder={async (ordered) => {
              // persist new order and update state
              writeOrder(ordered.map((p) => p.id));
              setProjects(ordered);
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
            onCreated={(newProject) => {
              // add new project id to the end of the saved order (if not present)
              const order = readOrder();
              if (!order.includes(newProject.id)) {
                order.push(newProject.id);
                writeOrder(order);
              }
              setProjects((currentProjects) => [
                ...(currentProjects ?? []),
                newProject,
              ]);
              setDraftProjectName(null);
              setSelectedProjectId(newProject.id);
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
