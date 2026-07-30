import { Text } from "react-native";
import { Card } from "../../src/ui/Card";
import { Screen } from "../../src/ui/Screen";

export default function HomeScreen() {
  return (
    <Screen title="MyRishta" description="A respectful, family-aware path toward marriage.">
      <Card title="Closed beta foundation">
        <Text className="leading-6 text-muted">
          Your recommendations and profile progress will appear here.
        </Text>
      </Card>
    </Screen>
  );
}
