import { ReactElement, useState } from "react";
import { ActionIcon, NavLink, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconX } from "@tabler/icons-react";
import type { Project } from "../../../../domain";
import { deleteProject } from "../../client/project";

export type ProjectListProps = {
  projects: Project[] | null;
  selectedProjectId: string | null;
  onSelect: (id: string) => void;
  onDeleted?: (id: string) => void | Promise<void>;
};

/**
 * ProjectList
 *
 * Renders loading/empty states and a list of projects as NavLinks.
 * Selection is indicated via the `active` prop and selection is sent via onSelect.
 * Also provides an inline delete (X) button with confirmation.
 */
export function ProjectList({
  projects,
  selectedProjectId,
  onSelect,
  onDeleted,
}: ProjectListProps): ReactElement {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (projects === null) {
    return <Text c="dimmed">Loading projects…</Text>;
  }
  if (projects.length === 0) {
    return <Text c="dimmed">No projects yet</Text>;
  }

  const confirmAndDelete = (id: string, name: string): void => {
    modals.openConfirmModal({
      title: "Delete project",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the project &quot;{name}&quot;? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          setDeletingId(id);
          const ok = await deleteProject(id);
          // If API returns undefined on error, treat as failure
          if (ok) {
            await onDeleted?.(id);
          }
        } finally {
          setDeletingId((curr) => (curr === id ? null : curr));
        }
      },
    });
  };

  return (
    <>
      {projects.map((project) => (
        <NavLink
          href="#"
          key={project.id}
          active={selectedProjectId === project.id}
          onClick={(event) => {
            event.preventDefault();
            onSelect(project.id);
          }}
          label={project.name}
          rightSection={
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              aria-label={`Delete ${project.name}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmAndDelete(project.id, project.name);
              }}
              loading={deletingId === project.id}
            >
              <IconX size={14} />
            </ActionIcon>
          }
        />
      ))}
    </>
  );
}
