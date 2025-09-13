import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActionIcon,
  Button,
  Group,
  NavLink,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconX } from "@tabler/icons-react";
import { updateJob, getTasks, updateTask, deleteTask } from "../../client";
import { Job, Task } from "../../../../domain";
import { TaskForm, TaskCreateForm } from "../Task";

export type JobEditFormProps = {
  phaseName: string;
  job: Job;
  onUpdated?: (job: Job) => void;
  onCancel?: () => void;
};

/**
 * JobEditForm
 *
 * Edit a Job and manage its Tasks (add/edit/delete) via modal dialogs.
 */
export function JobEditForm({
  phaseName,
  job,
  onUpdated,
  onCancel,
}: JobEditFormProps): ReactElement {
  // Job fields
  const [name, setName] = useState(job.name);
  const [description, setDescription] = useState(job.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tasks state
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Derived
  const hasChanges = useMemo(() => {
    const trimmedName = name.trim();
    const initialName = job.name.trim();
    const normalizedDesc = description.trim() || "";
    const initialDesc = (job.description ?? "").trim();
    return trimmedName !== initialName || normalizedDesc !== initialDesc;
  }, [name, description, job]);

  // Load tasks for this job
  const refreshTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const all = (await getTasks()) || [];
      const mine = all.filter((t) => t.jobId === job.id);
      setTasks(mine);
    } finally {
      setLoadingTasks(false);
    }
  }, [job.id]);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  // Save job fields
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
      if (!hasChanges) return;
      try {
        setSubmitting(true);
        const updated = await updateJob({
          id: job.id,
          phaseId: job.phaseId,
          name: trimmed,
          description: description.trim() || undefined,
          status: job.status,
          tasks: job.tasks, // tasks list is managed independently via Task CRUD
        });
        if (updated) {
          onUpdated?.(updated);
        } else {
          setError("Failed to update job.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [name, description, onUpdated, job, hasChanges, submitting],
  );

  // Open the edit task modal
  const openEditTaskModal = (task: Task): void => {
    modals.open({
      title: "Edit Task",
      centered: true,
      children: (
        <TaskForm
          mode="edit"
          initialName={task.name}
          initialDescription={task.description || ""}
          onSaved={async ({ name, description }) => {
            const updated = await updateTask({
              id: task.id,
              jobId: task.jobId,
              agentId: task.agentId,
              validatorId: task.validatorId,
              name,
              description,
              status: task.status,
            });
            if (updated) {
              await refreshTasks();
            } else {
              throw new Error("Failed to update task.");
            }
          }}
        />
      ),
    });
  };

  // Open the confirm delete task modal
  const confirmAndDeleteTask = (task: Task): void => {
    modals.openConfirmModal({
      title: "Delete task",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the task <b>{task.name}</b>? This
          action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          setDeletingTaskId(task.id);
          const ok = await deleteTask(task.id);
          if (ok) {
            await refreshTasks();
          }
        } finally {
          setDeletingTaskId((curr) => (curr === task.id ? null : curr));
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <TextInput label="Phase" readOnly value={phaseName} variant="filled" />
        <TextInput
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Job name"
        />
        <Textarea
          label="Description"
          description="Optional description of the job"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          placeholder="Describe the job (optional)"
          autosize
          minRows={3}
        />

        {/* Tasks section */}
        <Stack gap="xs">
          <Title order={5}>Tasks</Title>

          {/* Tasks list */}
          {tasks === null || loadingTasks ? (
            <Text c="dimmed">Loading tasks…</Text>
          ) : tasks.length === 0 ? (
            <Text c="dimmed">No tasks yet</Text>
          ) : (
            <Stack
              gap={0}
              style={{
                border: "1px solid var(--mantine-color-gray-3)",
                borderRadius: 4,
              }}
            >
              {tasks.map((t) => (
                <NavLink
                  key={t.id}
                  href="#"
                  label={t.name}
                  onClick={(e) => {
                    e.preventDefault();
                    openEditTaskModal(t);
                  }}
                  rightSection={
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      aria-label={`Delete ${t.name}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        confirmAndDeleteTask(t);
                      }}
                      loading={deletingTaskId === t.id}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  }
                />
              ))}
            </Stack>
          )}
        </Stack>

        {error && <Text c="red">{error}</Text>}
        <Group justify="flex-end">
          <Button
            variant="default"
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            Done Editing
          </Button>
          {name.trim() && hasChanges && (
            <Button type="submit" loading={submitting}>
              Save Changes
            </Button>
          )}

          {/* Task Create Form */}
          <TaskCreateForm jobId={job.id} onCreated={() => refreshTasks()} />
        </Group>
      </Stack>
    </form>
  );
}
