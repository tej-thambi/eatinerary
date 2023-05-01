import React, { Component } from 'react'
import { View, Button, TextInput, StyleSheet } from 'react-native'
import { auth, db } from '../../Firebase/firebase'

export class SignUp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email : '',
            password : '',
            name: ''
        }
        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp(){
        const { email, password, name } = this.state;
        auth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
            db.collection("users")
                .doc(auth.currentUser.uid)
                .set({
                    name,
                    email,
                })
            // console.log(result)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
        <View style={styles.container}>
            <TextInput
                placeholder='name'
                onChangeText={(name) => this.setState({name})}
            />
            <TextInput
                placeholder='email'
                onChangeText={(email) => this.setState({email})}
            />
            <TextInput
                placeholder='password'
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password})}
            />
            
            <Button
                onPress={() => this.onSignUp()}
                title="Sign Up"
            />
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#D9D9D9', 
        alignItems: 'center', 
    },
    logo: {
        width: 300, 
        height: 75,
        alignSelf: 'center',
        position: 'absolute',
        top: 100,
    },
    buttonContainer: {
        marginTop: 20, 
    },
    button: {
        backgroundColor: '#D9D9D9',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        fontFamily: 'Georgia',
        color: 'black',
        fontSize: 30,
        textAlign: 'center',
    },
})

export default SignUp