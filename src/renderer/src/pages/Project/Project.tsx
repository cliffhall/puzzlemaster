import { ReactElement, useCallback, useState } from "react";
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
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { createProject } from "../../client/project";

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
