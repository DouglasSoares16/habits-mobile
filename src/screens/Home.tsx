import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView } from "react-native";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearBeginning = generateDatesFromYearBeginning();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFil = minimumSummaryDatesSizes - datesFromYearBeginning.length;

export function Home() {
  const { navigate } = useNavigation();

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {
          weekDays.map((day, i) => (
            <Text
              key={`${day}-${i}`}
              className="text-zinc-400 text-xl font-bold text-center after:mx-1"
              style={{ width: DAY_SIZE }}
            >{day}</Text>
          ))
        }
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row flex-wrap">
          {
            datesFromYearBeginning.map((date) => (
              <HabitDay
                key={date.toISOString()}
                onPress={() => navigate("habit", { date: date.toISOString() })}
              />
            ))
          }

          {
            amountOfDaysToFil > 0 && Array
              .from({ length: amountOfDaysToFil })
              .map((_, i) => (
                <View
                  key={i}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{
                    width: DAY_SIZE,
                    height: DAY_SIZE
                  }}
                />
              ))
          }
        </View>
      </ScrollView>
    </View>
  );
}