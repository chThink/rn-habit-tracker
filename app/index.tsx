import {
  addHabit,
  deleteHabit,
  editHabit,
  getHabits,
  toggleHabitCompletion // Adicione esta função no storage
} from '@/storage/habitsStorage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';

type Habit = {
  id: string;
  title: string;
  completed: boolean; // Adicionado campo para controle de completude
};

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  useEffect(() => {
    console.log('🚀 HomeScreen montado');
    loadHabits();
  }, []);

  async function loadHabits() {
    console.log('🔄 Carregando hábitos...');
    setLoading(true);
    try {   
      const storedHabits = await getHabits();
      console.log('📋 Hábitos carregados no state:', storedHabits);
      setHabits(storedHabits);
    } catch (error) {
      console.error('❌ Erro ao carregar hábitos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os hábitos');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddHabit() {
    console.log('➕ Adicionando hábito:', habitName);
    
    const newHabit = await addHabit(habitName);
    
    if (newHabit) {
      console.log('✅ Hábito adicionado com sucesso:', newHabit);
      await loadHabits();
      setIsModalVisible(false);
      setHabitName('');
    } else {
      console.error('❌ Falha ao adicionar hábito');
      Alert.alert('Erro', 'Não foi possível adicionar o hábito');
    }
  }

  async function handleToggleHabit(id: string) {
    console.log('🔘 Alternando hábito ID:', id);
    
    const habitToToggle = habits.find(h => h.id === id);
    if (!habitToToggle) return;
    
    try {
      const updated = await toggleHabitCompletion(id);
      
      if (updated) {
        // Atualizar state local
        const updatedHabits = habits.map(habit => 
          habit.id === id 
            ? { ...habit, completed: !habit.completed }
            : habit
        );
        setHabits(updatedHabits);
      }
    } catch (error) {
      console.error('❌ Erro ao alternar hábito:', error);
    }
  }

  async function handleDeleteHabit(id: string) {
    console.log('🔄 Iniciando exclusão do ID:', id);
    
    const habitToDelete = habits.find(h => h.id === id);
    
    if (!habitToDelete) {
      Alert.alert('Erro', 'Hábito não encontrado para exclusão');
      return;
    }

    Alert.alert(
      'Excluir Hábito',
      `Tem certeza que deseja excluir "${habitToDelete.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => console.log('❌ Exclusão cancelada')
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await confirmDeleteHabit(id);
          }
        },
      ]
    );
  }

  async function confirmDeleteHabit(id: string) {
    console.log('🔴 Confirmando exclusão do ID:', id);
    
    try {
      const deleted = await deleteHabit(id);
      
      if (deleted) {
        const updatedHabits = habits.filter(h => h.id !== id);
        setHabits(updatedHabits);
        Alert.alert('Sucesso', 'Hábito excluído!');
      } else {
        Alert.alert('Erro', 'Falha ao excluir hábito');
      }
    } catch (error) {
      console.error('❌ Erro na exclusão:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao excluir');
    }
  }

  function handleEditHabit(id: string) {
    console.log('✏️ Iniciando edição do hábito ID:', id);
    
    const habitToEdit = habits.find(h => h.id === id);
    if (habitToEdit) {
      console.log('📝 Hábito encontrado para edição:', habitToEdit);
      setEditingHabitId(id);
      setHabitName(habitToEdit.title);
      setIsModalEditVisible(true);
    } else {
      console.error('❌ Hábito não encontrado para edição');
      Alert.alert('Erro', 'Hábito não encontrado para edição');
    }
  }

  async function handleSaveEdit() {
    if (!editingHabitId || !habitName.trim()) {
      Alert.alert('Erro', 'Preencha o nome do hábito');
      return;
    }

    console.log('💾 Salvando edição do hábito ID:', editingHabitId);
    console.log('📝 Novo nome:', habitName);

    try {
      const updated = await editHabit(editingHabitId, habitName);
      
      if (updated) {
        console.log('✅ Hábito editado com sucesso');
        
        const updatedHabits = habits.map(habit => 
          habit.id === editingHabitId 
            ? { ...habit, title: habitName }
            : habit
        );
        setHabits(updatedHabits);
        
        setEditingHabitId(null);
        setHabitName('');
        setIsModalEditVisible(false);
        
        Alert.alert('Sucesso', 'Hábito atualizado!');
      } else {
        Alert.alert('Erro', 'Falha ao editar hábito');
      }
    } catch (error) {
      console.error('❌ Erro ao editar hábito:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao editar o hábito');
    }
  }

  function closeEditModal() {
    setEditingHabitId(null);
    setHabitName('');
    setIsModalEditVisible(false);
  }

  function closeAddModal() {
    setHabitName('');
    setIsModalVisible(false);
  }

  // Função para formatar data (opcional, para mostrar quando foi completado)
  function formatDate(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando hábitos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Hábitos</Text>
        <View style={styles.counterContainer}>
          <Text style={styles.counter}>{habits.length} hábitos</Text>
          <Text style={styles.completedCounter}>
            {habits.filter(h => h.completed).length} completados
          </Text>
        </View>
      </View>

      <Button 
        title="+ Adicionar Hábito" 
        onPress={() => setIsModalVisible(true)}
        color="#4CAF50"
      />

      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyText}>Nenhum hábito cadastrado</Text>
          <Text style={styles.emptySubText}>
            Toque no botão abaixo para adicionar
          </Text>
          <Button 
            title="Adicionar Primeiro Hábito" 
            onPress={() => setIsModalVisible(true)}
            color="#2196F3"
          />
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.habitItemContainer,
                item.completed && styles.habitItemCompleted
              ]}
              onPress={() => handleToggleHabit(item.id)}
              activeOpacity={0.7}
            >
              {/* Radio Button */}
              <TouchableOpacity 
                style={[
                  styles.radioButton,
                  item.completed && styles.radioButtonCompleted
                ]}
                onPress={() => handleToggleHabit(item.id)}
              >
                {item.completed && <View style={styles.radioButtonInner} />}
              </TouchableOpacity>

              {/* Informações do Hábito */}
              <View style={styles.habitInfo}>
                <Text 
                  style={[
                    styles.habitTitle,
                    item.completed && styles.habitTitleCompleted
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.habitId}>ID: {item.id}</Text>
              </View>

              {/* Ações (Editar/Excluir) */}
              <View style={styles.habitActions}>
                <TouchableOpacity 
                  style={[
                    styles.editIcon,
                    item.completed && styles.actionIconDisabled
                  ]}
                  onPress={() => !item.completed && handleEditHabit(item.id)}
                  disabled={item.completed}
                >
                  <Text style={styles.editIconText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.deleteIcon,
                    item.completed && styles.actionIconDisabled
                  ]}
                  onPress={() => !item.completed && handleDeleteHabit(item.id)}
                  disabled={item.completed}
                >
                  <Text style={styles.deleteIconText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        /> 
      )}

      {/* Modal para Adicionar */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeAddModal}
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
              onPress={closeAddModal}
              color="#F44336"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Adicionar"
              onPress={handleAddHabit}
              disabled={!habitName.trim()}
              color="#4CAF50"
            />
          </View>
        </View>
      </Modal>

      {/* Modal para Editar */}
      <Modal
        isVisible={isModalEditVisible}
        onBackdropPress={closeEditModal}
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
              onPress={closeEditModal}
              color="#F44336"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Salvar"
              onPress={handleSaveEdit}
              disabled={!habitName.trim()}
              color="#4CAF50"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  list: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  habitItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    opacity: 1, // Valor padrão
  },
  habitItemCompleted: {
    opacity: 0.6, // Item fica opaco quando completado
    backgroundColor: '#f8f8f8',
  },
  // Estilos do Radio Button
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
    borderColor: '#4CAF50',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  habitInfo: {
    flex: 1,
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  habitTitleCompleted: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  habitId: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  editIcon: {
    padding: 10,
    marginRight: 5,
  },
  editIconText: {
    fontSize: 20,
  },
  deleteIcon: {
    padding: 10,
  },
  deleteIconText: {
    fontSize: 20,
  },
  actionIconDisabled: {
    opacity: 0.3,
  },
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