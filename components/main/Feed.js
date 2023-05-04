import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import logo from '../../assets/imgs/logo1.png'
import { db, auth, store, firebase } from '../../Firebase/firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { notInitialized } from 'react-redux/es/utils/useSyncExternalStore'

function Feed(props) {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
      let posts = [];
      if(props.usersLoaded === props.following.length) {
        for(let i = 0; i < props.following.length; i++) {
          const user = props.users.find(el => el.uid === props.following[i]);
          if(user != undefined) {
            posts = [...posts, ...user.posts];
          }
        }

        posts.sort(function(x, y) {
          return x.creation - y.creation;
        })

        setPosts(posts);
      }

  }, [props.usersLoaded] )
  
  const ChefHats = ({ rating }) => {
    const filledHats = Math.floor(rating);
    const emptyHats = 5 - filledHats;
  
    const filledHatsArray = Array.from({ length: filledHats }, (_, i) => i);
    const emptyHatsArray = Array.from({ length: emptyHats }, (_, i) => i);
  
    return (
      <View style={styles.chefHatsContainer}>
        {filledHatsArray.map((i) => (
          <Image
            key={`filledHat-${i}`}
            style={styles.chefHat}
            source={require('../../assets/imgs/hat-filled2.png')}
          />
        ))}
        {emptyHatsArray.map((i) => (
          <Image
            key={`emptyHat-${i}`}
            style={styles.chefHat}
            source={require('../../assets/imgs/hat.png')}
          />
        ))}
      </View>
    );
  };  

  return (
    <View style={styles.container}>
        <View style={styles.containerGallery}>
           <FlatList
              numColumns={1}
              horizontal={false}
              data={posts}
              renderItem={({item}) => (
                <View style={styles.containerImage}>
                  <Text style={styles.postName}>{item.user.name}</Text>
                  <Text style={styles.padding1}></Text>
                  <Text style={styles.postLoc}>{item.name}, {item.location}</Text>
                  <Text style={styles.padding1}></Text>
                  <Image
                      style={styles.image}
                      source={{uri: item.downloadURL}}
                  />
                  <Text style={styles.padding1}></Text>
                  <Text style={styles.postDate}>{item.creation.toDate().toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
                  <Text style={styles.padding1}></Text>
                  <Text style={styles.postDesc}>{item.desc}</Text>
                  <Text style={styles.padding1}></Text>
                  <ChefHats rating={item.rating} />
                </View>
              )}
           />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    marginBottom: 50,
  },
  logo: {
      width: 300, 
      height: 75,
      alignSelf: 'center',
      position: 'absolute',
      top: 20,
  },
  logoContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
    zIndex: 1,
    // marginTop: 100,
  },
  containerImage: {
    flex: 1/3,
    margin: 20,
    // backgroundColor: '#C8B6A6',
    padding: 20,
    borderRadius: 5,
    borderWidth: 2,
  },
  image: {
    flex: 1,
    aspectRatio: 1/1,
  },
  postName: {
    fontFamily: 'Georgia',
    color: 'black',
    fontSize: 30,
    textAlign: 'left',
  },
  postLoc: {
    fontFamily: 'Georgia',
    color: 'black',
    fontSize: 25,
    textAlign: 'left',
  },
  postDesc: {
    fontFamily: 'Georgia',
    color: 'black',
    fontSize: 25,
    textAlign: 'left',
  },
  postDate: {
    fontFamily: 'Georgia',
    color: 'black',
    fontSize: 20,
    textAlign: 'left',
  },
  padding: {
    padding: 35,
  },
  padding1: {
    padding: 1,
  },
  chefHatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefHat: {
    width: 55,
    height: 55,
    marginRight: 5,
    marginLeft: 2,
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed);