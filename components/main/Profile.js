import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import { db, auth, store, firebase } from '../../Firebase/firebase'
require('firebase/firestore')

import { connect } from 'react-redux'

function Profile(props) {

  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;

    if(props.route.params.uid === auth.currentUser.uid ) {
        setUser(currentUser);
        setUserPosts(posts);
    } else {
        db.collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists) {
                    setUser(snapshot.data());
                } else {
                    console.log('does not exist')
                }
        })
        db.collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserPosts(posts);
            })
    }

    if(props.following.indexOf(props.route.params.uid) > -1) {
        setFollowing(true);
    } else {
        setFollowing(false);
    }

  }, [props.route.params.uid, props.following])
  const onFollow = () => {
    db
      .collection("following")
      .doc(auth.currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({})
  }
  const onUnfollow = () => {
    db
      .collection("following")
      .doc(auth.currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete({})
  }
  const onSignOut = () => {
    auth.signOut();

  }
  if(user === null) {
    return <View></View>
  }
  
  return (
    <View style={styles.container}>
        <View style={styles.containerInfo}>
          <Text>Profile</Text>
          <Text>{user.name}</Text>

          {props.route.params.uid !== auth.currentUser.uid ? (
            <View>
              {following ?  (
                <Button title="Following" onPress={() => onUnfollow()}/>
              ) : (
                <Button title="Follow" onPress={() => onFollow()}/>
              )}
            </View>
          ) : 
            <Button title="Sign Out" onPress={() => onSignOut()}/>
          }
        </View>

        <View style={styles.containerGallery}>
           <FlatList
              numColumns={3}
              horizontal={false}
              data={userPosts}
              renderItem={({item}) => (
                <View style={styles.containerImage}>
                  <Image
                      style={styles.image}
                      source={{uri: item.downloadURL}}
                  />
                </View>
              )}
           />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1/3,
  },
  image: {
    flex: 1,
    aspectRatio: 1/1,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);