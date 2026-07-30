import { NativeTabs } from "expo-router/unstable-native-tabs";
import { tabs } from "./tabs";

export function AppTabs() {
  return (
    <NativeTabs tintColor="#8B2942">
      {tabs.map(([name, label]) => (
        <NativeTabs.Trigger key={name} name={name}>
          <NativeTabs.Trigger.Label>{label}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
