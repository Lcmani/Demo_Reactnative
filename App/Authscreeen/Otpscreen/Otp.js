import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert,ToastAndroid,Pressable} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CountDown from "react-native-countdown-component";
import { styles } from './Otpstyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, setData } from "../../API/Devicestorage";
import { otpnextscreen,refresh_fn } from "../../API/Apifunctions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AuthContext } from "../../component/Context";



const Otp = (props) => {
    const [refreshbtn, setrefreshbtn] = useState(false);
    const [show, setshow] = useState(true);
    const [otp, setotp] = useState('');
    const [email, setemail] = useState('');
    useEffect(() => {
        getEmail();
    }, []);

    const getEmail=async()=>{
        await getData("email")
                        .then(data => data)
                        .then(value => {

                                console.log("Email  ",value)
                               setemail(value);
                        })
                        .catch(err => console.log(err))
    }
   
const nextscreen=(props)=>{
    otpnextscreen(email,otp)
    .then((response)=>{
        console.log('response:', response);

        if (response.data.statusMessage === "Success") {
            const key=response.data.data.authResponse;
            setData("keys",JSON.stringify(key));
            setData("accesstoken",response.data.data.authResponse.accessToken)
            setData("refreshtoken",response.data.data.authResponse.refreshToken)
            ToastAndroid.show("Please wait...", ToastAndroid.SHORT);
            props.navigation.navigate("Bottomnavigator");
        }
        else {
            Alert.alert("Incorrect OTP", "Please enter the valid OTP");
          }

    })

}
    const refresh = () => {
        setshow(!show);
        setrefreshbtn(!refreshbtn);
    }

    const refreshclick = (email) => {   
           refresh_fn(email)
           .then((response)=>{
            console.log(response);
            setrefreshbtn(!refreshbtn);
            setshow(!show);
            setotp(''); 
        })
        .catch((error)=>{
            console.log(error);
          })
    
    }
    const backscreen = (props) => {
        props.navigation.navigate('Signin');
    }
   const { signIn } = React.useContext(AuthContext);
    return (
        <ScrollView style={styles.container}>
             <View style={{paddingTop:  10,justifyContent:'center',alignItems:'center',marginBottom:10}}>
                    <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width:250, height:80, resizeMode: 'cover' }} />

                    </View>
            <View style={styles.imageview}>
                <Image source={require('../../Assets/image1.png')} style={styles.image} />
            </View>

            <View style={{ backgroundColor: 'white', }}>
                <View style={{  paddingLeft: 20, paddingRight: 20 }}>
                    <View>
                        <Text style={{ fontSize:RFPercentage(2.5), color: 'black' }}>Sign In</Text>
                    </View>
                    <View style={{ flex: 0.3, borderColor:'grey', borderWidth: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 20, backgroundColor: '#d3d3d3', paddingTop: 10, paddingBottom: 10, paddingLeft: 10 }}>
                        <Text style={{ fontSize: RFPercentage(2.3), color: 'black', alignItems: 'center', justifyContent: 'center' }}>{email}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <KeyboardAwareScrollView style={styles.textinput}>
                            <TextInput placeholder='OTP' style={{ fontSize: RFPercentage(2),color:'black' }} keyboardType='numeric'  value={otp}
                onChangeText={value => setotp(value)} clearButtonMode="always"/>

                        </KeyboardAwareScrollView>
                        <View >

                            {show &&<CountDown
                                key={1}
                                until={120}
                                size={15}
                                onFinish={refresh}
                                separatorStyle={{ color: 'red',}}
                                digitStyle={{ backgroundColor: 'white' }}
                                digitTxtStyle={{ color: 'red'}}
                                timeToShow={['M', 'S']}
                                showSeparator
                                timeLabels={{ m:'', s:'' }}
                            />
                            }
                            {
                                refreshbtn && <View style={{ paddingTop: 10, paddingLeft: 5 }}>
                                    <TouchableOpacity onPress={()=>refreshclick(email)}>
                                        <Image source={require('../../Assets/refresh.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                                        {/* <Ionicons name='refresh' size={20} onPress={refreshclick}/> */}
                                    </TouchableOpacity>
                                </View>

                            }

                        </View>
                    </View>

                </View>
                <View style={{ flexDirection: 'row',justifyContent:'space-around',paddingTop:10}}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: 20 }}>
                        <Pressable onPress={() => backscreen(props)}>
                            <Text style={{ fontSize: 20, color: '#5297F4', textDecorationLine: 'underline', textDecorationColor: '#5297F4' }}>Back</Text>
                        </Pressable>
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Pressable onPress={()=>signIn(email,otp)}>
                            <View style={styles.iconview}>
                                <Image source={require('../../Assets/right-arrow.png')} style={styles.icon} />
                            </View>
                        </Pressable>
                    </View>
                </View>

            </View>
            <View style={{justifyContent:'center',alignItems:'center',paddingTop:5}}>
            <Text style={{ color: 'black', fontSize: 12 }}>Version-P 1.0.7</Text>
            <Text style={{color:'black',fontSize:12}}>©Copyright 2022 Coherent® All Rights Reserved</Text>
            </View>
        </ScrollView>
    );
}
export default Otp;
