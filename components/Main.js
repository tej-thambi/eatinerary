import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserPlans, fetchUserFollowing, clearData } from '../redux/actions'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Feed from './main/Feed'
import Profile from './main/Profile'
import Search from './main/Search'
import Plans from './main/Plans'
import { auth } from '../Firebase/firebase'
const Empty = () => {
    return(null);
}

const Tab = createMaterialBottomTabNavigator();

export class Main extends Component {

    componentDidMount(){
        // this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }

    render() {
        const {currentUser} = this.props;
        if(currentUser === undefined) {
            return (
                <View></View>
            )
        }
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false} 
            barStyle={{ position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Tab.Screen name="Feed" component={Feed}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}/>
                <Tab.Screen name="Search" component={Search} navigation={this.props.navigation }
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        ),
                    }}/>
                <Tab.Screen name="CreateContainer" component={Empty}
                    listeners={({navigation}) =>({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("PostOrPlan")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        ),
                    }}/>
                <Tab.Screen name="Plans" component={Plans} navigation={this.props.navigation }
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="calendar-blank" color={color} size={26} />
                        ),
                    }}/>
                <Tab.Screen name="Profile" component={Profile}
                    listeners={({navigation}) =>({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", {uid: auth.currentUser.uid})
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
                    }} />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing, clearData}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main);