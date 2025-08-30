import React, { ReactElement, useCallback, useState } from "react";
import { Group, Input, CloseButton, ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export type AddProjectFormProps = {
  onAdd?: (name: string) => void | Promise<void>;
  placeholder?: string;
};

/**
 * AddProjectForm
 *
 * A small inline form used to add a new Project by name.
 * - Uses Mantine Input and an ActionIcon with a plus icon
 * - Submits on button click or Enter key
 * - Clears input after successful submission
 */
export function AddProjectForm({
  onAdd,
  placeholder = "Project name",
}: AddProjectFormProps): ReactElement {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed || submitting) return;
      try {
        setSubmitting(true);
        await onAdd?.(trimmed);
        setName("");
      } finally {
        setSubmitting(false);
      }
    },
    [name, onAdd, submitting],
  );

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Group wrap="nowrap" w="100%">
        <Input
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          placeholder={placeholder}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setName("")}
              style={{ display: name ? undefined : "none" }}
            />
          }
        />
        <ActionIcon
          type="submit"
          variant="filled"
          aria-label="Add Project"
          disabled={!name.trim() || submitting}
        >
          <IconPlus stroke={1.5} />
        </ActionIcon>
      </Group>
    </form>
  );
}
