// components/habits/HabitAddButton.tsx
import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';

interface HabitAddButtonProps {
  onAddHabit: (title: string) => void;
}

export function HabitAddButton({ onAddHabit }: HabitAddButtonProps) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [habitName, setHabitName] = React.useState('');

  const handleAdd = () => {
    if (habitName.trim()) {
      onAddHabit(habitName);
      setHabitName('');
      setIsModalVisible(false);
    }
  };

  const closeModal = () => {
    setHabitName('');
    setIsModalVisible(false);
  };

  return (
    <>
      <Button 
        title="+ Adicionar Hábito" 
        onPress={() => setIsModalVisible(true)}
        color="#4CAF50"
      />

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Novo Hábito</Text>
          
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
              onPress={closeModal}
              color="#F44336"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Adicionar"
              onPress={handleAdd}
              disabled={!habitName.trim()}
              color="#4CAF50"
            />
          </View>
        </View>
      </Modal>
    </>
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