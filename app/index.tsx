import { HabitItem } from '@/components/HabitItem';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const habits = [
  { id: '1', title: 'Drink water' },
  { id: '2', title: 'Read 10 pages' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Habits</Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitItem title={item.title} />}
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