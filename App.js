import React, { Component, useState, useEffect } from 'react'
import { Text, View, Alert, Image, Platform } from 'react-native'
// redux
import { Provider } from 'react-redux'
import store from './src/store'
import { sagaMiddleware } from './src/middlewares';
import rootSagas from './src/rootSagas';
sagaMiddleware.run(rootSagas);
// screen
import LoginScreen from './src/modules/auth/components/Login'
import RegisterScreen from './src/modules/auth/components/Register'
import ChatScreen from './src/screen/Chat'
import InboxMessageScreen from './src/screen/inboxMessage'
import ContactScreen from './src/screen/Contacts'
import SettingsScreen from './src/screen/Settings'
import FlashScreen from './src/screen/Flash'

// navigation
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
// icon
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { navigationRef } from './src/utils/constants';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();
StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='FlashScreen'  >
      <Stack.Screen name='FlashScreen' component={FlashScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }}></Stack.Screen>
     
      <Stack.Screen name='InboxMessageScreen' component={InboxMessageScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='BottomTabNavigator' children={BottomTabNavigator} options={{ headerShown: false }}></Stack.Screen>
    </Stack.Navigator>
  )
}

const BottomTab = createMaterialBottomTabNavigator();
BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName='ChatScreen'
      activeColor='white'
      inactiveColor='#bdc3c7'
      barStyle={{ backgroundColor: '#3F51B5' }}
    >
      <BottomTab.Screen
        name='ChatScreen'
        component={ChatScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color }) => {
            return (<Entypo name='chat' size={24} color={color}></Entypo>)
          }
        }}>
      </BottomTab.Screen>
      <BottomTab.Screen
        name='ContactScreen'
        component={ContactScreen}
        options={{
          tabBarLabel: 'Contact',
          tabBarIcon: ({ color }) => {
            return (
              <AntDesign name='contacts' size={24} color={color}></AntDesign>
            )
          }
        }}>
      </BottomTab.Screen>
      <BottomTab.Screen
        name='SettingsScreen'
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => {
            return (
              <Ionicons name='md-settings' size={24} color={color}></Ionicons>
            )
          }
        }}>
      </BottomTab.Screen>
    </BottomTab.Navigator>
  )
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

  }
  checkPermission = async () => {
    const enable = await messaging().hasPermission()
    if (enable) {
      this.getToken()
    } else {
      this.requestUserPermission()
    }
  }
  getToken = async () => {
    try {
      let tokenFCM = await messaging().getToken()
      console.log("App -> getToken -> tokenFCM", tokenFCM)
      if (tokenFCM) {
        await AsyncStorage.setItem('tokenFCM', tokenFCM)
      }
    } catch (error) {
      console.log(error)
    }
  }
  requestUserPermission = async () => {
    messaging().requestPermission().then(() => {
      this.getToken()
    }).catch((error) => {
      console.log('requestPermission', error)
    })
  }
  componentDidMount() {
    this.checkPermission()

  }
  deleteToken = () => {
    messaging().deleteToken().catch((error) => {
      console.log('DeleteToken', error)
    })
  }

  render() {
    // foreground state messages
    const notification = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {

        let notification = null
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data.notification
        } else {
          notification = remoteMessage.notification
        }
        // onNotification(notification)
      }
      console.log("App -> constructor -> remoteMessage", remoteMessage)
      // messaging().onTokenRefresh().then(fcmToken=>{

      // })
    });
    return (
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <StackNavigator></StackNavigator>
        </NavigationContainer>
      </Provider>
       
      //  <Camera/>
    )
  }
}

export default App;