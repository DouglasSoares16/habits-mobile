import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

import LogoImg from "../assets/logo.svg";

export function Header() {
  return (
    <View className="w-full flex-row items-center justify-between">
      <LogoImg />

      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center h-11 px-4 border border-violet-500 rounded-lg"
      >
        <Feather
          name="plus"
          color={colors.violet[500]}
          size={20}
        />

        <Text className="text-white ml-3 font-semibold text-base">Novo</Text>
      </TouchableOpacity>

    </View>
  );
}