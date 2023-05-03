import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ProfileButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Georgia',
    textAlign: 'center',
    fontSize: 18,
  },
});
