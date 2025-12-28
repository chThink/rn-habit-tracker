// components/habits/HabitEditModal.tsx
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';

interface HabitEditModalProps {
  habit: {
    id: string;
    title: string;
  };
  onSave: (newTitle: string) => void;
  onClose: () => void;
}

export function HabitEditModal({ habit, onSave, onClose }: HabitEditModalProps) {
  const [habitName, setHabitName] = useState(habit.title);

  const handleSave = () => {
    if (habitName.trim()) {
      onSave(habitName);
    }
  };

  return (
    <Modal
      isVisible={true}
      onBackdropPress={onClose}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Editar Hábito</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do hábito"
          value={habitName}
          onChangeText={setHabitName}
          autoFocus
        />

        <View style={styles.modalButtons}>
          <Button
            title="Cancelar"
            onPress={onClose}
            color="#F44336"
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Salvar"
            onPress={handleSave}
            disabled={!habitName.trim()}
            color="#4CAF50"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonSpacer: {
    width: 10,
  },
});