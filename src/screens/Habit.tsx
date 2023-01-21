import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Params {
  date: string;
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string
  }[];
  completedHabits: string[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  const { params } = useRoute();
  const { date } = params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = habitsInfo?.possibleHabits?.length ?
    generateProgressPercentage(
      habitsInfo.possibleHabits.length,
      habitsInfo.completedHabits.length
    ) : 0;

  async function fetchHabits() {
    try {
      setLoading(true);

      const { data } = await api.get("/day", {
        params: {
          date,
        }
      });

      setHabitsInfo(data);
    }
    catch (error) {
      console.log(error);
      Alert.alert("Ops", "Não foi possível carregar as informações do hábitos");
    }
    finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habit_id: string) {
    await api.patch(`/habits/${habit_id}/toggle`);

    const habitAlreadyCompleted = habitsInfo?.completedHabits.includes(habit_id);

    let completedHabits: string[] = [];

    if (habitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter((habit) => habit !== habit_id);
    }
    else {
      completedHabits = [...habitsInfo!.completedHabits, habit_id];
    }

    setHabitsInfo({
      completedHabits,
      possibleHabits: habitsInfo!.possibleHabits,
    });
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
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

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className="mt-6">
          {
            habitsInfo?.possibleHabits.map((habit) => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                checked={habitsInfo.completedHabits.includes(habit.id)}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          }
        </View>
      </ScrollView>
    </View>
  );
}