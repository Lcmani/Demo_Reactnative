/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import {
   View,
 ToastAndroid,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import Signin from "../attendancesproject/App/Authscreeen/Signinscreen/Signin";
import Otp from "../attendancesproject/App/Authscreeen/Otpscreen/Otp";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Bottomnavigator from './App/Navigation/Bottomnavigator';
import Leave_Detail from './App/Homescreen/Leaverequest_Screen/Leavestatus';
import Employeedetails from './App/Homescreen/Employee_screen/Employee_detail';
import UserEdit from './App/Homescreen/Profile/Editscreen';
import Registerlogin from './App/Homescreen/Calendar/Punchin';
import Registeringlogout from './App/Homescreen/Calendar/Punchout';
import Viewlog from './App/Homescreen/Calendar/Viewlogs';
import Camera from './App/Homescreen/Calendar/Camera_screen/Camera';
import { AuthContext } from './App/component/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { otpnextscreen } from './App/API/Apifunctions';
import { setData } from './App/API/Devicestorage';
import { BASE_URL_IN_AUTH, VERIFY_OTP } from './App/API/apiconstants';
import axios from 'react-native-axios';
import Admin_Leave_Status from './App/Admin_Screens/Admin_Leave_Status';
import Fingerprint_screen from './App/Homescreen/Fingerprint_screen/Fingerprint_screen';
import D_chart from './App/Homescreen/Calendar/D_chart';
import MessagesScreen from './App/Homescreen/Messages_Screen/MessagesScreen';

const App: () => Node = () => {
  const Stack = createNativeStackNavigator();
  const [token, settoken] = useState('');
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    finger_enable:false
  };


  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'FINGER':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          finger_enable:false
        };
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          finger_enable:true
        };
        
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
          finger_enable:false
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
          finger_enable:false
        };

    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (email, otp) => {
      const data = { email, otp: otp };
      console.log(data);
      const url = `${BASE_URL_IN_AUTH}${VERIFY_OTP}`;
      const response=await axios.post(url, data, {})
      console.log("response in api function",response);
        if(response){
          console.log('response:', response);
          
          if (response.data.statusMessage === "Success") {
            const key = response.data.data.authResponse;
            setData("keys", JSON.stringify(key));
            setData("accesstoken",response.data.data.authResponse.accessToken)
            setData("refreshtoken",response.data.data.authResponse.refreshToken)
            setData("fullname",response.data.data.authResponse.name)
            ToastAndroid.show("Please wait...", ToastAndroid.SHORT);
            settoken(response.data.data.authResponse.accessToken);
            
          }
          else {
            Alert.alert("Incorrect OTP", "Please enter the valid OTP");
          }

        }

      dispatch({ type: 'LOGIN', id: email, token: token });
    },
    signOut: async () => {
     
     try {
      await AsyncStorage.removeItem("accesstoken");
    } catch (e) {
      console.log(e);
    }
      console.log('logout');
      dispatch({ type: 'LOGOUT' });
    },
    finger:async()=>{
      dispatch({ type: 'FINGER' });
    }

  }), []);
  useEffect(() => {
    setTimeout(async () => {

      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("accesstoken");
      } catch (e) {
        console.log(e);
      }
      console.log('user token: ',userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token:userToken });
    }, 1000);
    
  }, []);
  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width: 250, height: 80, resizeMode: 'cover' }} />
      </View>
    );
  }

  return (
  <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {loginState.userToken !== null ? (
            // Screens for logged in users
            <Stack.Group screenOptions={{ headerShown: false }}>
             {loginState.finger_enable===true&&
             <Stack.Screen name='Fingerprintscreen' component={Fingerprint_screen} options={{ headerShown: false }} /> 
             } 
              <Stack.Screen name='Bottomnavigator' component={Bottomnavigator} options={{ headerShown: false }} />
              <Stack.Screen name='Chart' component={D_chart} options={{ headerShown: false }} />
              <Stack.Screen name='Leave Detail' component={Leave_Detail} options={{ headerShown: false }} />
              <Stack.Screen name='Admin_Status' component={Admin_Leave_Status} options={{ headerShown: false }} />
              <Stack.Screen name='Employee' component={Employeedetails} options={{ headerShown: false }} />
              <Stack.Screen name='Editscreen' component={UserEdit} options={{ headerShown: false }} />
              <Stack.Screen name='Registerlogin' component={Registerlogin} options={{ headerShown: false }} />
              <Stack.Screen name='Registeringlogout' component={Registeringlogout} options={{ headerShown: false }} />
              <Stack.Screen name='Viewlog' component={Viewlog} options={{ headerShown: false }} />
              {/* <Stack.Screen name='Camera' component={Camera} options={{headerShown:false}} /> */}
              <Stack.Screen name='MessagesScreen' component={MessagesScreen} options={{ headerShown: false }} />
            </Stack.Group>
          ) : (
            // Auth screens   
            <Stack.Group>
              <Stack.Screen name='Signin' component={Signin} options={{ headerShown: false }} />
              <Stack.Screen name='Otp' component={Otp} options={{ headerShown: false }} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
 
  );
};
export default App;

