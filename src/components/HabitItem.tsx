import { StyleSheet, Text, View } from 'react-native';

import { HabitItemProps } from '@/types/habitType';


export function HabitItem({title}: HabitItemProps){
    return (
        <View style={styles.container}>
             <Text style={styles.text}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});