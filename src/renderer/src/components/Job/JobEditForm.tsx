import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { Button, Group, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { updateJob } from "../../client";
import { Job } from "../../../../domain";

export type JobEditFormProps = {
  phaseName: string;
  job: Job;
  onUpdated?: (job: Job) => void;
  onCancel?: () => void;
};

/**
 * JobEditForm
 *
 * Minimal form to edit a Job associated with a Phase.
 */
export function JobEditForm({
  phaseName,
  job,
  onUpdated,
  onCancel,
}: JobEditFormProps): ReactElement {
  const [name, setName] = useState(job.name);
  const [description, setDescription] = useState(job.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    const trimmedName = name.trim();
    const initialName = (job.name ?? "").trim();
    const normalizedDesc = description.trim() || ""; // treat empty as ""
    const initialDesc = (job.description ?? "").trim();
    return trimmedName !== initialName || normalizedDesc !== initialDesc;
  }, [name, description, job]);

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
      if (!hasChanges) {
        // No changes to save
        return;
      }
      try {
        setSubmitting(true);
        const updated = await updateJob({
          id: job.id,
          phaseId: job.phaseId,
          name: trimmed,
          description: description.trim() ? description : undefined,
          status: job.status,
          tasks: job.tasks,
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
    [name, description, submitting, onUpdated, job, hasChanges],
  );

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
            disabled={!name.trim() || !hasChanges}
          >
            Save Changes
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
