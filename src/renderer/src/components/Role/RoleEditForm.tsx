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
import { getRole, updateRole } from "../../client";

export type RoleEditFormProps = {
  roleId: string;
  onUpdated?: (id: string) => void;
  onClose?: () => void;
};

/**
 * RoleEditForm
 *
 * Loads an existing role and allows editing name and description.
 * Calls updateRole on submit.
 */
export const RoleEditForm = memo(function RoleEditForm({
  roleId,
  onUpdated,
  onClose,
}: RoleEditFormProps): ReactElement {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialName, setInitialName] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const role = await getRole(roleId);
        if (abortController.signal.aborted) return;

        if (role) {
          setName(role.name);
          setDescription(role.description ?? "");
          setInitialName(role.name);
          setInitialDescription(role.description ?? "");
        } else {
          setError("Role not found.");
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
  }, [roleId]);

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
      if (!trimmed || submitting || !hasChanges) return;
      setError(null);
      try {
        setSubmitting(true);
        const updated = await updateRole({
          id: roleId,
          name: trimmed,
          description: description || undefined,
        });
        if (updated) {
          setInitialName(trimmed);
          setInitialDescription(description);
          onUpdated?.(roleId);
        } else {
          setError("Failed to update role.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [roleId, name, description, submitting, hasChanges, onUpdated],
  );

  if (loading) {
    return (
      <Paper p="md" withBorder>
        <Stack align="center" gap="md">
          <Loader />
          <Text>Loading role...</Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Title order={3}>Edit Role</Title>
          <TextInput
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Role name"
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
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
            {name.trim() && hasChanges && (
              <Group>
                <Button
                  variant="default"
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting || !hasChanges}
                >
                  Cancel Changes
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={!name.trim() || !hasChanges}
                >
                  Save Role
                </Button>
              </Group>
            )}
          </Group>
        </Stack>
      </form>
    </Paper>
  );
});
