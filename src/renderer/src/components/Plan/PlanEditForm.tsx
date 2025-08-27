import { ReactElement, useEffect, useMemo, useState } from "react";
import {
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { getPlans, getPlan, updatePlan } from "../../client/plan";
import { Plan } from "../../../../domain";

export type PlanEditFormProps = {
  projectId?: string; // if provided, we load plan by projectId (first match)
  planId?: string; // alternatively, direct plan id
  mode: "display" | "edit";
  onSaved?: (plan: Plan) => void;
  onCancelEdit?: () => void;
};

/**
 * PlanEditForm
 *
 * Reusable Plan form that supports display-only and editable modes.
 * - In display mode: no inputs, no buttons; title is "Plan".
 * - In edit mode: inputs for description (phases TBD), Save/Cancel buttons; title is "Edit Plan".
 */
export function PlanEditForm({
  projectId,
  planId,
  mode,
  onSaved,
  onCancelEdit,
}: PlanEditFormProps): ReactElement {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isDisplay = mode === "display";

  // load plan either by id or by projectId
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        let found: Plan | undefined;
        if (planId) {
          found = await getPlan(planId);
        } else if (projectId) {
          const plans = await getPlans();
          found = (plans ?? []).find((p) => p.projectId === projectId);
        }
        if (cancelled) return;
        if (found) {
          setPlan(found);
          setDescription(found.description ?? "");
        } else {
          setPlan(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId, planId]);

  const title = useMemo(() => (isDisplay ? "Plan" : "Edit Plan"), [isDisplay]);

  const canSave = useMemo(() => {
    if (!plan) return false;
    return description.trim().length > 0 && plan.description !== description;
  }, [plan, description]);

  const handleSave = async (): Promise<void> => {
    if (!plan || submitting) return;
    setSubmitting(true);
    try {
      const trimmed = description.trim();
      if (!trimmed) return;
      const updated = await updatePlan({
        id: plan.id,
        projectId: plan.projectId,
        description: trimmed,
        phases: plan.phases ?? [],
      });
      if (updated) {
        setPlan(updated);
        onSaved?.(updated);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper p="md" withBorder>
      {loading ? (
        <Group justify="center" p="md">
          <Loader size="sm" />
        </Group>
      ) : !plan ? (
        <Text c="dimmed">No plan found.</Text>
      ) : (
        <Stack gap="md">
          <Title order={4}>{title}</Title>
          {isDisplay ? (
            <Stack gap="xs">
              <Text>{plan.description || "(No description)"}</Text>
            </Stack>
          ) : (
            <>
              <Textarea
                label="Description"
                description="Detailed description of the plan"
                value={description}
                required
                onChange={(e) => setDescription(e.currentTarget.value)}
                placeholder="Describe your plan (optional)"
                autosize
                minRows={3}
              />
              <Group justify="flex-end">
                <Button
                  variant="default"
                  onClick={onCancelEdit}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={submitting}
                  disabled={!canSave}
                >
                  Save Changes
                </Button>
              </Group>
            </>
          )}
        </Stack>
      )}
    </Paper>
  );
}
