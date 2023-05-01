import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import { db, auth, store, firebase } from '../../Firebase/firebase'
require("firebase/firestore")
// require("firebase/firebase-storage")

export default function Save(props, { navigation }) {
    const [name, setName] = useState(null)
    const [location, setLocation] = useState(null)
    const [desc, setDesc] = useState("")
    const [rating, setRating] = useState(null)

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
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}}/>
            <TextInput placeholder='Restaurant Name' onChangeText={(name) => setName(name)}/>
            <TextInput placeholder='Restaurant Location' onChangeText={(location) => setLocation(location)}/>
            <TextInput placeholder='Description' onChangeText={(desc) => setDesc(desc)}/>
            <TextInput placeholder='Rating out of five' onChangeText={(rating) => setRating(rating)}/>
            

            <Button title="Post" onPress={() => uploadImage()}/>
        </View>
    )
}
