import { ReactElement, useCallback, useState } from "react";
import {
  Group,
  Textarea,
  Button,
  Stack,
  Paper,
  Title,
  Text,
} from "@mantine/core";
import { createPlan } from "../../client/plan";
import { Plan } from "../../../../domain";

export type CreatePlanFormProps = {
  projectId: string;
  onCreated?: (plan: Plan) => void;
  onCancel?: () => void;
};

/**
 * CreatePlanForm
 *
 * Minimal form to create a Plan associated with a Project.
 * Collects required description and creates the plan with an empty phases array.
 */
export function CreatePlanForm({
  projectId,
  onCreated,
  onCancel,
}: CreatePlanFormProps): ReactElement {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (submitting) return;
      setError(null);
      try {
        setSubmitting(true);
        const trimmed = description.trim();
        if (!trimmed) {
          setError("Description is required.");
          return;
        }
        const created = await createPlan({
          projectId,
          description: trimmed,
          phases: [],
        });
        if (created) {
          onCreated?.(created);
        } else {
          setError("Failed to create plan.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [projectId, description, onCreated],
  );

  return (
    <Paper p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={4}>Create Plan</Title>
          <Textarea
            label="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder="Describe your plan"
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
            <Button
              type="submit"
              loading={submitting}
              disabled={!description.trim()}
            >
              Create Plan
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
