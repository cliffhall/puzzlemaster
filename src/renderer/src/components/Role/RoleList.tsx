import React, { ReactElement, useState } from "react";
import { ActionIcon, NavLink, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import type { Role } from "../../../../domain";
import { deleteRole } from "../../client";

export type RoleListProps = {
  roles: Role[] | null;
  selectedRoleId: string | null;
  onSelect: (id: string) => void;
  onDeleted?: (id: string) => void | Promise<void>;
  onReorder?: (roles: Role[]) => void | Promise<void>;
};

/**
 * RoleList
 *
 * Renders loading/empty states and a list of roles as NavLinks.
 * Selection is indicated via the `active` prop and selection is sent via onSelect.
 * Also provides an inline delete (X) button with confirmation.
 */
export function RoleList({
  roles,
  selectedRoleId,
  onSelect,
  onDeleted,
  onReorder,
}: RoleListProps): ReactElement {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (roles === null) {
    return <Text c="dimmed">Loading roles…</Text>;
  }
  if (roles.length === 0) {
    return <Text c="dimmed">No roles yet</Text>;
  }

  const confirmAndDelete = (id: string, name: string): void => {
    modals.openConfirmModal({
      title: "Delete role",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the role <b>{name}</b>? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          setDeletingId(id);
          const ok = await deleteRole(id);
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
    const fromIndex = roles.findIndex((r) => r.id === draggedId);
    const toIndex = roles.findIndex((r) => r.id === targetId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
    const updated = roles.slice();
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    void onReorder?.(updated);
  };

  return (
    <>
      {roles.map((role) => (
        <NavLink
          href="#"
          key={role.id}
          active={selectedRoleId === role.id}
          onClick={(event) => {
            event.preventDefault();
            onSelect(role.id);
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, role.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, role.id)}
          label={role.name}
          leftSection={
            <ActionIcon
              size="sm"
              p="none"
              variant="subtle"
              aria-label={`Drag ${role.name}`}
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
              aria-label={`Delete ${role.name}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmAndDelete(role.id, role.name);
              }}
              loading={deletingId === role.id}
            >
              <IconX size={14} />
            </ActionIcon>
          }
        />
      ))}
    </>
  );
}
