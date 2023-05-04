import React, { useState } from 'react'
import { View, TextInput, Image, Button, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { db, auth, store, firebase } from '../../Firebase/firebase'
require("firebase/firestore")
import CreateButton from './CreateButton'
// require("firebase/firebase-storage")

export default function CreatePlan(props, { navigation }) {
    const [name, setName] = useState(null)
    const [location, setLocation] = useState(null)
    const [menuItems, setMenuItems] = useState("")

    const savePlanData = () => {
        const uid = auth.currentUser.uid;
        db.collection('users').doc(uid).get()
          .then(doc => {
            db.collection('plans')
              .doc(uid)
              .collection("userPlans")
              .add({
                name,
                location,
                menuItems,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                props.navigation.popToTop();
              });
          })
          .catch(error => {
            console.log("Error getting user name:", error);
          });
      }      
    return (
        <View style={styles.container}>
            <TextInput placeholder='Restaurant Name' style={styles.input} onChangeText={(name) => setName(name)}/>
            <TextInput placeholder='Restaurant Location' style={styles.input} onChangeText={(location) => setLocation(location)}/>
            <TextInput placeholder='Menu Items to Try' style={styles.input} onChangeText={(menuItems) => setMenuItems(menuItems)}/>
            <Text style={styles.padding}></Text>
            <CreateButton title="Add Plan" onPress={() => savePlanData()}/>
            <Text style={styles.padding1}></Text>
          </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    fontFamily: "Georgia",
    height: 50,
    fontSize: 20,
    marginTop: 30,
  },
  padding: {
    padding: 10,
  },
  padding1: {
    padding: 100,
  },
  ratingText: {
    marginTop: 30,
    fontFamily: "Georgia",
    fontSize: 20,
  }
})