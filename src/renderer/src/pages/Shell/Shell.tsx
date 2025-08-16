import { ReactElement } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Text, Title } from "@mantine/core";
import { ThemeToggle } from "../../components/ThemeToggle";

export function Shell(): ReactElement {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: false, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" bg="blue" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title>Puzzlemaster</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
      <AppShell.Main>
        <Text>This is the main section, your app content here.</Text>
        <Text>
          AppShell example with all elements: Navbar, Header, Aside, Footer.
        </Text>
        <Text>All elements except AppShell.Main have fixed position.</Text>
        <Text>
          Aside is hidden on on md breakpoint and cannot be opened when it is
          collapsed
        </Text>
      </AppShell.Main>
      <AppShell.Aside p="md">Aside</AppShell.Aside>
      <AppShell.Footer p="md">
        <Group h="100%" px="md" justify="space-between">
          <Text>Copyright (c) 2025 Futurescale, Inc.</Text>
          <ThemeToggle />
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
