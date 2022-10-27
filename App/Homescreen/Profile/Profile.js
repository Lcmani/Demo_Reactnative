import React, { useState, useEffect } from 'react';
import {
    Text, StyleSheet, View,
    Image, TouchableOpacity,ToastAndroid, ScrollView, ActivityIndicator,RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../component/Colours';
import jwtDecode from "jwt-decode";
import { userdata,refreshtoken_fn } from '../../API/Apifunctions';
import { getData } from "../../API/Devicestorage";
import { useFocusEffect } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import moment from 'moment';

const UserDetails = props => {
    const [accessToken, setaccesstoken] = useState('');
    const [responsedata, setresponsedata] = useState({});
    const [images, setImages] = useState('');
    const [isVisbleImage, setIsVisbleImage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] =useState(false);
    const [refreshToken, setrefreshtoken] = useState('');
   
    const getUserData = async (id) => {
        let data=1;
        userdata(id,accessToken,data)
            .then(function (response) {
                if(accessToken!==''){
                    console.log('response in getuserdata function', response);
                    var data = response.data;
                    setresponsedata(data);
                }else{
                    console.log("In else statement");
                    alert("Please wait...");
                } 
                    
            })
    }
    const getUserImage = async (id) => {
        let data = 2;
        userdata(id, accessToken, data)
            .then(function (response) {
                if (accessToken !== '') {
                    console.log('response in getuserimage', response);
                    setImages(response.data.data.image);
                    if (images) {
                        setIsVisbleImage(true);
                    }
                } else {
                    console.log("In else statement");
                } 
                  
                
            })
            .catch((error) => {
                console.log('error in userdata function', error);
  
                if (error.response) {
  
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                }
                throw error;
              })
    }
    const getAccesstoken = async () => {
        await getData("accesstoken")
          .then(data => data)
          .then(value => {
    
            //console.log(" Value:  " + value);
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
      useFocusEffect(
        React.useCallback(() => {
            getAccesstoken();
            getrefreshtoken();
            if(accessToken !==''){
                console.log("access token",accessToken);
                let decode=jwtDecode(accessToken);
                console.log("decode",decode);
                if(decode.id !== undefined){
                    getUserData(decode.id);
                    getUserImage(decode.id);
                    setIsLoading(false);
                }
    
            }else{
                ToastAndroid.show("Loading...", ToastAndroid.SHORT);
                setIsLoading(true);
            }
      
        }, [accessToken,images,isVisbleImage])
      );
    // if (isLoading) {
    //     return (
    //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //         <ActivityIndicator size="large" />
    //       </View>
    //     );
    //   }
      const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
      const onRefresh = () => {
        setRefreshing(true);
        wait(500)
        .then(() => {
            if(accessToken !==''){
                console.log("access token",accessToken);
                let decode=jwtDecode(accessToken);
                console.log("decode",decode);
                if(decode.id !== undefined){
                    getUserData(decode.id);
                    getUserImage(decode.id);
                    setIsLoading(false);
                }
            }else{
                ToastAndroid.show("Loading...", ToastAndroid.SHORT);
                setIsLoading(true);
            }
            setRefreshing(false);
            
        });
      }
  
    const backscreen = (props) => {
        props.navigation.navigate('Calendar');
    }
    const editscreen = (response) => {
        props.navigation.navigate('Editscreen',{responsedata:response});
    }

   
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
                    <Text style={styles.title}>User Profile</Text>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <View style={{ paddingRight: 10 }}>
                            <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width: 100, height: 30, resizeMode: 'cover' }} />
                        </View>
                        <TouchableOpacity onPress={() => { editscreen(responsedata) }} >
                            <View style={styles.btnview}>
                                <Text style={{ fontSize: 16, color: colors.blue, fontWeight: 'bold' }}>
                                    Edit Profile
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.centeredView}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <View style={styles.modalView}>
                       
                        {isVisbleImage ?
                            <View style={styles.modalViewinside}>
                                <Image
                                    resizeMode="cover"
                                    resizeMethod="scale"
                                    style={{ width: 120, height: 120, borderRadius: 70, overflow: 'hidden' }}
                                    source={{ uri: `data:image/png;base64,${images}` }}
                                />

                            </View> :
                            images === null ?
                                <View style={styles.modalViewinside}>
                                    <Image
                                        resizeMode="cover"
                                        resizeMethod="scale"
                                        style={{ width: 120, height: 120, borderRadius: 70, overflow: 'hidden' }}
                                        source={{ uri: "https://img.icons8.com/ultraviolet/344/user.png" }}
                                    />
                                </View> :
                                <View style={styles.modalViewinside}>
                                    <Image
                                        resizeMode="cover"
                                        resizeMethod="scale"
                                        style={{ width: 40, height: 40, borderRadius: 70, overflow: 'hidden' }}
                                        source={{ uri: 'https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif' }}
                                    />

                                </View>
                        }
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom:10}}>
                    <Text style={{ fontSize:RFPercentage(3), color: colors.blue, fontWeight: 'bold' }}>
                     {responsedata.fullName}
                    </Text>
                </View>
                <View style={{flex:0.7,marginBottom:50,marginLeft:5}}>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Employee ID
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>


                        <Text style={{ textAlign: 'left',fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 , }}>
                            {responsedata.employeeNumber}
                        </Text>



                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Role
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>


                        <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                            {responsedata.jobDescription}
                        </Text>



                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Email ID
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>


                        <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', flex: 1, width: 150,marginRight:10,paddingLeft:10}}>
                            {responsedata.email}
                        </Text>




                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Contact No
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize: 15, color: "black", fontWeight: 'bold', padding: 10, flex: 1,width: 150,marginRight:10 }}>
                            {responsedata.mobileNo}
                        </Text>



                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Address
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                            {responsedata.personalAddressLine1}
                        </Text>



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

                        <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                            {responsedata.bloodGroup}
                        </Text>

                    </View>
                    
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Gender
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize: 15, color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                        {responsedata.gender}
                        </Text>

                    </View>

                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                            Date Of Joining
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize: 15, color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                        {moment(responsedata.dateOfJoining).format("DD-MM-YYYY")}
                        </Text>

                    </View>

                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                            Department
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize: 15, color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                        {responsedata.department}
                        </Text>

                    </View>

                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                            Date Of Birth
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize: 15, color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                        {moment(responsedata.dateOfBirth).format("DD-MM-YYYY")}
                        </Text>

                    </View>

                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                            Father's/Spouse name
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize: 15, color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                        {responsedata.fatherName}
                        </Text>

                    </View>

                   

                    
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                            Total leave in a month
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>
                        {
                            responsedata.monthly_leave===null?  
                        <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1,width: 150,marginRight:10 }}>
                    </Text>:  
                    <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1,width: 150,marginRight:10 }}>
                    {responsedata.monthly_leave} days
                </Text>
                        }


                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Taken Leave
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10}}>
                        {responsedata.leaveTaken} days
                        </Text>

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Remaining  Leave
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold', padding: 10, flex: 1, width: 150,marginRight:10 }}>
                        {responsedata.balanceLeave} days
                        </Text>

                    </View>



                </View>
            </View>


        </ScrollView>
    );
}
const styles = StyleSheet.create({
    btnview: {
        justifyContent: 'center',
        alignItems: "center",
        width: 100,
        height: 40,
        paddingTop:20,

    },
    text1:{
        textAlign: 'left', 
        fontSize:RFPercentage(2.3), 
        color: colors.blue, 
        fontWeight: 'bold', 
        padding: 10, 
        width: 120 
    },
    parent_scrollview: {

        //flex: 1,
        flexDirection: 'row',
        //marginVertical: 5,
        marginTop:3
    },
    editbox: {
        borderColor: colors.slate_gray,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.light_slate_gray,
    },
    input_editbox: {
        borderColor: colors.slate_gray,
        borderWidth: 1,
        borderRadius: 5,
        width: 180,
        fontSize: 14,

        backgroundColor: "white",



    },
    employeeview: {
        justifyContent: 'flex-start',
        paddingTop: 12,
        flexDirection: 'row',
        paddingLeft: 5,
        paddingBottom: 10
    },
    title: {
        color: colors.blue,
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 5,
        justifyContent: "flex-start",
        alignItems: 'baseline'

    },
    imagecircleview_phone: {
        width: 100,
        height: 25,
        backgroundColor: '#5297F4',
        // margin:10,
        borderRadius: 5,

        justifyContent: "flex-end",
        alignItems: 'center',
        // paddingLeft:10,
        position: 'relative',
        paddingLeft: 30

    },

    centeredView: {
        flex: 0.5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#f2f3f9',
        borderRadius: 10
    },
    imagecircleview_phone_blue: {
        width: 20,
        height: 20,
        backgroundColor: 'blue',
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgstyle_phone: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 70,
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
        alignItems: "center",
        width: 120,
        height: 120,
        justifyContent:'center'
    },

});
export default UserDetails;