import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function Screen({ title, description, children }: ScreenProps) {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-canvas">
      <View className="flex-1 px-6 py-8">
        <Text className="text-3xl font-semibold text-ink">{title}</Text>
        <Text className="mt-2 text-base leading-6 text-muted">{description}</Text>
        {children ? <View className="mt-6">{children}</View> : null}
      </View>
    </SafeAreaView>
  );
}
