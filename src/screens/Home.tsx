import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import config from "../../config";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearBeginning = generateDatesFromYearBeginning();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFil = minimumSummaryDatesSizes - datesFromYearBeginning.length;

interface Summary {
  id: string;
  date: string;
  amount: number;
  completed: number;
}

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary[]>([]);

  const { navigate } = useNavigation();

  async function fetchData() {
    setLoading(true);
    try {
      const response = await api.get("/summary");

      setSummary(response.data);
    } catch (error: any) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de hábitos");
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <Loading />
  }

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
            datesFromYearBeginning.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              })

              return (
                <HabitDay
                  key={date.toISOString()}
                  onPress={() => navigate("habit", { date: date.toISOString() })}
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                />
              );
            })
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