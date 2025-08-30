import { ReactElement, useCallback, useState } from "react";
import {
  Group,
  TextInput,
  Textarea,
  Button,
  Stack,
  Paper,
  Title,
  Text,
} from "@mantine/core";
import { createProject } from "../../client/project";
import { Project } from "../../../../domain";

export type ProjectCreateFormProps = {
  initialName?: string;
  onCreated?: (project: Project) => void;
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
          onCreated?.(created);
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
          {error && <Text c="red">{error}</Text>}
          <Group justify="flex-end">
            <Button
              variant="default"
              type="button"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={!name.trim()}>
              Save Project
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
