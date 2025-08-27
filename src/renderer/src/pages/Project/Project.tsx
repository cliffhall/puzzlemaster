import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Group,
  Input,
  CloseButton,
  ActionIcon,
  TextInput,
  Textarea,
  Button,
  Stack,
  Paper,
  Title,
  Loader,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { createProject, getProject, updateProject } from "../../client/project";

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

export type ProjectCreateFormProps = {
  initialName?: string;
  onCreated?: (id: string) => void;
  onCancel?: () => void;
};

/**
 * ProjectCreateForm
 *
 * A full-screen form in AppShell.Main that collects all fields required by
 * CreateProjectDTO (name, description?) and calls the Project API.
 */
export function ProjectCreateForm({
  initialName = "",
  onCreated,
  onCancel,
}: ProjectCreateFormProps): ReactElement {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed || submitting) return;
      setError(null);
      try {
        setSubmitting(true);
        const created = await createProject({
          name: trimmed,
          description: description || undefined,
        });
        if (created) {
          onCreated?.(created.id);
        } else {
          setError("Failed to create project.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [name, description, submitting, onCreated],
  );

  return (
    <Paper p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={3}>Create Project</Title>
          <TextInput
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="My new project"
          />
          <Textarea
            label="Description"
            description="Optional description of the project"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder="Describe your project (optional)"
            autosize
            minRows={3}
          />
          {error && (
            <div style={{ color: "var(--mantine-color-red-6)" }}>{error}</div>
          )}
          <Group justify="flex-end">
            <Button variant="default" type="button" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={!name.trim()}>
              Create Project
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

export default AddProjectForm;

export type ProjectEditFormProps = {
  projectId: string;
  onUpdated?: (id: string) => void;
  onCancel?: () => void;
};

/**
 * ProjectEditForm
 *
 * Loads an existing project and allows editing name and description.
 * Calls updateProject on submit.
 */
export function ProjectEditForm({ projectId, onUpdated, onCancel }: ProjectEditFormProps): ReactElement {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const proj = await getProject(projectId);
        if (mounted) {
          if (proj) {
            setName(proj.name);
            setDescription(proj.description ?? "");
          } else {
            setError("Project not found.");
          }
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed || submitting) return;
      setError(null);
      try {
        setSubmitting(true);
        const updated = await updateProject({ id: projectId, name: trimmed, description: description || undefined });
        if (updated) {
          onUpdated?.(updated.id);
        } else {
          setError("Failed to update project.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [projectId, name, description, submitting, onUpdated],
  );

  return (
    <Paper p="md" withBorder>
      {loading ? (
        <Group justify="center" p="md">
          <Loader size="sm" />
        </Group>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Title order={3}>Edit Project</Title>
            <TextInput
              label="Name"
              required
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Project name"
            />
            <Textarea
              label="Description"
              description="Optional description of the project"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              placeholder="Update your project description (optional)"
              autosize
              minRows={3}
            />
            {error && (
              <div style={{ color: "var(--mantine-color-red-6)" }}>{error}</div>
            )}
            <Group justify="flex-end">
              <Button variant="default" type="button" onClick={onCancel} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting} disabled={!name.trim()}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
