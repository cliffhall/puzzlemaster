import { ReactElement, useCallback, useState } from "react";
import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { createPhase } from "../../client/phase";
import { Phase } from "../../../../domain";

export type CreatePhaseFormProps = {
  planId: string;
  onCreated?: (phase: Phase) => void;
  onCancel?: () => void;
};

/**
 * CreatePhaseForm
 *
 * Minimal form to create a Phase associated with a Plan.
 * Collects required name and creates the phase (with no actions initially).
 */
export function CreatePhaseForm({
  planId,
  onCreated,
  onCancel,
}: CreatePhaseFormProps): ReactElement {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      try {
        setSubmitting(true);
        const created = await createPhase({
          planId,
          name: trimmed,
          actions: [],
        });
        if (created) {
          onCreated?.(created);
        } else {
          setError("Failed to create phase.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [name, planId, submitting, onCreated],
  );

  return (
    <Paper p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={5}>Create Phase</Title>
          <TextInput
            label="Name"
            placeholder="Name this phase"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
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
              Create Phase
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
