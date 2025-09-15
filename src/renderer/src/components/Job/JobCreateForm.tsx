import React, { ReactElement, useState } from "react";
import { Button, Group, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { createJob } from "../../client";
import { Job } from "../../../../domain";

export type JobCreateFormProps = {
  phaseId: string;
  phaseName: string;
  onCreated?: (job: Job) => void;
  onCancel?: () => void;
};

/**
 * JobCreateForm
 *
 * Minimal form to create a Job associated with a Phase.
 * Collects required name and optional description, creates the job with empty tasks.
 */
export function JobCreateForm({
  phaseId,
  phaseName,
  onCreated,
  onCancel,
}: JobCreateFormProps): ReactElement {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
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
      const created = await createJob({
        phaseId,
        name: trimmed,
        description: description.trim() || undefined,
        status: "PENDING",
        tasks: [] as string[],
      });
      if (created) {
        onCreated?.(created);
        setName("");
        setDescription("");
      } else {
        setError("Failed to create job.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
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
            Save Job
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
