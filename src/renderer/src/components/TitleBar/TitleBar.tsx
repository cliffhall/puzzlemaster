import { ReactElement } from "react";
import { AppShell, Group } from "@mantine/core";
import { useWindowState } from "../../hooks/useWindowState";
import { NavToggle } from "./NavToggle";
import { ThemeToggle } from "./ThemeToggle";
import classes from "./TitleBar.module.css";
import cx from "clsx";

export type TitleBarProps = {
  opened: boolean;
  toggle: () => void;
};

export function TitleBar({ opened, toggle }: TitleBarProps): ReactElement {
  const fullscreen = useWindowState();

  return (
    <AppShell.Header>
      <Group w="100%" gap="0" h="100%" wrap="nowrap">
        <Group pl={fullscreen ? "15px" : "80px"} h="100%" w="170px" gap="5px">
          <NavToggle toggle={toggle} opened={opened} />
          <ThemeToggle />
        </Group>
        <Group
          className={cx(classes["header-content"])}
          justify="flex-end"
          h="100%"
          w="100%"
        />
      </Group>
    </AppShell.Header>
  );
}
