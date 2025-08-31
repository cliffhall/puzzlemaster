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
  Table,
  ActionIcon,
} from "@mantine/core";
import {
  getPlanByProject,
  getPlan,
  updatePlan,
  getPhases,
  getActionsByPhase,
  deletePhase,
  getJobs,
} from "../../client";
import { Plan, Phase, Action, Job } from "../../../../domain";
import { PhaseCreateForm } from "../Phase/PhaseCreateForm";
import { JobCreateForm, JobEditForm } from "../Job";
import { modals } from "@mantine/modals";
import { IconPencil, IconPlus, IconX } from "@tabler/icons-react";

export type PlanEditFormProps = {
  projectId?: string; // if provided, we load plan by projectId (first match)
  planId?: string; // alternatively, direct plan id
  initialPlan?: Plan | null; // Pass plan data directly to avoid re-fetch
  mode: "display" | "edit";
  onSaved?: (plan: Plan) => void;
  onDoneEditing?: () => void;
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
  onDoneEditing,
}: PlanEditFormProps): ReactElement {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // phases and actions state
  const [phases, setPhases] = useState<Phase[]>([]);
  const [actionsByPhase, setActionsByPhase] = useState<
    Record<string, Action[]>
  >({});
  const [jobsByPhase, setJobsByPhase] = useState<
    Record<string, Job | undefined>
  >({});
  const [loadingPhases, setLoadingPhases] = useState(false);
  const [deletingPhaseId, setDeletingPhaseId] = useState<string | null>(null);

  // Inline job editor state
  const [jobEditor, setJobEditor] = useState<
    | { mode: "create"; phase: Phase }
    | { mode: "edit"; phase: Phase; job: Job }
    | null
  >(null);

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

  const hasChanges = useMemo(() => {
    if (!plan) return false;
    return description.trim().length > 0 && plan.description !== description;
  }, [plan, description]);

  const handleCancel = (): void => {
    setDescription(plan?.description || "");
  };

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

  // Load phases for this plan and their actions
  useEffect(() => {
    let cancelled = false;
    const load = async (): Promise<void> => {
      if (!plan) {
        setPhases([]);
        setActionsByPhase({});
        setJobsByPhase({});
        return;
      }
      setLoadingPhases(true);
      try {
        const mine = (await getPhases(plan.id)) || [];
        if (cancelled) return;
        setPhases(mine);
        // load actions per phase
        const actionsEntries: [string, Action[]][] = [];
        for (const phase of mine) {
          const actions = (await getActionsByPhase(phase.id)) || [];
          if (cancelled) return;
          actionsEntries.push([phase.id, actions]);
        }
        setActionsByPhase(Object.fromEntries(actionsEntries));
        // load jobs and map by phase
        const allJobs = (await getJobs()) || [];
        if (cancelled) return;
        const jobsEntries: [string, Job | undefined][] = mine.map((p) => [
          p.id,
          allJobs.find((j) => j.phaseId === p.id),
        ]);
        setJobsByPhase(Object.fromEntries(jobsEntries));
      } finally {
        if (!cancelled) setLoadingPhases(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [plan]);

  const openCreateJobInline = (phase: Phase): void => {
    setJobEditor({ mode: "create", phase });
  };

  const openEditJobInline = (phase: Phase, job: Job): void => {
    setJobEditor({ mode: "edit", phase, job });
  };

  const renderPhasesTable = (): ReactElement | null => {
    if (!plan) return null;
    if (loadingPhases)
      return (
        <Group justify="center" p="sm">
          <Loader size="xs" />
        </Group>
      );
    if (!phases.length) return null;
    return (
      <Stack gap="xs">
        <Group justify="space-between">
          <Title order={5}>Phases</Title>
        </Group>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 300 }}>Name</Table.Th>
              <Table.Th style={{ width: 300 }}>Job</Table.Th>
              <Table.Th style={{ width: 200 }}>Team</Table.Th>
              <Table.Th>Actions</Table.Th>
              {!isDisplay && !jobEditor && <Table.Th style={{ width: 36 }} />}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {phases.map((phase) => {
              const actions = actionsByPhase[phase.id] || [];
              const job = jobsByPhase[phase.id];
              return (
                <Table.Tr key={phase.id}>
                  <Table.Td>{phase.name}</Table.Td>
                  <Table.Td>
                    {job ? (
                      <Group gap="xs" justify="space-between" wrap="nowrap">
                        <Text
                          size="sm"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
                          {job.name}
                        </Text>
                        {!isDisplay && !jobEditor && (
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            aria-label={`Edit job for ${phase.name}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openEditJobInline(phase, job);
                            }}
                            title="Edit Job"
                          >
                            <IconPencil size={14} />
                          </ActionIcon>
                        )}
                      </Group>
                    ) : (
                      !isDisplay &&
                      !jobEditor && (
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          aria-label={`Create job for ${phase.name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openCreateJobInline(phase);
                          }}
                          title="Create Job"
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      )
                    )}
                  </Table.Td>
                  <Table.Td />
                  <Table.Td>{actions.map((a) => a.name).join(", ")}</Table.Td>
                  {!isDisplay && !jobEditor && (
                    <Table.Td style={{ width: 36 }}>
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="red"
                        aria-label={`Delete ${phase.name}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          modals.openConfirmModal({
                            title: "Delete phase",
                            centered: true,
                            children: (
                              <Text size="sm">
                                Are you sure you want to delete the phase{" "}
                                <b>{phase.name}</b>? This action cannot be
                                undone.
                              </Text>
                            ),
                            labels: { confirm: "Delete", cancel: "Cancel" },
                            confirmProps: { color: "red" },
                            onConfirm: async () => {
                              try {
                                setDeletingPhaseId(phase.id);
                                const ok = await deletePhase(phase.id);
                                if (ok) {
                                  setPhases((prev) =>
                                    prev.filter((p) => p.id !== phase.id),
                                  );
                                  setActionsByPhase((prev) => {
                                    const { [phase.id]: _omit, ...rest } = prev;
                                    return rest;
                                  });
                                  setJobsByPhase((prev) => {
                                    const { [phase.id]: _omit, ...rest } = prev;
                                    return rest;
                                  });
                                }
                              } finally {
                                setDeletingPhaseId((curr) =>
                                  curr === phase.id ? null : curr,
                                );
                              }
                            },
                          });
                        }}
                        loading={deletingPhaseId === phase.id}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Table.Td>
                  )}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  };

  return (
    <Paper
      p="md"
      shadow={isDisplay || jobEditor ? "none" : "sm"}
      withBorder={!isDisplay && !jobEditor}
    >
      {loading ? (
        <Group justify="center" p="md">
          <Loader size="sm" />
        </Group>
      ) : !plan ? (
        <Text c="dimmed">No plan found for this project.</Text>
      ) : (
        <Stack gap="md">
          <Title order={4}>Plan</Title>
          <>
            {isDisplay || jobEditor ? (
              <Text>{plan.description}</Text>
            ) : (
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
            )}
            {renderPhasesTable()}
            {!isDisplay && jobEditor && (
              <Paper p="sm" withBorder>
                <Stack gap="sm">
                  <Title order={5}>Job</Title>
                  {jobEditor.mode === "create" ? (
                    <JobCreateForm
                      phaseId={jobEditor.phase.id}
                      phaseName={jobEditor.phase.name}
                      onCreated={(job) => {
                        setJobsByPhase((prev) => ({
                          ...prev,
                          [jobEditor.phase.id]: job,
                        }));
                        setJobEditor(null);
                      }}
                      onCancel={() => setJobEditor(null)}
                    />
                  ) : (
                    <JobEditForm
                      phaseName={jobEditor.phase.name}
                      job={jobEditor.job}
                      onUpdated={(updated) => {
                        setJobsByPhase((prev) => ({
                          ...prev,
                          [jobEditor.phase.id]: updated,
                        }));
                        setJobEditor(null);
                      }}
                      onCancel={() => setJobEditor(null)}
                    />
                  )}
                </Stack>
              </Paper>
            )}
            {!isDisplay && !jobEditor && (
              <Group justify="flex-end">
                <Button
                  variant="default"
                  onClick={hasChanges ? handleCancel : onDoneEditing}
                  disabled={submitting}
                >
                  {hasChanges ? "Cancel" : "Done Editing"}
                </Button>
                {hasChanges && (
                  <Button onClick={handleSave} loading={submitting}>
                    Save Changes
                  </Button>
                )}
                {plan && (
                  <PhaseCreateForm
                    planId={plan.id}
                    onCreated={(newPhase) => {
                      setPhases((prev) => [...prev, newPhase]);
                      setActionsByPhase((prev) => ({
                        ...prev,
                        [newPhase.id]: [],
                      }));
                    }}
                  />
                )}
              </Group>
            )}
          </>
        </Stack>
      )}
    </Paper>
  );
}
