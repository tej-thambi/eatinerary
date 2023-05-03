import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native'
import logo from '../../assets/imgs/logo1.png'

const CustomButton = ({ title, onPress, style }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const Landing = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image 
                source={logo}
                style={styles.logo}
            />
            <View style={styles.buttonContainer}>
                <CustomButton 
                    title="Sign Up"
                    onPress={() => navigation.navigate("SignUp")}
                    style={styles.button}
                />
                <CustomButton 
                    title="Sign In"
                    onPress={() => navigation.navigate("SignIn")}
                    style={styles.button}
                />
            </View>
        </View>
    )
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF', 
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
})

export default Landing;
