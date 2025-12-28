// components/habits/HabitList.tsx
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { EmptyState } from '../shared/EmptyState';
import { HabitItem } from './HabitItem';

interface Habit {
  id: string;
  title: string;
  completed: boolean;
}

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddFirstHabit?: () => void;
}

export function HabitList({ 
  habits, 
  onToggle, 
  onEdit, 
  onDelete,
  onAddFirstHabit 
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <EmptyState
        emoji="📝"
        title="Nenhum hábito cadastrado"
        subtitle="Toque no botão abaixo para adicionar"
        actionLabel="Adicionar Primeiro Hábito"
        onAction={onAddFirstHabit}
      />
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HabitItem
          habit={item}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});