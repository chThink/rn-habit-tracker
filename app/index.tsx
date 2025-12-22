import { HabitItem } from '@/components/HabitItem';
import { getHabits, saveHabits } from '@/storage/habitsStorage';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

type Habit = {
  id: string;
  title: string;
};

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    const stored = await getHabits();
    setHabits(stored);
  }

  async function addHabit() {
    const newHabit = {
      id: String(Date.now()),
      title: `Habit ${habits.length + 1}`,
    };

    const updated = [...habits, newHabit];
    setHabits(updated);
    await saveHabits(updated);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Habits</Text>

      <Button title="Add habit" onPress={addHabit} />

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitItem title={item.title} />}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
})