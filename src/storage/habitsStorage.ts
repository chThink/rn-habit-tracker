import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';

export async function getHabits() {
  const data = await AsyncStorage.getItem(HABITS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveHabits(habits: any[]) {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}
