// import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Stopwatch from './screens/Stopwatch';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Watch from "./screens/Watch";
import { colors, fsize } from './constants/colors';
import { Test } from './screens/Test';
import Btn, { Ic, Icbtn } from './comps/Btns';
import Timer from './screens/Timer';
import { Modal } from 'react-native';
import { Events } from './screens/Events';

export default function App() {
  let st = createNativeStackNavigator();
  

  return (
     <>
      <StatusBar backgroundColor={"black"} />
            
      <NavigationContainer>
        
        <st.Navigator screenOptions={{
         headerShown:false
        }} initialRouteName="watch" >
          <st.Screen name='watch' component={Watch} />
          <st.Screen name='stopwatch' component={Stopwatch} />
          <st.Screen name='timer' component={Timer} />
          <st.Screen name='events' component={Events} />
        </st.Navigator>
      </NavigationContainer>
      {/* <Watch /> */}
      {/* <Stopwatch /> */}
      {/* <Trial /> */}
     </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainscreen:{
    flex:1,
  }
});
