import type { ReactNode } from "react";
import { Text, View } from "react-native";

interface CardProps {
  title: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <View className="rounded-card border border-border bg-white p-5">
      <Text className="text-lg font-semibold text-ink">{title}</Text>
      <View className="mt-2">{children}</View>
    </View>
  );
}
