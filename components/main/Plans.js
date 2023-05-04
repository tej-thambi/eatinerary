import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import logo from '../../assets/imgs/logo1.png'
import { db, auth, store, firebase } from '../../Firebase/firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { notInitialized } from 'react-redux/es/utils/useSyncExternalStore'

function Plans(props) {

    const [userPlans, setUserPlans] = useState([]);

    // useEffect(() => {
    //     db.collection("plans")
    //         .doc(auth.currentUser.uid)
    //         .collection("userPlans")
    //         .orderBy("creation", "asc")
    //         .get()
    //         .then((snapshot) => {
    //             let plans = snapshot.docs.map(doc => {
    //                 const data = doc.data();
    //                 const id = doc.id;
    //                 return { id, ...data }
    //             })
    //             setUserPlans(plans);
    //         })
    //   }, [])

    useEffect(() => {
        const unsubscribe = db
            .collection("plans")
            .doc(auth.currentUser.uid)
            .collection("userPlans")
            .orderBy("creation", "asc")
            .onSnapshot((snapshot) => {
                let plans = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserPlans(plans);
            });
        return () => unsubscribe();
    }, []);
    
  
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Plans</Text>
        <View style={styles.containerGallery}>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={userPlans}
            renderItem={({item}) => (
              <View style={styles.containerPlan}>
                <Text style={styles.planName}>{item.name}, {item.location}</Text>
                <Text style={styles.planMenu}>{item.menuItems}</Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
  

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1,
        marginBottom: 50,
      },
      pageTitle: {
        margin: 20,
        fontFamily: 'Georgia',
        color: 'black',
        fontSize: 35,
        textAlign: 'center',
        alignItems: 'center',
      },
      containerInfo: {
        margin: 20,
      },
      containerGallery: {
        flex: 1,
        zIndex: 1,
      },
      containerPlan: {
        flex: 1,
        zIndex: 1,
        padding: 10,
        margin: 20,
        borderRadius: 5,
        borderWidth: 2,
      },
      planName: {
        fontFamily: 'Georgia',
        color: 'black',
        fontSize: 30,
        textAlign: 'left',
      },
      planMenu: {
        fontFamily: 'Georgia',
        color: 'black',
        fontSize: 25,
        textAlign: 'left',
      },
      padding: {
        padding: 35,
      },
      padding1: {
        padding: 1,
      },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Plans);