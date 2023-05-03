import React, { Component } from 'react'
import { View, Button, TextInput, StyleSheet, Text } from 'react-native'
import { auth, db } from '../../Firebase/firebase'
import SignButton from './SignButton';

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
            <TextInput style={styles.input}
                placeholder='name'
                onChangeText={(name) => this.setState({name})}
            />
            <TextInput style={styles.input}
                placeholder='email'
                onChangeText={(email) => this.setState({email})}
            />
            <TextInput style={styles.input}
                placeholder='password'
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password})}
            />
            <Text style={styles.padding}></Text>
            <SignButton 
                onPress={() => this.onSignUp()}
                title="Sign Up"
            />
            <Text style={styles.padding}></Text>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF', 
        alignItems: 'center', 
    },
    buttonContainer: {
        marginTop: 20, 
    },
    button: {
        backgroundColor: '#FFFFFF',
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
    input: {
      width: '80%',
      borderBottomWidth: 1, 
      borderBottomColor: 'black',
      fontFamily: 'Georgia',
      height: 50,
      fontSize: 20,
      marginTop: 30,
    },
    padding: {
        padding: 15,
    }
})

export default SignUp