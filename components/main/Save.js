import React, { useState } from 'react'
import { View, TextInput, Image, Button, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { db, auth, store, firebase } from '../../Firebase/firebase'
require("firebase/firestore")
import CreateButton from './CreateButton'
// require("firebase/firebase-storage")

export default function Save(props, { navigation }) {
    const [name, setName] = useState(null)
    const [location, setLocation] = useState(null)
    const [desc, setDesc] = useState("")
    const [rating, setRating] = useState(3)

    const handleRatingChange = (value) => {
      setRating(value);
    }

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const response = await fetch(uri);

        const blob = await response.blob();
        const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath);
        const task = store.ref().child(childPath).put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }
    const savePostData = (downloadURL) => {
        const uid = auth.currentUser.uid;
        db.collection('users').doc(uid).get()
          .then(doc => {
            const userName = doc.data().name;
            db.collection('posts')
              .doc(uid)
              .collection("userPosts")
              .add({
                downloadURL,
                name,
                location,
                desc,
                rating,
                userName,
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
            <Image source={{uri: props.route.params.image}}/>
            <TextInput placeholder='Restaurant Name' style={styles.input} onChangeText={(name) => setName(name)}/>
            <TextInput placeholder='Restaurant Location' style={styles.input} onChangeText={(location) => setLocation(location)}/>
            <TextInput placeholder='Description' style={styles.input} onChangeText={(desc) => setDesc(desc)}/>
            {/* <TextInput placeholder='Rating out of five' style={styles.input} onChangeText={(rating) => setRating(rating)}/> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.ratingText}>Rating</Text>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleRatingChange(value)}
                  style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 12,
                    padding: 10,
                    marginTop: 30,
                    marginLeft: 20,
                    backgroundColor: rating === value ? '#D3D3D3' : 'white',
                  }}
                >
                  <Text style={{ fontFamily: 'Georgia' }}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.padding}></Text>
            <CreateButton title="Post" onPress={() => uploadImage()} />
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