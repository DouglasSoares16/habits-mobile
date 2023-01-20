import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];

export function NewHabit() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter((day) => day !== weekDayIndex));
    }
    else {
      setWeekDays(prevState => [...prevState, weekDayIndex]);
    };
  }

  async function createNewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0) {
        Alert.alert("Novo Hábito", "Informe o nome do hábito e a recorrência");
      }

      await api.post("/habits", {
        title,
        weekDays
      });

      setTitle("");
      setWeekDays([]);

      Alert.alert("Novo Hábito", "Hábito criado com sucesso!");
    }
    catch (error: any) {
      console.log(error);
      Alert.alert("Ops", "Não foi possível cadastrar o novo hábito");
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100
        }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento
        </Text>

        <TextInput
          placeholder="ex.: exercícios, dormir bem e etcs"
          placeholderTextColor={colors.zinc[400]}
          className="
            h-12 
            pl-3 
            rounded-lg 
            mt-3 
            bg-zinc-900 
            text-white 
            border-2 
            border-zinc-800
            focus:border-green-600
          "
          value={title}
          onChangeText={setTitle}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">Qual a recorrência?</Text>

        {
          availableWeekDays.map((day, i) => (
            <Checkbox
              key={`${day}-${i}`}
              title={day}
              checked={weekDays.includes(i)}
              onPress={() => handleToggleWeekDay(i)}
            />
          ))
        }

        <TouchableOpacity
          activeOpacity={0.7}
          className="
            w-full
            h-14
            flex-row
            items-center
            justify-center
            bg-green-600
            rounded-md
            mt-6
          "
          onPress={createNewHabit}
        >
          <Feather
            name="check"
            size={20}
            color={colors.white}
          />

          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}