import React, { ReactElement, useCallback, useState } from "react";
import { ActionIcon, CloseButton, Group, Input, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { createTask } from "../../client";
import { Task } from "../../../../domain";
import { TaskForm } from "./TaskForm";

export type TaskCreateFormProps = {
  jobId: string;
  onCreated?: (task: Task) => void | Promise<void>;
};

/**
 * TaskCreateForm
 *
 * Minimal inline form (input + plus button) to create a Task for a given Job.
 * Opens a modal TaskForm to collect name/description and performs creation.
 */
export function TaskCreateForm({
  jobId,
  onCreated,
}: TaskCreateFormProps): ReactElement {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateTaskModal = useCallback(
    (prefill?: string) => {
      modals.open({
        title: "Add Task",
        centered: true,
        children: (
          <TaskForm
            mode="create"
            initialName={(prefill || "").trim()}
            onSaved={async ({ name, description }) => {
              const created = await createTask({
                jobId,
                name,
                description,
                status: "PENDING",
              });
              if (created) {
                setName("");
                await onCreated?.(created);
              } else {
                throw new Error("Failed to create task.");
              }
            }}
          />
        ),
      });
    },
    [jobId, onCreated],
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (submitting) return;
      setError(null);
      const trimmed = name.trim();
      if (!trimmed) {
        setError("Name is required.");
        return;
      }
      setSubmitting(true);
      try {
        openCreateTaskModal(trimmed);
      } finally {
        setSubmitting(false);
      }
    },
    [name, submitting, openCreateTaskModal],
  );

  return (
    <div>
      <Group wrap="nowrap" w="100%">
        {error && <Text c="red">{error}</Text>}
        <Input
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="New task name"
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setName("")}
              style={{ display: name ? undefined : "none" }}
            />
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              void handleSubmit();
            }
          }}
        />
        <ActionIcon
          variant="filled"
          type="button"
          loading={submitting}
          disabled={!name.trim() || submitting}
          onClick={() => void handleSubmit()}
        >
          <IconPlus stroke={1.5} />
        </ActionIcon>
      </Group>
    </div>
  );
}
