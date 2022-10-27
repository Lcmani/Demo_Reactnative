import React, { useState } from "react";
import { View, Text, Image, ScrollView, TextInput, Alert,TouchableOpacity ,ToastAndroid,Pressable} from 'react-native';
import { styles } from "./Signinstyles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setData } from "../../API/Devicestorage";
import { signin_fn } from "../../API/Apifunctions";
import { RFPercentage } from "react-native-responsive-fontsize";

const Signin = (props) => {
    const [email, setemail] = useState('');
    const[input,setinput]=useState('');
    const nextscreen = async (props) => {
        if (email === '') {
            alert("Please enter the email");
        } else {
            signin_fn(email)
                .then((response) => {
                    console.log(response);
                    if (response.data.data === "OTP sent successfully") {
                        AsyncStorage.removeItem("Punchin");
                        setData("email", email);
                        ToastAndroid.show("Please wait...", ToastAndroid.SHORT);
                        setemail('');
                        props.navigation.navigate('Otp');
                        input.clear();
                        setemail('')
                    } else {
                        Alert.alert("Alert",
                            "Please enter the valid Email ID",
                            [{
                                text: "Ok",
                            },]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response) {
                        console.log(error.response);
                    }
                    throw error;
                })
        }
   
    }
    return (
        <ScrollView style={styles.container}>
            <View style={{ paddingTop:10, justifyContent: 'center', alignItems: 'center',marginBottom:10 }}>
                <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width: 250, height: 80, resizeMode: 'cover' }} />
            </View>
            <View style={styles.imageview}>
                <Image source={require('../../Assets/image1.png')} style={styles.image} />
            </View>
            <View style={{ flex: 0.3, backgroundColor: 'white', }}>
                <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ fontSize:RFPercentage(2.5), color: 'black' }}>Sign In</Text>
                    </View>
                    <KeyboardAwareScrollView style={styles.textinput}>
                        <TextInput autoCapitalize="none" placeholder='Email id' style={{ fontSize:RFPercentage(2) , color: 'black' }} onChangeText={(text) => {
                            if (text.includes(' ')) {
                              //  console.log('email before trim',email);
                                setemail(text.trim());
                               // console.log('email after  trim',email);
                            } else {
                              //  console.log('in else');
                                setemail(text);
                            }
                        }
                        } ref={input => { setinput(input) }} clearButtonMode="always" />
                    </KeyboardAwareScrollView>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable onPress={() => nextscreen(props)}>
                        <View style={styles.iconview}>
                            <Image source={require('../../Assets/right-arrow.png')} style={styles.icon} />
                        </View>
                    </Pressable>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                <Text style={{ color: 'black', fontSize: RFPercentage(1.5) }}>Version-P 1.0.7</Text>
                <Text style={{ color: 'black', fontSize: RFPercentage(1.5) }}>©Copyright 2022 Coherent® All Rights Reserved</Text>
            </View>
        </ScrollView>

    );
}

export default Signin;
