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
  Text,
} from "@mantine/core";
import { getProject, updateProject } from "../../client/project";
import { getPlans } from "../../client/plan";
import { CreatePlanForm } from "../Plan/CreatePlanForm";

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
  const [hasPlan, setHasPlan] = useState<boolean>(false);
  const [showCreatePlanForm, setShowCreatePlanForm] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const proj = await getProject(projectId);
        if (abortController.signal.aborted) return;

        if (proj) {
          setName(proj.name);
          setDescription(proj.description ?? "");
          setInitialName(proj.name);
          setInitialDescription(proj.description ?? "");
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        if (abortController.signal.aborted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [projectId]);

  // Check if this project already has a plan
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const plans = await getPlans();
        if (cancelled) return;
        const has = (plans ?? []).some((p) => p.projectId === projectId);
        setHasPlan(has);
        if (has) setShowCreatePlanForm(false);
      } catch {
        // silently ignore plan load errors here; plan presence is optional in edit form
      }
    })();
    return () => {
      cancelled = true;
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
    <>
      <Paper p="md" my="md" withBorder>
        {loading ? (
          <Group justify="center" p="md">
            <Loader size="sm" />
          </Group>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Title order={3}>{!showCreatePlanForm && "Edit "}Project</Title>
              {showCreatePlanForm ? (
                <Stack gap="xs">
                  <Text>
                    <b>{name || "(Untitled)"}</b>
                  </Text>
                  <Text>{description || "(No description)"}</Text>
                </Stack>
              ) : (
                <>
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
                </>
              )}
              {error && <Text c="red">{error}</Text>}
              <Group justify="flex-end">
                {!showCreatePlanForm && (
                  <>
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
                    {!hasPlan && (
                      <Button
                        variant="light"
                        type="button"
                        onClick={() => setShowCreatePlanForm(true)}
                        disabled={showCreatePlanForm}
                      >
                        Add Plan
                      </Button>
                    )}
                  </>
                )}
              </Group>
            </Stack>
          </form>
        )}
      </Paper>
      {showCreatePlanForm && !hasPlan && (
        <CreatePlanForm
          projectId={projectId}
          onCancel={() => setShowCreatePlanForm(false)}
          onCreated={() => {
            setShowCreatePlanForm(false);
            setHasPlan(true);
            onUpdated?.(projectId);
          }}
        />
      )}
    </>
  );
}
