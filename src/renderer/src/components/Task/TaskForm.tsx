import React, { ReactElement, useState } from "react";
import { Button, Group, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";

export type TaskFormProps = {
  mode: "create" | "edit";
  initialName?: string;
  initialDescription?: string;
  onSaved: (data: { name: string; description?: string }) => Promise<void>;
};

/**
 * TaskForm
 *
 * Modal-friendly form used for creating or editing a Task's name and description.
 */
export function TaskForm({
  mode,
  initialName = "",
  initialDescription = "",
  onSaved,
}: TaskFormProps): ReactElement {
  const [tName, setTName] = useState(initialName);
  const [tDesc, setTDesc] = useState(initialDescription);
  const [saving, setSaving] = useState(false);
  const [tError, setTError] = useState<string | null>(null);

  const submit = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();
    if (saving) return;
    const trimmed = tName.trim();
    if (!trimmed) {
      setTError("Name is required.");
      return;
    }
    try {
      setSaving(true);
      await onSaved({ name: trimmed, description: tDesc.trim() || undefined });
      modals.closeAll();
    } catch (err) {
      setTError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <Stack gap="sm">
        <TextInput
          label="Name"
          required
          value={tName}
          onChange={(e) => setTName(e.currentTarget.value)}
          placeholder="Task name"
        />
        <Textarea
          label="Description"
          description="Optional description of the task"
          value={tDesc}
          onChange={(e) => setTDesc(e.currentTarget.value)}
          placeholder="Describe the task (optional)"
          autosize
          minRows={3}
        />
        {tError && <Text c="red">{tError}</Text>}
        <Group justify="flex-end">
          <Button
            variant="default"
            type="button"
            onClick={() => modals.closeAll()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
