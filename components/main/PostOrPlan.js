import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image, StyleSheet } from 'react-native'
import CreateButton from './CreateButton'

export default function PostOrPlan({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.padding}></Text>
      <Text style={styles.padding}></Text>
      <CreateButton title="Create a Post" onPress={() => navigation.navigate('Create')}/>
      <Text style={styles.padding}></Text>
      <CreateButton title="Create a Plan" onPress={() => navigation.navigate('CreatePlan')} />
    </View>
  );
}


const styles = StyleSheet.create({
  padding: {
    padding: 2,
  },
})