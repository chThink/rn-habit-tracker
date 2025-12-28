// components/habits/HabitHeader.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HabitHeaderProps {
  totalHabits: number;
  completedHabits: number;
}

export function HabitHeader({ totalHabits, completedHabits }: HabitHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Hábitos</Text>
      <View style={styles.counterContainer}>
        <Text style={styles.counter}>{totalHabits} hábitos</Text>
        <Text style={styles.completedCounter}>
          {completedHabits} completados
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  counterContainer: {
    alignItems: 'flex-end',
  },
  counter: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  completedCounter: {
    fontSize: 12,
    color: '#4CAF50',
  },
});