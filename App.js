import React, { Component } from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 

import LandingScreen from './components/auth/Landing'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import Main from './components/Main';
import Create from './components/main/Create';
import Save from './components/main/Save';

import {auth} from './Firebase/firebase'

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }
  componentDidMount(){
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={Main} options={{ headerShown: false }}/>
              <Stack.Screen name="Create" component={Create} navigation={this.props.navigation} options={{ headerShown: false }}/>
              <Stack.Screen name="Save" component={Save} navigation={this.props.navigation} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App