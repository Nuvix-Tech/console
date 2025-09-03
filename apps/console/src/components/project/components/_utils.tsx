import { PlatformType } from "@nuvix/console";
import type { IconProps } from "@nuvix/ui/components";

export const platformIcon = (platform: PlatformType): IconProps["name"] => {
  switch (platform) {
    case PlatformType.Web:
      return "code";
    case PlatformType.Android:
      return "android";
    case PlatformType.Flutterandroid:
    case PlatformType.Flutterios:
    case PlatformType.Flutterweb:
    case PlatformType.Fluttermacos:
    case PlatformType.Flutterwindows:
    case PlatformType.Flutterlinux:
      return "flutter";
    case PlatformType.Appleios:
    case PlatformType.Applemacos:
    case PlatformType.Applewatchos:
    case PlatformType.Appletvos:
      return "apple";
    case PlatformType.Reactnativeandroid:
    case PlatformType.Reactnativeios:
      return "reactNative";
    case PlatformType.Unity:
      return "unity";
    default:
      return "code";
  }
};

export const availablePlatforms = ["web", "android", "ios", "flutter", "reactnative"];

type PlatformConfig = {
  icon: IconProps["name"];
  label: string;
  type: "web" | "flutter" | "android" | "reactnative" | "ios";
};

export const platformConfig = {
  web: { icon: "code", label: "Web", type: "web" },
  flutter: {
    icon: "flutter",
    label: "Flutter",
    type: "flutter",
  },
  android: {
    icon: "android",
    label: "Android",
    type: "android",
  },
  reactnative: {
    icon: "reactNative",
    label: "React Native",
    type: "reactnative",
  },
  ios: { icon: "apple", label: "Apple", type: "ios" },
} as Record<string, PlatformConfig>;
