import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  ThemeIcon,
  Box,
  Paper,
  rgba,
} from "@mantine/core";
import {
  GitHubLogoIcon,
  RocketIcon,
  LightningBoltIcon,
  StarIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";
import classes from "./Landing.module.css";
import { ReactElement } from "react";

const Landing = (): ReactElement => {
  const features = [
    { icon: <LightningBoltIcon />, label: "Agentic Coordination" },
    { icon: <StarIcon />, label: "Production Ready" },
    { icon: <DashboardIcon />, label: "Modern Design" },
  ];

  return (
    <Box>
      <Container size="xl" py={120}>
        <Grid gutter={40} align="center">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="xl">
              <Group gap="xs">
                <ThemeIcon size="lg" radius="md" variant="transparent">
                  <RocketIcon
                    style={{ width: 20, height: 20 }}
                    color="var(--mantine-primary-color-filled)"
                  />
                </ThemeIcon>
                <Text
                  fw={500}
                  size="sm"
                  style={{ letterSpacing: 1 }}
                  tt="uppercase"
                >
                  Launch Your Project Today
                </Text>
              </Group>

              <Title className={classes?.title} order={1} size="h1">
                Coordination for Agentic Teams
              </Title>

              <Text size="xl" c="dimmed" maw={600}>
                Execute long-horizon projects in phases by teams of agents.
                Compose teams of specialized agents who have specific roles.
              </Text>

              <Group mt="xl">
                <Button size="lg" leftSection={<RocketIcon />}>
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="default"
                  leftSection={<GitHubLogoIcon />}
                >
                  View on GitHub
                </Button>
              </Group>

              <Group mt={30} gap="xl">
                {features.map((feature, index) => (
                  <Group key={index} gap="xs">
                    <ThemeIcon
                      size="md"
                      variant="light"
                      color="blue"
                      style={{
                        background: rgba(
                          "var(--mantine-primary-color-filled)",
                          0.07,
                        ),
                      }}
                    >
                      {feature.icon}
                    </ThemeIcon>
                    <Text size="sm" c="dimmed">
                      {feature.label}
                    </Text>
                  </Group>
                ))}
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              mih={320}
              radius="md"
              p="xl"
              bg="rgba(255, 255, 255, 0.1)"
              bd="1px solid rgba(255, 255, 255, 0.1)"
            />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;
