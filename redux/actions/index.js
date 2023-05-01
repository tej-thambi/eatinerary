import { auth, db } from "../../Firebase/firebase";
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from "../constants";

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser(){
    return((dispatch) => {
        db.collection("users")
            .doc(auth.currentUser.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists) {
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                } else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts(){
    return((dispatch) => {
        db.collection("posts")
            .doc(auth.currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                // console.log(posts)
                dispatch({type: USER_POSTS_STATE_CHANGE, posts}) 
            })
    })
}

export function fetchUserFollowing(){
    return((dispatch) => {
        db.collection("following")
            .doc(auth.currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id;
                })
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following})
                for(let i = 0; i < following.length; i++){
                    // console.log("following i:" + following[i]);
                    dispatch(fetchUsersData(following[i]));
                } 
            })
    })
}

export function fetchUsersData(uid) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        // console.log("uid in fetchusersdata"+uid);
        if(!found){
            db.collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if(snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;
                        dispatch({type: USERS_DATA_STATE_CHANGE, user});
                        dispatch(fetchUsersFollowingPosts(uid));
                    } else {
                        // console.log("snapshot that doesnt exist?: "+snapshot)
                        console.log('does not exist-1')
                    }
                })
        }

    })
}

export function fetchUsersFollowingPosts(uid){
    return((dispatch, getState) => {
        console.log("Initial UID in fUFP: " + uid);
        db.collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {

                const uid = snapshot.docs[0].ref.path.split('/')[1];
                // console.log(snapshot.docs);
                console.log("fetchUsersFollowingPosts UID: " + uid);

                const user = getState().usersState.users.find(el => el.uid === uid);

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data, user }
                })
                console.log("Posts in fetchUsersFollowingPosts: ");
                console.log(posts);
                dispatch({type: USERS_POSTS_STATE_CHANGE, posts, uid}) 
                console.log(getState());
            })
    })
}