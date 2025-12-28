// components/habits/HabitItem.tsx
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface HabitItemProps {
  habit: {
    id: string;
    title: string;
    completed: boolean;
  };
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, onToggle, onEdit, onDelete }: HabitItemProps) {
  const handleDelete = () => {
    Alert.alert(
      'Excluir Hábito',
      `Tem certeza que deseja excluir "${habit.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete(habit.id)
        },
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        habit.completed && styles.containerCompleted
      ]}
      onPress={() => onToggle(habit.id)}
      activeOpacity={0.7}
    >
      {/* Radio Button */}
      <TouchableOpacity 
        style={[
          styles.radioButton,
          habit.completed && styles.radioButtonCompleted
        ]}
        onPress={() => onToggle(habit.id)}
      >
        {habit.completed && <View style={styles.radioButtonInner} />}
      </TouchableOpacity>

      {/* Informações do Hábito */}
      <View style={styles.info}>
        <Text 
          style={[
            styles.title,
            habit.completed && styles.titleCompleted
          ]}
        >
          {habit.title}
        </Text>
        <Text style={styles.id}>ID: {habit.id.slice(-6)}</Text>
      </View>

      {/* Ações (Editar/Excluir) */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[
            styles.editButton,
            habit.completed && styles.actionDisabled
          ]}
          onPress={() => !habit.completed && onEdit(habit.id)}
          disabled={habit.completed}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.deleteButton,
            habit.completed && styles.actionDisabled
          ]}
          onPress={() => !habit.completed && handleDelete()}
          disabled={habit.completed}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    opacity: 1,
  },
  containerCompleted: {
    opacity: 0.6,
    backgroundColor: '#f8f8f8',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonCompleted: {
    backgroundColor: '#4CAF50',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  titleCompleted: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  id: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 10,
    marginRight: 5,
  },
  deleteButton: {
    padding: 10,
  },
  editIcon: {
    fontSize: 20,
  },
  deleteIcon: {
    fontSize: 20,
  },
  actionDisabled: {
    opacity: 0.3,
  },
});