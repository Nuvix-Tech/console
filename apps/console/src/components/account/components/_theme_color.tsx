import {
  CardBox,
  CardBoxBody,
  CardBoxDesc,
  CardBoxItem,
  CardBoxTitle,
} from "@/components/others/card";
import { usePreference } from "@nuvix/sui/hooks/usePreference";
import { RadioCard } from "@chakra-ui/react";
import { RadioCardLabel, RadioCardRoot } from "@nuvix/cui/radio-card";
import { Text } from "@nuvix/ui/components";
import { useTheme } from "next-themes";

export const ThemeColor = () => {
  const { setPref, getPref } = usePreference();
  const { resolvedTheme } = useTheme();
  const neutral = getPref()?.neutral;
  const variant = resolvedTheme === "dark" ? 200 : 900;

  const themes = [
    { name: "Default", value: "custom", description: "Your system's default color scheme." },
    { name: "Gray", value: "gray", description: "A classic, understated grayscale palette." },
    { name: "Slate", value: "slate", description: "A cool, sophisticated blue-gray theme." },
    { name: "Sand", value: "sand", description: "A warm, inviting earthy tone." },
  ];

  return (
    <CardBox>
      <CardBoxBody>
        <CardBoxItem gap={"4"}>
          <CardBoxTitle>Color Theme</CardBoxTitle>
          <CardBoxDesc>
            Choose a color theme for your application. This setting adjusts the overall look and
            feel to your preference.
          </CardBoxDesc>
        </CardBoxItem>
        <CardBoxItem>
          <RadioCardRoot
            value={neutral}
            onValueChange={({ value }) => setPref({ neutral: value ?? "custom" })}
          >
            <RadioCardLabel className="sr-only">Select a color theme</RadioCardLabel>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((t, i) => (
                <RadioCard.Item
                  value={t.value}
                  key={i}
                  data-neutral={t.value}
                  css={{
                    background: `var(--scheme-${t.value === "custom" ? "neutral" : t.value}-${variant}, var(--page-background))`,
                  }}
                  padding={"4"}
                  height={"36"}
                >
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl className="absolute top-2 right-2 z-10">
                    <RadioCard.ItemIndicator />
                  </RadioCard.ItemControl>
                  <Text variant="label-strong-s">{t.name}</Text>
                </RadioCard.Item>
              ))}
            </div>
          </RadioCardRoot>
        </CardBoxItem>
      </CardBoxBody>
    </CardBox>
  );
};
