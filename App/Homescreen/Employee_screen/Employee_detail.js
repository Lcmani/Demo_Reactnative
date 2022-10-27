import React, { useState, useEffect } from 'react';
import {
    Text, StyleSheet, View,
    Image, MapView,  Linking,
    Button, Dimensions, TouchableOpacity, ToastAndroid, ActivityIndicator, ScrollView,RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "react-native-axios";
import { colors } from '../../component/Colours';
import { getUserData_fn, userimage_fn } from '../../API/Apifunctions';
import { getData } from "../../API/Devicestorage";
import { RFPercentage } from 'react-native-responsive-fontsize';

const Employeedetails = props => {
    const [accessToken, setaccesstoken] = useState('');
    const [refreshToken, setrefreshtoken] = useState('');
    const [responsedata, setresponsedata] = useState({});
    const [userId, setUserId] = useState();
    const [isVisble, setIsVisble] = useState(false);
    const [isVisbleImage, setIsVisbleImage] = useState(false);
    const [images, setImages] = useState('');
    const [refreshing, setRefreshing] =useState(false);
    const[loading,setloading]=useState(true);

 

    
    
    
  const getAccesstoken = async () => {
    await getData("accesstoken")
      .then(data => data)
      .then(value => {

     //   console.log(" Value:  " + value);
        setaccesstoken(value);

      })
      .catch(err => console.log(err))

  }
  const getrefreshtoken = async () => {
    await getData("refreshtoken")
      .then(data => data)
      .then(value => {
        //console.log(" Value:  " + value);
        setrefreshtoken(value);
      })
      .catch(err => console.log(err))

  }
    const getUserData = async () => {
        setUserId(props.route.params.EmployeeDetatils.id);
        const user_id=props.route.params.EmployeeDetatils.id;
       
        getUserData_fn(accessToken, user_id)

            .then(function (response) {
                console.log('response in getuserdata function', response);
                var data = response.data;
                if (accessToken !== '') {
                    console.log("In if statement");
                    setresponsedata(data);
                    if (responsedata) {
                        setloading(false);
                        setIsVisble(true)
                        
                    }
                } else {
                    console.log("In else statement");
                   setloading(true);
                   // ToastAndroid.show("Loading...", ToastAndroid.LONG);
                }


            })
    }
    const getUserImage = async () => {
        setUserId(props.route.params.EmployeeDetatils.id);
        if (accessToken !== '') {
            const user_id=props.route.params.EmployeeDetatils.id;
            userimage_fn(accessToken, user_id)
                .then(function (response) {
                    console.log('response in getuserimage', response);
                    const data = response.data.data.image;
                    if (accessToken !== '') {
                        console.log("In if statement");
                        
                        setImages(data);
                        // if (images) {
                        //     console.log('in axios use image', images);
                        //     setIsVisbleImage(true);
                        // }
                        setIsVisbleImage(true);
                    } else {
                        console.log("In else statement");
                    }


                })
        }

    }

    useEffect(() => {
        getAccesstoken();
        getrefreshtoken();
        if(accessToken!==""&&userId!==''){
            getUserData();
            getUserImage();
        }
    }, [accessToken,images,isVisbleImage,userId]);
    if(loading){
        <View style={styles.modalViewinside}>
        <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={{ width:40, height:40, borderRadius: 70, overflow: 'hidden' }}
                source={{ uri:'https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif' }}
            />

        </View>

    }
    const backscreen = (props) => {
        props.navigation.navigate('Employee Details');
    }
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
    const onRefresh = () => {
        setRefreshing(true);
        wait(500)
        .then(() => {
          if(accessToken!==""){
              getUserData();
              getUserImage();
          }
            setRefreshing(false);
            
        });
      } 
      const openDialScreen = () => {
        let number = '';
        if (Platform.OS === 'ios') {
          number = 'telprompt:${091123456789}';
        } else {
            const telephone=responsedata.mobileNo;
          number = 'tel:'+responsedata.mobileNo;
          console.log(number);
        }
        Linking.openURL(number);
      };
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            <View style={styles.employeeview} >
                <TouchableOpacity onPress={() => backscreen(props)}>
                    <Image source={require('../../Assets/left-arrow.png')} style={{ width: 25, height: 25, tintColor: '#5297F4', }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={styles.title}>Employee Details</Text>
                    <View style={{ paddingRight: 10 }}>
                        <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width: 100, height: 30, resizeMode: 'cover' }} />

                    </View>
                </View>
            </View>
            <View style={styles.centeredView}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <View style={styles.modalView}>
                        {isVisbleImage ?
                            <View style={styles.modalViewinside}>
                                {
                                    images=== null ? 
                                    <Image style={{ width: 120, height: 120, borderRadius: 70, overflow: 'hidden' }} source={{ uri: 'https://img.icons8.com/ultraviolet/344/user.png' }} />
                                        :
                                        <Image
                                            resizeMode="cover"
                                            resizeMethod="scale"
                                            style={{ width: 120, height: 120, borderRadius: 70, overflow: 'hidden' }}
                                            source={{ uri: `data:image/png;base64,${images}` }}
                                        />
                                }
                            </View> :
                             <View style={styles.modalViewinside}>
                             <Image
                                     resizeMode="cover"
                                     resizeMethod="scale"
                                     style={{ width:40, height:40, borderRadius: 70, overflow: 'hidden' }}
                                     source={{ uri:'https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif' }}
                                 />
 
                             </View>
                            
                            }
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                    <Text style={{ fontSize:RFPercentage(3), color: colors.blue, fontWeight: 'bold' }}>
                        {responsedata.fullName}
                    </Text>
                </View>
                <View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Employee ID
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>
                        <View style={styles.editbox}>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1,width: Dimensions.get('window').width-190,marginRight:-10  }}>
                                {responsedata.employeeNumber}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Role
                            </Text>
                            <Text style={{ textAlign: 'left',fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>
                        <View style={styles.editbox}>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1,width: Dimensions.get('window').width-190,marginRight:-10 }}>
                                {responsedata.jobDescription}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Email ID
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>
                        <View style={styles.editbox}>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: 'bold',paddingLeft:10,width: Dimensions.get('window').width-190,marginRight:-10 }}>
                                {responsedata.email}
                            </Text>

                        </View>
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Contact No
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>
                        <View style={styles.editbox_contact}>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1,width: Dimensions.get('window').width-190,marginRight:-10  }}>
                                {responsedata.mobileNo}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => openDialScreen()}>
                        <View style={{width:40,height:40,justifyContent:'center',marginLeft:10}}>
                          <Image source={{uri:"https://uxwing.com/wp-content/themes/uxwing/download/37-communication-chat-call/accept-call.png"}} style={{width:30,height:30,tintColor:'green'}}/>
                        </View>
                        </TouchableOpacity>
                        
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Address
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>
                        <View style={styles.editbox}>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1,width: Dimensions.get('window').width-190,marginRight:-10  }}>
                                {responsedata.personalAddressLine1}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Blood Group
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>
                        <View style={styles.editbox}>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1,width: Dimensions.get('window').width-190,marginRight:-10 }}>
                                {responsedata.bloodGroup}
                            </Text>

                        </View>
                    </View>
                </View>
            </View>
        </ScrollView >
    );
}


const styles = StyleSheet.create({

    parent_scrollview: {

        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
        paddingLeft:10
    },
    editbox: {
        borderColor:colors.blue,
        borderWidth: 1,
        borderRadius: 5,
        width: Dimensions.get('window').width-190,
        backgroundColor:'white',
        justifyContent:'center',
        elevation:10,
        borderWidth:1

    },
    editbox_contact: {
        borderColor: colors.blue,
        borderWidth: 1,
        borderRadius: 5,
        width: Dimensions.get('window').width-240,
        backgroundColor:'white',
    },
    employeeview: {
        justifyContent: 'flex-start',
        paddingTop: 30,
        flexDirection: 'row',
        paddingLeft: 5,
        paddingBottom: 60
    },
    title: {
        color: colors.blue,
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 5,
        justifyContent: "flex-start",
        alignItems: 'baseline'

    },
    centeredView: {
      //  flex: 0.97,
        //alignItems: "center",
        marginLeft: 15,
        marginRight: 15,
        paddingBottom:10,
        backgroundColor: '#f2f3f9',
        borderRadius: 10
    },
    modalView: {
        // margin: 20,
        backgroundColor: "white",
        borderRadius: 70,
        //padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 120,
        height: 120,
        marginTop: -50
    },
    modalViewinside: {
        borderRadius: 70,
        justifyContent:'center',
        alignItems: "center",
        width: 120,
        height: 120,
    },
    text1:{
        textAlign: 'left', 
        fontSize: 16, 
        color: colors.blue, 
        fontWeight: 'bold', 
        padding: 10, 
        width: 120 
    }


});

export default Employeedetails;