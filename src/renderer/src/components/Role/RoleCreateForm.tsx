import React, { ReactElement, useState } from "react";
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
import { createRole } from "../../client";
import { Role } from "../../../../domain";

export type RoleCreateFormProps = {
  initialName?: string;
  onCreated?: (role: Role) => void;
  onCancel?: () => void;
};

/**
 * RoleCreateForm
 *
 * A full-screen form in AppShell.Main that collects all fields required by
 * CreateRoleDTO (name, description?) and calls the Role API.
 */
export function RoleCreateForm({
  initialName = "",
  onCreated,
  onCancel,
}: RoleCreateFormProps): ReactElement {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || submitting) return;
    setError(null);
    try {
      setSubmitting(true);
      const created = await createRole({
        name: trimmed,
description: description.trim() || undefined,
      });
      if (created) {
        onCreated?.(created);
      } else {
        setError("Failed to create role.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={3}>Create Role</Title>
          <TextInput
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="My new role"
          />
          <Textarea
            label="Description"
            description="Optional description of the role"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder="Describe your role (optional)"
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
              Save Role
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
