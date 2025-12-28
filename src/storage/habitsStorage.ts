import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_STORAGE_KEY = '@myhabits:habits';

export type Habit = {
  id: string;
  title: string;
  createdAt?: string;
  completed: boolean;
};

// =========== CRUD FUNCTIONS ===========

export async function getHabits(): Promise<Habit[]> {
  try {
    const data = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
    console.log('📥 GET_HABITS - Dados crus:', data);
    
    if (!data) {
      console.log('📭 Nenhum dado encontrado, retornando array vazia');
      return [];
    }
    
    const parsed = JSON.parse(data);
    console.log('📥 GET_HABITS - Parseado:', parsed);
    console.log('📥 GET_HABITS - É array?', Array.isArray(parsed));
    
    if (!Array.isArray(parsed)) {
      console.error('⚠️ Dados não são um array, retornando vazio');
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error('❌ ERRO em getHabits:', error);
    return [];
  }
}

export async function saveHabits(habits: Habit[]): Promise<boolean> {
  try {
    console.log('💾 SAVE_HABITS - Salvando:', habits);
    console.log('💾 SAVE_HABITS - Tipo:', typeof habits);
    console.log('💾 SAVE_HABITS - É array?', Array.isArray(habits));
    console.log('💾 SAVE_HABITS - Tamanho:', habits.length);
    
    const jsonString = JSON.stringify(habits);
    console.log('💾 SAVE_HABITS - JSON string:', jsonString);
    
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, jsonString);
    
    // Verificar se foi salvo
    const saved = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
    console.log('✅ SAVE_HABITS - Verificação pós-salvo:', saved ? 'SUCESSO' : 'FALHA');
    
    return true;
  } catch (error) {
    console.error('❌ ERRO em saveHabits:', error);
    return false;
  }
}

export async function addHabit(title: string): Promise<Habit | null> {
  try {
    console.log('➕ ADD_HABIT - Adicionando:', title);
    
    const habits = await getHabits();
    console.log('➕ ADD_HABIT - Hábitos atuais:', habits);
    
    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    
    console.log('➕ ADD_HABIT - Novo hábito:', newHabit);
    
    const updatedHabits = [...habits, newHabit];
    console.log('➕ ADD_HABIT - Nova array:', updatedHabits);
    
    const saved = await saveHabits(updatedHabits);
    
    if (saved) {
      console.log('✅ ADD_HABIT - Sucesso!');
      return newHabit;
    } else {
      console.error('❌ ADD_HABIT - Falha ao salvar');
      return null;
    }
  } catch (error) {
    console.error('❌ ERRO em addHabit:', error);
    return null;
  }
}

export async function deleteHabit(id: string): Promise<boolean> {
  try {
    console.log('🗑️ DELETE_HABIT - ID para excluir:', id);
    
    const habits = await getHabits();
    console.log('🗑️ DELETE_HABIT - Hábitos antes:', habits);
    
    // Debug: mostrar IDs para comparação
    console.log('🔍 DELETE_HABIT - IDs disponíveis:');
    habits.forEach((h, i) => {
      console.log(`  [${i}] ID: "${h.id}" (tipo: ${typeof h.id})`);
      console.log(`  [${i}] Comparando: "${h.id}" === "${id}" ? ${h.id === id}`);
    });
    
    const habitToDelete = habits.find(h => h.id === id);
    console.log('🗑️ DELETE_HABIT - Hábito encontrado:', habitToDelete);
    
    if (!habitToDelete) {
      console.error('⚠️ DELETE_HABIT - Hábito não encontrado!');
      console.log('⚠️ DELETE_HABIT - IDs disponíveis:', habits.map(h => h.id));
      return false;
    }
    
    const updatedHabits = habits.filter(h => h.id !== id);
    console.log('🗑️ DELETE_HABIT - Hábitos após filtro:', updatedHabits);
    console.log('🗑️ DELETE_HABIT - Tamanho antes:', habits.length, 'Tamanho depois:', updatedHabits.length);
    
    const saved = await saveHabits(updatedHabits);
    
    if (saved) {
      console.log('✅ DELETE_HABIT - Excluído com sucesso!');
      
      // Verificação final
      const finalCheck = await getHabits();
      console.log('✅ DELETE_HABIT - Verificação final:', finalCheck);
      
      return true;
    } else {
      console.error('❌ DELETE_HABIT - Falha ao salvar após exclusão');
      return false;
    }
  } catch (error) {
    console.error('❌ ERRO em deleteHabit:', error);
    return false;
  }
}

// No arquivo '@/storage/habitsStorage.ts'
export async function editHabit(id: string, newTitle: string): Promise<boolean> {
  try {
    console.log('✏️ Editando hábito ID:', id, 'Novo título:', newTitle);
    
    const storedHabits = await getHabits();
    console.log('📋 Hábitos antes da edição:', storedHabits);
    
    const habitIndex = storedHabits.findIndex(habit => habit.id === id);
    
    if (habitIndex === -1) {
      console.error('❌ Hábito não encontrado para edição');
      return false;
    }
    
    // Atualizar o hábito
    storedHabits[habitIndex] = {
      ...storedHabits[habitIndex],
      title: newTitle
    };
    
    // Salvar de volta
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(storedHabits));
    console.log('✅ Hábito editado com sucesso:', storedHabits[habitIndex]);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao editar hábito:', error);
    return false;
  }
}

export async function toggleHabitCompletion(id: string): Promise<boolean> {
  try {
    console.log('🔘 Alternando completude do hábito ID:', id);
    
    const storedHabits = await getHabits();
    const habitIndex = storedHabits.findIndex(habit => habit.id === id);
    
    if (habitIndex === -1) {
      console.error('❌ Hábito não encontrado');
      return false;
    }
    
    // Alternar o estado de completude
    storedHabits[habitIndex] = {
      ...storedHabits[habitIndex],
      completed: !storedHabits[habitIndex].completed
    };
    
    // Salvar de volta
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(storedHabits));
    console.log('✅ Estado do hábito alternado:', storedHabits[habitIndex]);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao alternar hábito:', error);
    return false;
  }
}