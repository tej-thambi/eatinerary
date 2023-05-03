import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { db, auth, store, firebase } from '../../Firebase/firebase'
require("firebase/firestore")

export default function Search(props) {

    const [users, setUsers] = useState([]);
    const fetchUsers = (search) => {
        db 
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) =>{
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUsers(users);
            })

    }

    return (
        <View style={styles.container}>
            <TextInput placeholder='Search' style={styles.searchBox} onChangeText={(search) => fetchUsers(search)}/>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => {props.navigation.navigate("Profile", {uid: item.id})}}>
                        <Text style={styles.searchResult}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 100,
      marginLeft: 60,
    },
    searchBox: {
      width: '80%',
      borderBottomWidth: 1, 
      borderBottomColor: 'black',
      fontFamily: 'Georgia',
      height: 50,
      fontSize: 20,
      marginTop: 30,
    },
    searchResult: {
      fontFamily: 'Georgia',
      fontSize: 16,
      textAlign: 'left',
      width: '100%',
      marginTop: 10,
    }
  })
