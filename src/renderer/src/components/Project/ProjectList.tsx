import { ReactElement } from "react";
import { NavLink, Text } from "@mantine/core";
import type { Project } from "../../../../domain";

export type ProjectListProps = {
  projects: Project[] | null;
  selectedProjectId: string | null;
  onSelect: (id: string) => void;
};

/**
 * ProjectList
 *
 * Renders loading/empty states and a list of projects as NavLinks.
 * Selection is indicated via the `active` prop and selection is sent via onSelect.
 */
export function ProjectList({
  projects,
  selectedProjectId,
  onSelect,
}: ProjectListProps): ReactElement {
  if (projects === null) {
    return <Text c="dimmed">Loading projects…</Text>;
  }
  if (projects.length === 0) {
    return <Text c="dimmed">No projects yet</Text>;
  }
  return (
    <>
      {projects.map((project) => (
        <NavLink
          href="#"
          key={project.id}
          active={selectedProjectId === project.id}
          onClick={(event) => {
            event.preventDefault();
            onSelect(project.id);
          }}
          label={project.name}
        />
      ))}
    </>
  );
}
