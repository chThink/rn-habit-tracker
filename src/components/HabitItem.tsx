import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HabitItemProps = {
  title: string;
  onDelete?: () => void;
};

export function HabitItem({ title, onDelete }: HabitItemProps) {
  const handleDelete = () => {
    console.log('Botão de deletar pressionado para:', title);
    if (onDelete) {
      onDelete();
    } else {
      console.log('onDelete não está definido!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="trash-2" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
});