import {
  addHabit,
  clearAllHabits,
  deleteHabit,
  getHabits
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
};

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    console.log('🚀 HomeScreen montado');
    loadHabits();
    //showDebugInfo();
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

/*   async function showDebugInfo() {
    await debugShowAllKeys();
    await debugShowHabits();
    
    // Atualizar info de debug
    const habitsCount = habits.length;
    setDebugInfo(`Hábitos no state: ${habitsCount}`);
  }
 */
  async function handleAddHabit() {
    if (!habitName.trim()) {
      Alert.alert('Atenção', 'Digite um nome para o hábito');
      return;
    }

    console.log('➕ Adicionando hábito:', habitName);
    
    const newHabit = await addHabit(habitName);
    
    if (newHabit) {
      console.log('✅ Hábito adicionado com sucesso:', newHabit);
      // Recarregar do storage para garantir sincronia
      await loadHabits();
      setIsModalVisible(false);
      setHabitName('');
      Alert.alert('Sucesso', 'Hábito adicionado!');
     // showDebugInfo();
    } else {
      console.error('❌ Falha ao adicionar hábito');
      Alert.alert('Erro', 'Não foi possível adicionar o hábito');
    }
  }

  async function handleDeleteHabit(id: string) {
    console.log('🔄 Iniciando exclusão do ID:', id);
    console.log('📊 Hábitos no state antes:', habits);
    
    const habitToDelete = habits.find(h => h.id === id);
    console.log('🎯 Hábito a ser excluído:', habitToDelete);
    
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
            console.log('✅ Usuário confirmou exclusão');
            await confirmDeleteHabit(id);
          }
        },
      ]
    );
  }

  async function confirmDeleteHabit(id: string) {
    console.log('🔴 Confirmando exclusão do ID:', id);
    
    try {
      console.log('1️⃣ Chamando deleteHabit...');
      const deleted = await deleteHabit(id);
      console.log('2️⃣ Resultado do deleteHabit:', deleted);
      
      if (deleted) {
        console.log('3️⃣ Atualizando state local...');
        // Atualizar state local
        const updatedHabits = habits.filter(h => h.id !== id);
        setHabits(updatedHabits);
        console.log('4️⃣ State atualizado:', updatedHabits);
        
        Alert.alert('Sucesso', 'Hábito excluído!');
      } else {
        Alert.alert('Erro', 'Falha ao excluir hábito');
      }
      
      // Mostrar debug info
      //await showDebugInfo();
      
    } catch (error) {
      console.error('❌ Erro na exclusão:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao excluir');
    }
  }

  async function handleClearAll() {
    console.log('🧹 Iniciando limpeza total...');
    
    Alert.alert(
      'Limpar Tudo',
      'Isso removerá TODOS os hábitos. Tem certeza?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => console.log('❌ Limpeza cancelada')
        },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            console.log('✅ Confirmada limpeza total');
            
            const cleared = await clearAllHabits();
            console.log('🧹 Resultado da limpeza:', cleared);
            
            if (cleared) {
              console.log('✅ Limpeza bem sucedida');
              setHabits([]);
              Alert.alert('Sucesso', 'Todos os hábitos foram removidos');
              // sshowDebugInfo();
            } else {
              Alert.alert('Erro', 'Não foi possível limpar os hábitos');
            }
          }
        }
      ]
    );
  }

/*   // Função de teste para adicionar hábitos de exemplo
  async function addTestHabits() {
    console.log('🧪 Adicionando hábitos de teste...');
    
    const testHabits = [
      'Beber água',
      'Exercitar',
      'Estudar React Native',
      'Ler um livro',
      'Meditar'
    ];
    
    for (const habit of testHabits) {
      await addHabit(habit);
    }
    
    await loadHabits();
    Alert.alert('Teste', '5 hábitos de teste adicionados');
  } */

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
        <Text style={styles.counter}>{habits.length} hábitos</Text>
      </View>

{/*       <View style={styles.debugContainer}>
        <Text style={styles.debugText}>{debugInfo}</Text>
        <View style={styles.debugButtons}>
          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: '#4CAF50' }]}
            onPress={showDebugInfo}
          >
            <Text style={styles.debugButtonText}>Debug</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: '#2196F3' }]}
            onPress={addTestHabits}
          >
            <Text style={styles.debugButtonText}>Teste</Text>
          </TouchableOpacity> 
           <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: '#FF9800' }]}
            onPress={handleClearAll}
          >
            <Text style={styles.debugButtonText}>Limpar</Text>
          </TouchableOpacity>


        </View>
      
      </View> */}

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
            <View style={styles.habitItemContainer}>
              <View style={styles.habitInfo}>
                <Text style={styles.habitTitle}>{item.title}</Text>
                <Text style={styles.habitId}>ID: {item.id}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteIcon}
                onPress={() => handleDeleteHabit(item.id)}
              >
                <Text style={styles.deleteIconText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        /> 
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
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
              onPress={() => setIsModalVisible(false)}
              color="#F44336"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Salvar"
              onPress={handleAddHabit}
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
  counter: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  debugContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  debugButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debugButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  debugButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  habitId: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  deleteIcon: {
    padding: 10,
    marginLeft: 10,
  },
  deleteIconText: {
    fontSize: 20,
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