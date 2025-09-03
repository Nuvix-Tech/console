import { PlatformType } from "@nuvix/console";
import type { IconProps } from "@nuvix/ui/components";
import { Apple, Code, Code2, Smartphone } from "lucide-react";
import { FaApple, FaFlutter, FaUnity } from "react-icons/fa6";

export const platformIcon = (platform: PlatformType) => {
  const Icon = () => {
    switch (platform) {
      case PlatformType.Web:
        return Code2;
      case PlatformType.Android:
        return Smartphone;
      case PlatformType.Flutterandroid:
      case PlatformType.Flutterios:
      case PlatformType.Flutterweb:
      case PlatformType.Fluttermacos:
      case PlatformType.Flutterwindows:
      case PlatformType.Flutterlinux:
        return FaFlutter;
      case PlatformType.Appleios:
      case PlatformType.Applemacos:
      case PlatformType.Applewatchos:
      case PlatformType.Appletvos:
        return FaApple;
      case PlatformType.Reactnativeandroid:
      case PlatformType.Reactnativeios:
        return Smartphone;
      case PlatformType.Unity:
        return FaUnity;
      default:
        return Code;
    }
  };
  const IconComponent = Icon();
  return <IconComponent className="size-6" />;
};

export const availablePlatforms = ["web", "flutter", "android", "reactnative", "ios"];

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
