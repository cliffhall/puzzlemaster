import { ReactElement, useState } from "react";
import { ActionIcon, NavLink, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import type { Project } from "../../../../domain";
import { deleteProject } from "../../client/project";

export type ProjectListProps = {
  projects: Project[] | null;
  selectedProjectId: string | null;
  onSelect: (id: string) => void;
  onDeleted?: (id: string) => void | Promise<void>;
  onReorder?: (projects: Project[]) => void | Promise<void>;
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
  onReorder,
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
          Are you sure you want to delete the project <b>{name}</b>? This action
          cannot be undone.
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

  const handleDragStart = (e: React.DragEvent, draggedId: string): void => {
    e.dataTransfer.setData("text/plain", draggedId);
    // Indicate move effect
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent): void => {
    // Allow drop
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string): void => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;
    const fromIndex = projects.findIndex((p) => p.id === draggedId);
    const toIndex = projects.findIndex((p) => p.id === targetId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
    const updated = projects.slice();
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    void onReorder?.(updated);
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
          draggable
          onDragStart={(e) => handleDragStart(e, project.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, project.id)}
          label={project.name}
          leftSection={
            <ActionIcon
              size="sm"
              p="none"
              variant="subtle"
              aria-label={`Drag ${project.name}`}
              style={{ cursor: "grab" }}
            >
              <IconGripVertical size={14} />
            </ActionIcon>
          }
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
