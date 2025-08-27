import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Group,
  TextInput,
  Textarea,
  Button,
  Stack,
  Paper,
  Title,
  Loader,
} from "@mantine/core";
import { getProject, updateProject } from "../../client/project";

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
export function ProjectEditForm({
  projectId,
  onUpdated,
  onCancel,
}: ProjectEditFormProps): ReactElement {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialName, setInitialName] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
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
            setInitialName(proj.name);
            setInitialDescription(proj.description ?? "");
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
        const updated = await updateProject({
          id: projectId,
          name: trimmed,
          description: description || undefined,
        });
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

  const hasChanges =
    name.trim() !== initialName.trim() ||
    description.trim() !== initialDescription.trim();

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
              <Button
                variant="default"
                type="button"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
                disabled={!name.trim() || !hasChanges}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
