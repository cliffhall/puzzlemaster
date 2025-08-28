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
import { getPlanByProject, getPlan, updatePlan } from "../../client/plan";
import { Plan } from "../../../../domain";

export type PlanEditFormProps = {
  projectId?: string; // if provided, we load plan by projectId (first match)
  planId?: string; // alternatively, direct plan id
  initialPlan?: Plan | null; // Pass plan data directly to avoid re-fetch
  mode: "display" | "edit";
  onSaved?: (plan: Plan) => void;
  onCancelEdit?: () => void;
};

/**
 * PlanEditForm
 *
 * Reusable Plan form that supports display-only and editable modes.
 */
export function PlanEditForm({
  projectId,
  planId,
  initialPlan,
  mode,
  onSaved,
  onCancelEdit,
}: PlanEditFormProps): ReactElement {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isDisplay = mode === "display";

  // load plan either by id or by projectId, or accept it as a prop
  useEffect(() => {
    // If a plan is passed directly, use it and skip fetching.
    if (initialPlan) {
      setPlan(initialPlan);
      setDescription(initialPlan.description ?? "");
      setLoading(false);
      return;
    }

    let cancelled = false;
    // Only fetch if we don't have a plan passed via props
    if (!planId && !projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        let found: Plan | undefined;
        if (planId) {
          found = await getPlan(planId);
        } else if (projectId) {
          found = await getPlanByProject(projectId);
        }
        if (cancelled) return;
        if (found) {
          setPlan(found);
          setDescription(found.description);
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
  }, [projectId, planId, initialPlan]);

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
        <Text c="dimmed">No plan found for this project.</Text>
      ) : (
        <Stack gap="md">
          <Title order={4}>{title}</Title>
          {isDisplay ? (
            <Stack gap="xs">
              <Text>{plan.description}</Text>
            </Stack>
          ) : (
            <>
              <Textarea
                label="Description"
                description="Detailed description of the plan"
                value={description}
                required
                onChange={(e) => setDescription(e.currentTarget.value)}
                placeholder="Describe your plan"
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
