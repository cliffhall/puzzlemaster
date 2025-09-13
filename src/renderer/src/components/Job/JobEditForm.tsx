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
  CloseButton,
  Group,
  Input,
  NavLink,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus, IconX } from "@tabler/icons-react";
import { updateJob, createTask, getTasks, updateTask, deleteTask } from "../../client";
import { Job, Task } from "../../../../domain";

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
  const [newTaskName, setNewTaskName] = useState("");

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

  // Task modal form (inline component)
  function TaskForm({
    mode,
    initialName = "",
    initialDescription = "",
    onSaved,
  }: {
    mode: "create" | "edit";
    initialName?: string;
    initialDescription?: string;
    onSaved: (data: { name: string; description?: string }) => Promise<void>;
  }): ReactElement {
    const [tName, setTName] = useState(initialName);
    const [tDesc, setTDesc] = useState(initialDescription);
    const [saving, setSaving] = useState(false);
    const [tError, setTError] = useState<string | null>(null);

    const submit = async (e?: React.FormEvent): Promise<void> => {
      if (e) e.preventDefault();
      if (saving) return;
      const trimmed = tName.trim();
      if (!trimmed) {
        setTError("Name is required.");
        return;
      }
      try {
        setSaving(true);
        await onSaved({ name: trimmed, description: tDesc.trim() || undefined });
        modals.closeAll();
      } catch (err) {
        setTError(err instanceof Error ? err.message : String(err));
      } finally {
        setSaving(false);
      }
    };

    return (
      <form onSubmit={submit}>
        <Stack gap="sm">
          <TextInput
            label="Name"
            required
            value={tName}
            onChange={(e) => setTName(e.currentTarget.value)}
            placeholder="Task name"
          />
          <Textarea
            label="Description"
            description="Optional description of the task"
            value={tDesc}
            onChange={(e) => setTDesc(e.currentTarget.value)}
            placeholder="Describe the task (optional)"
            autosize
            minRows={3}
          />
          {tError && <Text c="red">{tError}</Text>}
          <Group justify="flex-end">
            <Button variant="default" type="button" onClick={() => modals.closeAll()}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {mode === "create" ? "Create Task" : "Save Changes"}
            </Button>
          </Group>
        </Stack>
      </form>
    );
  }

  // Open modals
  const openCreateTaskModal = (prefill?: string): void => {
    modals.open({
      title: "Add Task",
      centered: true,
      children: (
        <TaskForm
          mode="create"
          initialName={(prefill || "").trim()}
          onSaved={async ({ name, description }) => {
            const created = await createTask({ jobId: job.id, name, description, status: "PENDING" });
            if (created) {
              setNewTaskName("");
              await refreshTasks();
            } else {
              throw new Error("Failed to create task.");
            }
          }}
        />
      ),
    });
  };

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

  const confirmAndDeleteTask = (task: Task): void => {
    modals.openConfirmModal({
      title: "Delete task",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the task <b>{task.name}</b>? This action
          cannot be undone.
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
            <Stack gap={0}
              style={{ border: "1px solid var(--mantine-color-gray-3)", borderRadius: 4 }}>
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
          <Group wrap="nowrap">
            <Input
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.currentTarget.value)}
              placeholder="New task name"
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setNewTaskName("")}
                  style={{ display: newTaskName ? undefined : "none" }}
                />
              }
            />
            <ActionIcon
              variant="filled"
              type="button"
              onClick={() => openCreateTaskModal(newTaskName)}
              disabled={!newTaskName.trim()}
            >
              <IconPlus stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </form>
  );
}
