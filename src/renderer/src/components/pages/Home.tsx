import { setPreferences } from "../../api";

import { useState, ReactElement } from "react";
import {
  Card,
  Switch,
  Title,
  Combobox,
  InputBase,
  useCombobox,
  Input,
} from "@mantine/core";

function Home(): ReactElement {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const handleThemeChanged = async (event): Promise<void> => {
    const newValue = event.currentTarget.checked ? "dark" : "light";
    setTheme(newValue);
    await setPreferences({ theme: newValue, language });
  };

  const langComboBox = useCombobox({
    onDropdownClose: () => langComboBox.resetSelectedOption(),
  });

  const languages = ["en", "fr", "de"];

  const languageOptions = languages.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  const getLanguageComboBox = (): ReactElement => (
    <Combobox
      store={langComboBox}
      withinPortal={false}
      onOptionSubmit={async (val) => {
        setLanguage(val);
        await setPreferences({ theme, language: val });
        langComboBox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => langComboBox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {language || <Input.Placeholder>Pick language</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{languageOptions}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
  return (
    <Card>
      <Card.Section>
        <Title>Settings</Title>
      </Card.Section>
      {getLanguageComboBox()}
      <Switch
        defaultChecked
        onChange={handleThemeChanged}
        label="Theme"
        value={theme}
      />
    </Card>
  );
}

export default Home;
