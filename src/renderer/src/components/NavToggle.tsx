import cx from "clsx";
import { ReactElement } from "react";
import { ActionIcon } from "@mantine/core";
import {
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react";
import classes from "./NavToggle.module.css";

interface NavToggleProps {
  toggle: () => void;
  opened: boolean;
}
export function NavToggle(props: NavToggleProps): ReactElement {
  const { toggle, opened } = props;

  return (
    <ActionIcon
      className="nav-toggle"
      onClick={() => toggle()}
      variant="default"
      size="md"
      aria-label="Toggle sidebar"
    >
      {opened ? (
        <IconLayoutSidebarLeftCollapse
          className={cx(classes.icon)}
          stroke={1.5}
        />
      ) : (
        <IconLayoutSidebarLeftExpand
          className={cx(classes.icon)}
          stroke={1.5}
        />
      )}
    </ActionIcon>
  );
}
