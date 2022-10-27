import AsyncStorage from '@react-native-async-storage/async-storage';
import React from "react";
import {Alert} from "react-native";
import { BASE_URL, BASE_URL_IN_AUTH, REFRESH_TOKEN } from './apiconstants';
import axios from "react-native-axios";
import { refreshtoken_fn } from './Apifunctions';
import { setData } from './Devicestorage';
import { AuthContext } from "../component/Context";
import jwtDecode from 'jwt-decode';



const instance = axios.create({
    baseURL: BASE_URL,
});
const authinstance = axios.create({

    baseURL: BASE_URL_IN_AUTH,


});

// instance.interceptors.request.use(
//     async config => {


//         return config;
//     },
//     error =>

//         Promise.reject(error),
//     console.log(" something went wrong in request interceptors")
// );
// authinstance.interceptors.response.use(
//     response => {

//         return response.data;
//     },
// )

instance.interceptors.request.use(
    async config => {
      // Do something before request is sent
      const token = await AsyncStorage.getItem("accesstoken");
     //console.log('in request interceptor');
  
      if (token) {
       console.log('in request interceptor',token);
        config.headers.Authorization = `${token}`;
      }

      return config;
    },
    error =>
      // Do something with request error
     Promise.reject(error),
  );

instance.interceptors.response.use(
    response => {
        console.log("response interceptor", response)

        return response;

    },
    async error => {
        //const originalConfig = error.config;
        if (error ) {
           // originalConfig._retry = true;
           // console.log("Error in instance", error);
            console.log("token expired")
            const token = await AsyncStorage.getItem("keys");
            const parsed = JSON.parse(token);
            //console.log(parsed);
            if (parsed.accessToken !== '') {
                let decode = jwtDecode(parsed.accessToken);
                var email = (decode.email);
                let url = `${BASE_URL_IN_AUTH}${REFRESH_TOKEN}`;
                const body = {
                    "email": email,
                    "refreshToken": parsed.refreshToken
                }
                console.log("body in refresh token function", body);
                const response=await axios.post(url, body);
                console.log(response);
                if (response.data.statusMessage==="Success") {
                    console.log(response);
                       AsyncStorage.removeItem("accesstoken");
                       AsyncStorage.removeItem("refreshtoken");
                       AsyncStorage.removeItem("keys");

                    console.log(response.data.data.accessToken);
                    console.log(response.data.data.refreshToken);
                    try {
                        await AsyncStorage.setItem("accesstoken",response.data.data.accessToken);
                        await AsyncStorage.setItem("refreshtoken",response.data.data.refreshToken);
                        const key=response.data.data;
                        console.log("Keys storage",response.data.data)
                        await AsyncStorage.setItem("keys",JSON.stringify(key));
                      

                    } catch (error) {
                        console.log(error);
                    }
                    error.response.config.headers.Authorization = response.data.data.accessToken;
                    return instance(error.response.config);

                 }else if(response.data.statusMessage==="Unauthorized"){
                    Alert.alert("Something went wrong",
                    response.data.statusMessage,
                           [{
                               text: "Ok",
                             
                               
                           },]);
                 }
                 else{
                   
                     Alert.alert("Something went wrong",
                     "Please logout and signin again",
                            [{
                                text: "Ok",
                              
                                
                            },]);
               
                 }
            }
            //return instance(config);
            //return instance(originalConfig);
           
        
        }

        return Promise.reject(error);
    },
);
export { instance, authinstance };