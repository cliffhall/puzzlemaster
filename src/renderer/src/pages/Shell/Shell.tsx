import { ReactElement, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Group,
  Image,
  NavLink,
  ScrollArea,
  Text,
  Input,
  CloseButton,
  ActionIcon,
} from "@mantine/core";
import { ThemeToggle } from "../../components/ThemeToggle";
import { NavToggle } from "../../components/NavToggle";
import classes from "./Shell.module.css";
import cx from "clsx";
import { IconPlus } from "@tabler/icons-react";
import { useWindowState } from "../../hooks/useWindowState";

export function Shell(): ReactElement {
  const [opened, { toggle }] = useDisclosure(true);
  const [projectName, setProjectName] = useState("");
  const fullscreen = useWindowState();

  return (
    <AppShell
      header={{ height: 45 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { desktop: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group w="100%" gap="0" h="100%" wrap="nowrap">
          <Group pl={fullscreen ? 0 : "75px"} h="100%" w="170px" gap="10px">
            <ThemeToggle />
            <NavToggle toggle={toggle} opened={opened} />
          </Group>
          <Group
            className={cx(classes["header-content"])}
            justify="flex-end"
            h="100%"
            w="100%"
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <AppShell.Section h="100px">
          <Group w="100%">
            <Image src="images/icon.png" w="100px" h="100px" fit="contain" />
            <Text>
              <b>Projects</b>
            </Text>
          </Group>
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea} px="md">
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <NavLink
                href="#"
                key={index}
                onClick={(event) => event.preventDefault()}
                label={`Project #${index}`}
              />
            ))}
        </AppShell.Section>
        <AppShell.Section p="none">
          <Group wrap="nowrap" w="100%">
            <Input
              value={projectName}
              onChange={(event) => setProjectName(event.currentTarget.value)}
              placeholder="Project name"
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setProjectName("")}
                  style={{ display: projectName ? undefined : "none" }}
                />
              }
            />
            <ActionIcon variant="filled" aria-label="Settings">
              <IconPlus stroke={1.5} />
            </ActionIcon>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main />
    </AppShell>
  );
}
