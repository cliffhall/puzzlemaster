import React, {
  ReactElement,
  memo,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
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
import { getProject, updateProject, getPlanByProject} from "../../client";
import { PlanCreateForm, PlanEditForm } from "../Plan";
import { Plan } from "../../../../domain";

export type ProjectEditFormProps = {
  projectId: string;
  onUpdated?: (id: string) => void;
  onClose?: () => void;
};

/**
 * ProjectEditForm
 *
 * Loads an existing project and allows editing name and description.
 * Calls updateProject on submit.
 */
export const ProjectEditForm = memo(function ProjectEditForm({
  projectId,
  onUpdated,
  onClose,
}: ProjectEditFormProps): ReactElement {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialName, setInitialName] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [showCreatePlanForm, setShowCreatePlanForm] = useState<boolean>(false);
  const [editPlanMode, setEditPlanMode] = useState<boolean>(false);

  const hasPlan = !!plan;

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
          setEditPlanMode(false);
          setShowCreatePlanForm(false);
        } else {
          setError("Project not found.");
        }

        // Only check for a plan if the project was found
        if (proj) {
          try {
            const foundPlan = await getPlanByProject(projectId);
            if (abortController.signal.aborted) return;
            setPlan(foundPlan ?? null);
            if (foundPlan) setShowCreatePlanForm(false);
          } catch (err) {
            if (abortController.signal.aborted) return;
            // If plan is not found, API might throw. Assume no plan.
            setPlan(null);
            // Log plan load errors, but don't block UI
            console.error("Failed to check for existing plan:", err);
          }
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

  const hasChanges = useMemo(() => {
    return (
      name.trim() !== initialName.trim() ||
      description.trim() !== initialDescription.trim()
    );
  }, [name, initialName, description, initialDescription]);

  const handleCancel = (): void => {
    setName(initialName);
    setDescription(initialDescription);
  };

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

  return (
    <>
      <Paper
        p="md"
        my="md"
        shadow={editPlanMode || showCreatePlanForm ? "none" : "sm"}
        withBorder={!editPlanMode && !showCreatePlanForm}
      >
        {loading ? (
          <Group justify="center" p="md">
            <Loader size="sm" />
          </Group>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Title order={3}>
                {!showCreatePlanForm && !editPlanMode
                  ? "Project"
                  : name || "(Untitled)"}
              </Title>
              {showCreatePlanForm || editPlanMode ? (
                <Stack gap="xs">
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
                {!showCreatePlanForm && !editPlanMode && (
                  <>
                    <Button
                      variant="default"
                      type="button"
                      onClick={hasChanges ? handleCancel : onClose}
                      disabled={submitting}
                    >
                      {hasChanges ? "Cancel" : "Close"}
                    </Button>
                    {hasChanges && (
                      <Button type="submit" loading={submitting}>
                        Save Changes
                      </Button>
                    )}
                  </>
                )}
                {!hasPlan && !showCreatePlanForm && (
                  <Button
                    variant="light"
                    type="button"
                    onClick={() => {
                      setEditPlanMode(false);
                      setShowCreatePlanForm(true);
                    }}
                    disabled={showCreatePlanForm}
                  >
                    Create Plan
                  </Button>
                )}
                {hasPlan && !editPlanMode && (
                  <Button
                    variant="light"
                    type="button"
                    onClick={() => {
                      setShowCreatePlanForm(false);
                      setEditPlanMode(true);
                    }}
                    disabled={editPlanMode}
                  >
                    Edit Plan
                  </Button>
                )}
              </Group>
            </Stack>
          </form>
        )}
        {hasPlan && (
          <Stack gap="md" my="md">
            <PlanEditForm
              initialPlan={plan}
              mode={editPlanMode ? "edit" : "display"}
              onSaved={(savedPlan) => {
                setPlan(savedPlan);
              }}
              onDoneEditing={() => setEditPlanMode(false)}
            />
          </Stack>
        )}
        {showCreatePlanForm && !hasPlan && (
          <Stack gap="md" my="md">
            <PlanCreateForm
              projectId={projectId}
              onCancel={() => setShowCreatePlanForm(false)}
              onCreated={(newPlan) => {
                setPlan(newPlan);
                setShowCreatePlanForm(false);
                onUpdated?.(projectId);
              }}
            />
          </Stack>
        )}
      </Paper>
    </>
  );
});
