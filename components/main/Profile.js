import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity } from 'react-native'
import { db, auth, store, firebase } from '../../Firebase/firebase'
import ProfileButton from './ProfileButton'
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
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.padding}></Text>
          {props.route.params.uid !== auth.currentUser.uid ? (
            <View>
              {following ?  (
                <ProfileButton title="Following" onPress={() => onUnfollow()} color="#000" />
              ) : (
                <ProfileButton title="Follow" onPress={() => onFollow()} />
              )}
            </View>
          ) : 
            <ProfileButton title="Sign Out" onPress={() => onSignOut()} />
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
    marginTop: 50,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1/3,
    borderWidth: 1,
    borderColor: 'white',
  },
  image: {
    flex: 1,
    aspectRatio: 1/1,
  },
  userName: {
    fontFamily: 'Georgia',
    textAlign: 'center',
    fontSize: 24,
  }, 
  padding: {
    padding: 2,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);