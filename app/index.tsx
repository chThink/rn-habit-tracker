// app/index.tsx (HomeScreen simplificada)
import {
  addHabit,
  deleteHabit,
  editHabit,
  getHabits,
  toggleHabitCompletion
} from '@/storage/habitsStorage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { HabitAddButton } from '../components/habits/HabitAddButton';
import { HabitEditModal } from '../components/habits/HabitEditModal';
import { HabitHeader } from '../components/habits/HabitHeader';
import { HabitList } from '../components/habits/HabitList';
import { Loading } from '../components/shared/Loading';

type Habit = {
  id: string;
  title: string;
  completed: boolean;
};

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    try {
      const storedHabits = await getHabits();
      setHabits(storedHabits);
    } catch (error) {
      console.error('❌ Erro ao carregar hábitos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os hábitos');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddHabit(title: string) {
    const newHabit = await addHabit(title);
    if (newHabit) {
      await loadHabits();
    } else {
      Alert.alert('Erro', 'Não foi possível adicionar o hábito');
    }
  }

  async function handleToggleHabit(id: string) {
    const updated = await toggleHabitCompletion(id);
    if (updated) {
      setHabits(prev => 
        prev.map(habit => 
          habit.id === id 
            ? { ...habit, completed: !habit.completed }
            : habit
        )
      );
    }
  }

  async function handleDeleteHabit(id: string) {
    const deleted = await deleteHabit(id);
    if (deleted) {
      setHabits(prev => prev.filter(habit => habit.id !== id));
      Alert.alert('Sucesso', 'Hábito excluído!');
    } else {
      Alert.alert('Erro', 'Falha ao excluir hábito');
    }
  }

  function handleEditHabit(id: string) {
    const habitToEdit = habits.find(h => h.id === id);
    if (habitToEdit) {
      setEditingHabit(habitToEdit);
    }
  }

  async function handleSaveEdit(newTitle: string) {
    if (!editingHabit) return;
    
    const updated = await editHabit(editingHabit.id, newTitle);
    if (updated) {
      setHabits(prev => 
        prev.map(habit => 
          habit.id === editingHabit.id 
            ? { ...habit, title: newTitle }
            : habit
        )
      );
      setEditingHabit(null);
      Alert.alert('Sucesso', 'Hábito atualizado!');
    } else {
      Alert.alert('Erro', 'Falha ao editar hábito');
    }
  }

  function handleCloseEditModal() {
    setEditingHabit(null);
  }

  if (loading) {
    return <Loading message="Carregando hábitos..." />;
  }

  const completedHabits = habits.filter(h => h.completed).length;

  return (
    <View style={styles.container}>
      <HabitHeader 
        totalHabits={habits.length}
        completedHabits={completedHabits}
      />

      <HabitAddButton onAddHabit={handleAddHabit} />

      <HabitList
        habits={habits}
        onToggle={handleToggleHabit}
        onEdit={handleEditHabit}
        onDelete={handleDeleteHabit}
        onAddFirstHabit={() => {/* Abrir modal via ref */}}
      />

      {editingHabit && (
        <HabitEditModal
          habit={editingHabit}
          onSave={handleSaveEdit}
          onClose={handleCloseEditModal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});