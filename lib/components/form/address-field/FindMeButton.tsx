import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../../ui/text";
import { VStack } from "../../ui/vstack";

interface FindMeButtonProps {
  onPress: () => void;
  iconSize: number;
  fontSize: string;
  padding: number;
}

export const FindMeButton: React.FC<FindMeButtonProps> = ({
  onPress,
  iconSize,
  fontSize,
  padding,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute right-2 top-2 bottom-2 rounded-md overflow-hidden"
      style={{
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={["#5A5FC7", "#454EB0", "#3A3A8A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: padding,
        }}
      >
        <View className="flex-row items-center">
          <Ionicons
            name="locate"
            size={iconSize}
            color="white"
            style={{ marginRight: padding / 2 }}
          />
          <VStack>
            <Text
              className={`text-white font-black ${fontSize} tracking-wider`}
              style={{ fontFamily: "Inter-Black" }}
            >
              Find Me
            </Text>
          </VStack>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
