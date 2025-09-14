import { ReactElement, useCallback, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Group, Image, ScrollArea, Tabs } from "@mantine/core";
import {
  AddProjectForm,
  ProjectCreateForm,
  ProjectEditForm,
  ProjectList,
} from "../Project";
import { AddRoleForm, RoleCreateForm, RoleEditForm, RoleList } from "../Role";
import { TitleBar } from "../TitleBar";
import { getProjects, getRoles } from "../../client";
import type { Project, Role } from "../../../../domain";

const PROJECT_ORDER_KEY = "projectOrder";
const ROLE_ORDER_KEY = "roleOrder";
const ACTIVE_TAB_KEY = "activeTab";

const readOrder = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as string[]) : [];
  } catch {
    return [];
  }
};

const writeOrder = (key: string, ids: string[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // ignore storage errors
  }
};

const readActiveTab = (): string => {
  try {
    return localStorage.getItem(ACTIVE_TAB_KEY) || "projects";
  } catch {
    return "projects";
  }
};

const writeActiveTab = (tab: string): void => {
  try {
    localStorage.setItem(ACTIVE_TAB_KEY, tab);
  } catch {
    // ignore storage errors
  }
};

const sortBySavedOrder = (list: Project[], key: string): Project[] => {
  const saved = readOrder(key);
  // Keep only ids that still exist and maintain their order
  const existingInSaved = saved.filter((id) => list.some((p) => p.id === id));
  // Find ids not in saved and append them (stable)
  const missing = list
    .map((p) => p.id)
    .filter((id) => !existingInSaved.includes(id));
  const finalOrder = [...existingInSaved, ...missing];
  // Persist cleaned/updated order
  writeOrder(key, finalOrder);
  // Return list sorted to match finalOrder
  const orderIndex = new Map(finalOrder.map((id, idx) => [id, idx] as const));
  return [...list].sort(
    (a, b) => orderIndex.get(a.id)! - orderIndex.get(b.id)!,
  );
};

const sortRolesBySavedOrder = (list: Role[]): Role[] => {
  const saved = readOrder(ROLE_ORDER_KEY);
  // Keep only ids that still exist and maintain their order
  const existingInSaved = saved.filter((id) => list.some((r) => r.id === id));
  // Find ids not in saved and append them (stable)
  const missing = list
    .map((r) => r.id)
    .filter((id) => !existingInSaved.includes(id));
  const finalOrder = [...existingInSaved, ...missing];
  // Persist cleaned/updated order
  writeOrder(ROLE_ORDER_KEY, finalOrder);
  // Return list sorted to match finalOrder
  const orderIndex = new Map(finalOrder.map((id, idx) => [id, idx] as const));
  return [...list].sort(
    (a, b) => orderIndex.get(a.id)! - orderIndex.get(b.id)!,
  );
};

export function Shell(): ReactElement {
  const [opened, { toggle }] = useDisclosure(true);
  const [activeTab, setActiveTab] = useState<string>(readActiveTab());

  // Project state
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [draftProjectName, setDraftProjectName] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  // Role state
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [draftRoleName, setDraftRoleName] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const loadProjects = useCallback(async (): Promise<void> => {
    const list = await getProjects();
    const ordered = list ? sortBySavedOrder(list, PROJECT_ORDER_KEY) : [];
    setProjects(ordered);
  }, []);

  const loadRoles = useCallback(async (): Promise<void> => {
    const list = await getRoles();
    const ordered = list ? sortRolesBySavedOrder(list) : [];
    setRoles(ordered);
  }, []);

  useEffect(() => {
    void loadProjects();
    void loadRoles();
  }, [loadProjects, loadRoles]);

  const handleTabChange = useCallback((tab: string | null) => {
    if (tab) {
      setActiveTab(tab);
      writeActiveTab(tab);
      // Clear selections when switching tabs
      setSelectedProjectId(null);
      setSelectedRoleId(null);
      setDraftProjectName(null);
      setDraftRoleName(null);
    }
  }, []);

  const handleProjectUpdated = useCallback(async () => {
    await loadProjects();
  }, [loadProjects]);

  const handleRoleUpdated = useCallback(async () => {
    await loadRoles();
  }, [loadRoles]);

  const handleEditClose = useCallback(() => {
    setSelectedProjectId(null);
    setSelectedRoleId(null);
    if (!opened) toggle();
  }, [opened, toggle]);

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
          </Group>
        </AppShell.Section>
        <AppShell.Section grow my="sm" component={ScrollArea} px="none">
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tabs.List>
              <Tabs.Tab value="projects">Projects</Tabs.Tab>
              <Tabs.Tab value="roles">Roles</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="projects" pt="sm">
              <ProjectList
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelect={(id) => {
                  setDraftProjectName(null);
                  setDraftRoleName(null);
                  setSelectedProjectId(id);
                  setSelectedRoleId(null);
                  toggle();
                }}
                onDeleted={async (id) => {
                  // If the deleted project is currently selected, clear selection
                  if (selectedProjectId === id) {
                    setSelectedProjectId(null);
                  }
                  // remove id from saved order
                  const order = readOrder(PROJECT_ORDER_KEY).filter(
                    (oid) => oid !== id,
                  );
                  writeOrder(PROJECT_ORDER_KEY, order);
                  await loadProjects();
                }}
                onReorder={async (ordered) => {
                  // persist the new order and update state
                  writeOrder(
                    PROJECT_ORDER_KEY,
                    ordered.map((p) => p.id),
                  );
                  setProjects(ordered);
                }}
              />
            </Tabs.Panel>

            <Tabs.Panel value="roles" pt="sm">
              <RoleList
                roles={roles}
                selectedRoleId={selectedRoleId}
                onSelect={(id) => {
                  setDraftRoleName(null);
                  setDraftProjectName(null);
                  setSelectedRoleId(id);
                  setSelectedProjectId(null);
                  toggle();
                }}
                onDeleted={async (id) => {
                  // If the deleted role is currently selected, clear selection
                  if (selectedRoleId === id) {
                    setSelectedRoleId(null);
                  }
                  // remove id from saved order
                  const order = readOrder(ROLE_ORDER_KEY).filter(
                    (oid) => oid !== id,
                  );
                  writeOrder(ROLE_ORDER_KEY, order);
                  await loadRoles();
                }}
                onReorder={async (ordered) => {
                  // persist the new order and update state
                  writeOrder(
                    ROLE_ORDER_KEY,
                    ordered.map((r) => r.id),
                  );
                  setRoles(ordered);
                }}
              />
            </Tabs.Panel>
          </Tabs>
        </AppShell.Section>
        <AppShell.Section p="none">
          {activeTab === "projects" ? (
            <AddProjectForm
              onAdd={async (name) => {
                setSelectedProjectId(null);
                setSelectedRoleId(null);
                setDraftProjectName(name);
                setDraftRoleName(null);
                toggle();
              }}
            />
          ) : (
            <AddRoleForm
              onAdd={async (name) => {
                setSelectedRoleId(null);
                setSelectedProjectId(null);
                setDraftRoleName(name);
                setDraftProjectName(null);
                toggle();
              }}
            />
          )}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        {draftProjectName ? (
          <ProjectCreateForm
            initialName={draftProjectName}
            onCreated={(newProject) => {
              // add the new project id to the end of the saved order (if not present)
              const order = readOrder(PROJECT_ORDER_KEY);
              if (!order.includes(newProject.id)) {
                order.push(newProject.id);
                writeOrder(PROJECT_ORDER_KEY, order);
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
              if (!opened) toggle();
            }}
          />
        ) : draftRoleName ? (
          <RoleCreateForm
            initialName={draftRoleName}
            onCreated={(newRole) => {
              // add the new role id to the end of the saved order (if not present)
              const order = readOrder(ROLE_ORDER_KEY);
              if (!order.includes(newRole.id)) {
                order.push(newRole.id);
                writeOrder(ROLE_ORDER_KEY, order);
              }
              setRoles((currentRoles) => [...(currentRoles ?? []), newRole]);
              setDraftRoleName(null);
              setSelectedRoleId(newRole.id);
            }}
            onCancel={() => {
              setDraftRoleName(null);
              if (!opened) toggle();
            }}
          />
        ) : selectedProjectId ? (
          <ProjectEditForm
            projectId={selectedProjectId}
            onUpdated={handleProjectUpdated}
            onClose={handleEditClose}
          />
        ) : selectedRoleId ? (
          <RoleEditForm
            roleId={selectedRoleId}
            onUpdated={handleRoleUpdated}
            onClose={handleEditClose}
          />
        ) : null}
      </AppShell.Main>
    </AppShell>
  );
}
