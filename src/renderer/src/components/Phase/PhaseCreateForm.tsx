import React, { ReactElement, useState } from "react";
import { ActionIcon, CloseButton, Group, Input, Text } from "@mantine/core";
import { createPhase } from "../../client";
import { Phase } from "../../../../domain";
import { IconPlus } from "@tabler/icons-react";

export type CreatePhaseFormProps = {
  planId: string;
  onCreated?: (phase: Phase) => void;
  onCancel?: () => void;
};

/**
 * CreatePhaseForm
 *
 * Minimal form to create a Phase associated with a Plan.
 * Collects the required name and creates the phase (with no actions initially).
 */
export function PhaseCreateForm({
  planId,
  onCreated,
}: CreatePhaseFormProps): ReactElement {
  const [name, setName] = useState("");
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
      const created = await createPhase({
        planId,
        name: trimmed,
        actions: [],
      });
      if (created) {
        onCreated?.(created);
        setName("");
      } else {
        setError("Failed to create phase.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group wrap="nowrap" w="100%">
        {error && <Text c="red">{error}</Text>}
        <Input
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="New phase name"
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
          variant="filled"
          type="submit"
          loading={submitting}
          disabled={!name.trim() || submitting}
        >
          <IconPlus stroke={1.5} />
        </ActionIcon>
      </Group>
    </form>
  );
}
