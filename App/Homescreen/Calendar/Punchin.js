import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet, Dimensions, BackHandler, TouchableOpacity, ScrollView, PermissionsAndroid, Platform, Alert } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import { Confirmpunchin_fn, Locationverify_fn, refreshtoken_fn, userdata } from "../../API/Apifunctions";
import { getData } from "../../API/Devicestorage";
import ImagePicker, { openCamera } from 'react-native-image-crop-picker';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../component/Colours";
import MapView ,{ PROVIDER_GOOGLE } from 'react-native-maps';
import Slider from 'react-native-slide-to-unlock';
import { useFocusEffect } from "@react-navigation/native";
import jwtDecode from "jwt-decode";
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';

const Registerlogin = (props) => {
  const [location, setlocation] = useState(true);
  const [verify, setverify] = useState(true);
  const [confirm, setconfirm] = useState(true);

  const [
    currentLongitude,
    setCurrentLongitude
  ] = useState();
  const [
    currentLatitude,
    setCurrentLatitude
  ] = useState();
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const [accessToken, setaccessToken] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [refreshToken, setrefreshtoken] = useState('');
  const [icon_images, seticonImages] = useState('');
  const [isVisbleImage, setIsVisbleImage] = useState(false);
  const [back, setback] = useState();
  const [locationboolean, setlocationboolean] = useState(true);
  const [range, setrange] = useState();
  const [image, setImage] = useState('');
  const[photo,setphoto]=useState(true);


  // useEffect(() => {
  //   if(props.route.params?.picture){
  //     console.log('sent Scess', props.route.params?.picture);
   
  //   setImage(props.route.params?.picture.uri)
  //   }
    
  // }, [props.route.params?.picture]);

  const getUserImage = async (id) => {
    let data = 2;
    userdata(id, accessToken, data)
        .then(function (response) {
            if (accessToken !== '') {
                console.log('response in getuserimage', response);
                seticonImages(response.data.data.image);
                if (icon_images) {
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
        setaccessToken(value);

      })
      .catch(err => console.log(err))

  }
  const getrefreshtoken = async () => {
    await getData("refreshtoken")
      .then(data => data)
      .then(value => {
        // console.log(" Value:  " + value);
        setrefreshtoken(value);
      })
      .catch(err => console.log(err))

  }
  useFocusEffect(
    React.useCallback(() => {
        getAccesstoken();
        if(accessToken !==''){
            console.log("access token",accessToken);
            let decode=jwtDecode(accessToken);
            console.log("decode",decode);
            if(decode.id !== undefined){        
                getUserImage(decode.id);               
            }
        }
  
    }, [accessToken,icon_images,isVisbleImage])
  );
  useEffect(() => {
      getAccesstoken();
      getrefreshtoken();
      var date = moment()
        .utcOffset('+05:30')
        .format('DD MMM YYYY ,hh:mm a');
      setCurrentDate(date);
  
      const requestLocationPermission = async () => {
        try {
          console.log("try block");
          const granted = await PermissionsAndroid.request(
  
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getOneTimeLocation();
          } else {
            console.log("else block");
            Alert.alert('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
  
      };
  
      requestLocationPermission();
      if (location === false && accessToken !== '') {
  
        Locationverify_fn(currentLatitude, currentLongitude, accessToken)
          .then(function (response) {
            console.log(response);
            console.log("in getOneTimeLocation");
           
              setrange(response.data.inRange);
              if (response.data.inRange === true) {
                console.log('inrange', response.data.inRange);
                setverify(false);
                setback(true);
                setphoto(true);
                // if(response.data.firstLogin===false){
                //   setphoto(true);
                // }else{
                //   setphoto(false);
                // }
              }
              else {
                setverify(false);
                setback(false);
              }
          })
          .catch(function (error) {
            console.log(error.response);
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          })
      }
    
    }, [accessToken,verify,location]);
   



  //let accessTokenjson=accessToken;

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(

      (position) => {
        const currentLongitude =
          JSON.stringify(position.coords.longitude);


        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        setCurrentLongitude(currentLongitude);

        setCurrentLatitude(currentLatitude);
        console.log("latitude,longitude", currentLatitude, currentLongitude);
        setlocation(false);
        setlocationboolean(false);
        // setverify(false);


      },
      (error) => {
        Alert.alert(error.message);
      },
      {
        enableHighAccuracy:false,
        timeout: 30000,
        //maximumAge: 1000
      },

    );


  };
  const launchcamera = async () => {

    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Example App Camera Permission',
          message: 'Example App needs access to your camera',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        }).then(image => {
          console.log(image);
          setImage(image.path);


        });
      } else {
        // Permission Denied
        alert('CAMERA Permission Denied');
      }
    } else {
      console.log("end");
    }
  }
  const nextprocess = () => {
    if (image === '' && photo === true) {
      alert("Please Take your Photo");

    } else if (image !== '' && photo === true) {
      if (accessToken !== '') {
        let punchnumber = 1;
        Confirmpunchin_fn(currentLatitude, currentLongitude, accessToken, punchnumber, image, photo)
          .then(function (response) {
            console.log(response);
            if(response.data.statusMsg === "SUCCESS"){
              console.log(response.data.statusMessage);
              setconfirm(!confirm);
            } else{
                Alert.alert("Alert",
                response.data.statusMessage,
                [{
                    text: "Ok",
                    onPress:()=>{
                      props.navigation.navigate("Bottomnavigator");
                    }
                },]);
              }
            
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    }
    else {
      if (accessToken !== '') {
        let punchnumber = 1;
        Confirmpunchin_fn(currentLatitude, currentLongitude, accessToken, punchnumber, image, photo)
          .then(function (response) {
            console.log(response);
            if (response.data.statusMsg === "User can't login more than 4 times") {
              Alert.alert("Alert",
                "User cannot punchin more than 4 times",
                [{
                  text: "Ok",
                  onPress: () => {
                    AsyncStorage.removeItem('Punchin');
                    props.navigation.navigate("Bottomnavigator");
                  }
                },]);
            }else{
              if(response.data.statusMsg === "SUCCESS"){
                console.log(response.data.statusMsg);
                setconfirm(!confirm);
              } else{
                  Alert.alert("Alert",
                  response.data.statusMessage,
                  [{
                      text: "Ok",
                      onPress:()=>{
                        props.navigation.navigate("Bottomnavigator");
                      }
                  },]);
                }
            }
            


          })
          .catch(function (error) {
            console.log(error);
          })
      }
    }





  }
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
        });
      },
      error => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  }, [position]);
  const backscreen = (props) => {
    props.navigation.navigate('Bottomnavigator');
  }
  const back_btn = (props) => {
    props.navigation.navigate('Bottomnavigator', { confirm: 1 });
  }
//   const openCamera = (props) => {
//     props.navigation.navigate('Camera');
// }
  return (
    <View style={{ backgroundColor: 'white',flex:1 }}>
    
            <View style={styles.imagebackground}>
     <MapView
       // remove if not using Google Maps
       style={styles.map}
       provider={PROVIDER_GOOGLE} 
       region={position}
       followsUserLocation={true}
       showsCompass={true}
       scrollEnabled={true}
       zoomEnabled={true}
       pitchEnabled={true}
       rotateEnabled={true}
       initialRegion={position}
       showsUserLocation={true}
      showsMyLocationButton={true}
     >
      <MapView.Marker
        coordinate={{ latitude:position.latitude,
          longitude:position.longitude, }}>
       <View style={{width:40,height:40,backgroundColor:'white',justifyContent:'center',alignItems:'center',borderRadius:20,borderColor:'black',borderWidth:1}}>
       <Image
        source={icon_images==null?{uri:"https://img.icons8.com/ultraviolet/344/user.png"}:{uri: `data:image/png;base64,${icon_images}`}}
        style={{width:30, height:30,borderRadius:15}}
        resizeMode="center"
        resizeMethod="resize"
      />
       </View>

      </MapView.Marker>
     </MapView>
     
     <TouchableOpacity onPress={() => backscreen(props)} style={{backgroundColor:'white',width:40,height:40,borderRadius:40,justifyContent:"center",alignItems:"center",marginLeft:10,marginTop:10}}>
                    <Image source={require('../../Assets/left-arrow.png')} style={{ width: 25, height: 25, tintColor: '#5297F4',resizeMode:'cover' }} />
                </TouchableOpacity>
  
   </View>
      <View style={{ paddingLeft: 10,paddingTop:10,flex:0.7,marginTop:10,backgroundColor:'white',borderTopLeftRadius:20,borderTopRightRadius:20,borderColor:'white',elevation:10}}>

        <Text style={{ fontSize: RFPercentage(3), color: 'black' }}>
          Registering Login at,
        </Text>
        <View style={styles.date}>
          <Text style={{ fontSize: RFPercentage(3), color: '#5297F4', fontWeight: 'bold' }}>
            {currentDate}
          </Text>
        </View>
        {
          location ?
            <View style={styles.locationview}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <ActivityIndicator size="small" />
                <Text style={styles.locationtext}>
                  Fetching location data
                </Text>
              </View>

            </View> :
            <View style={styles.locationview}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={require('../../Assets/tick.png')} style={{ width: 25, height: 25 }} />

                <Text style={styles.locationtext}>
                  Location data received
                </Text>
              </View>
              {
                verify ?
                  <View style={styles.verifyview}>
                    <ActivityIndicator size="small" />
                    <Text style={styles.verifytext}>
                      Verifying location data
                    </Text>

                  </View> :
                  <View style={{ justifyContent: 'center', paddingTop: 20, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <Image source={require('../../Assets/tick.png')} style={{ width: 25, height: 25 }} />

                      <Text style={styles.verifytext}>
                        Location data verified
                      </Text>
                    </View>




                    {
                      back ?
                        confirm ?
                          <View style={{ paddingTop:10, justifyContent: 'center', alignItems: 'center',marginBottom:20,paddingBottom:10 }}>
                            {
                              photo ?
                                <View style={{alignItems:'center'}}>
                                  <View style={{ borderColor: 'black', width:150, borderRadius:10, marginTop: 5,}}>
                                    <View style={styles.modalViewinside}>

                                      {
                                        image !== '' ?
                                        <Image
                                          resizeMode="cover"
                                          resizeMethod="scale"
                                          style={{ width:150, height: 70, borderRadius:10, overflow: 'hidden',resizeMode:'cover' }}
                                          source={{
                                            uri: image,
                                          }}
                                        />:
                                        <Image source={{uri: 'https://img.icons8.com/ultraviolet/344/user.png'}} style={{width:140,height:70,overflow:'hidden',resizeMode:'center'}}/> 
                                        }

                                    </View>
                                  </View>
                                  
                                  <View style={{ paddingTop:20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                                   
                                   <TouchableOpacity onPress={()=>openCamera(props)}>
                                     <View style={styles.btnview}>
                                       <Text style={{ fontSize: RFPercentage(3), color: 'white' }}>
                                         Take photo
                                       </Text>
                                     </View>
                                  </TouchableOpacity>
                                 </View>
                                 <RNSlidingButton
                                      style={{
                                      width: 240
                                       }}
                                      height={35}
                                      onSlidingSuccess={nextprocess}
                                      slideDirection={SlideDirection.RIGHT}>
                                     <View>
                                      <Text numberOfLines={1} style={styles.titleText}>
                                       SLIDE RIGHT TO PUCHIN >
                                      </Text>
                                     </View>
                                     </RNSlidingButton>
                               </View> :
                                // <TouchableOpacity onPress={nextprocess}>
                                //   <View style={styles.btnview}>
                                //     <Text style={{ fontSize: RFPercentage(3), color: 'white' }}>
                                //       Confirm
                                //     </Text>
                                //   </View>
                                // </TouchableOpacity>
                               <View style={{flex:0.8,
                                justifyContent: 'flex-end',
                                marginBottom: 36,}}>
                                 <RNSlidingButton
                                      style={{
                                      width: 240
                                       }}
                                      height={35}
                                      onSlidingSuccess={nextprocess}
                                      slideDirection={SlideDirection.RIGHT}>
                                     <View>
                                      <Text numberOfLines={1} style={styles.titleText}>
                                       SLIDE RIGHT TO PUCHIN >
                                      </Text>
                                     </View>
                                     </RNSlidingButton>
                                </View>

                            }
                          </View> :
                          <View style={styles.punchintextview}>
                            <View style={styles.text3}>
                              <Image source={require('../../Assets/check.png')} style={{ width: 25, height: 25, }} />

                              <Text style={{ fontSize: RFPercentage(3), color: 'black', fontWeight: 'bold', paddingLeft: 20, color: 'green' }}>
                                Punch In registered Sucessfully

                              </Text>
                            </View>
                            <TouchableOpacity onPress={() => backscreen(props)}>
                              <View style={styles.backbtnview}>
                                <Text style={styles.backtext}>Back</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        :
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                          <View style={styles.text3}>
                            <Image source={{ uri: 'https://image.pngaaa.com/171/85171-middle.png' }} style={{ width: 25, height: 25 }} />

                            <Text style={{ fontSize: RFPercentage(3), color: 'black', fontWeight: 'bold', paddingLeft: 20, color: 'red' }}>
                              You are not in range

                            </Text>
                          </View>
                          <TouchableOpacity onPress={() => back_btn(props)}>
                            <View style={styles.btnview}>
                              <Text style={{ fontSize: RFPercentage(3), color: 'white' }}>
                                Back
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                    }


                  </View>



              }
            </View>


        }

      </View>
      {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../../Assets/imagebackground.png')} style={styles.imagebackground} />
      </View> */}
 

    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //justifyContent:'center',
    //alignItems:'center'
  },
  container_map: {
    ...StyleSheet.absoluteFillObject,
    width:200,
    height:200,
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius:20,
     backgroundColor:'red',
     
   },
   map: {
     ...StyleSheet.absoluteFillObject,
     height:385,
     backgroundColor:'black',
    
    // marginLeft:20
   },
  

  btnview: {
    borderColor: '#5297F4',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 40,


    backgroundColor: '#5297F4',
    borderRadius: 12




  },
  modalViewinside: {
    width:150,
    height:70,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'red',
    borderRadius:10,
    backgroundColor:'white',
    elevation:10
    //marginTop: -90
  },
  text3: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 30,
    width: WIDTH - 100,
    alignItems: 'center',
    paddingBottom: 20
    //paddingLeft:70

  },
  date: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
  locationview: {
    //flexDirection:'row',
    justifyContent: 'center',
    paddingTop: 20
  },
  locationtext: {
    fontSize: RFValue(17),
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 20
  },
  verifyview: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20
  },
  verifytext: {
    fontSize: RFValue(17),
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 20
  },
  backbtnview: {
    alignItems: 'center',
    paddingRight: 70,
    justifyContent: 'center',
    paddingLeft: 40,
    paddingTop: 20
  },
  employeeview: {
    justifyContent: 'flex-start',
    
    flexDirection: 'row',
    
},
  backtext: {
    fontSize: 17,
    color: '#5297F4',
    textDecorationLine: 'underline',
    textDecorationColor: '#5297F4'
  },
  punchintextview: {
    justifyContent: 'center',
    alignItems: 'center',
    //flex:0.3
  },
  imagebackground: {
    flex: 0.5,
    resizeMode: 'center',


  },
  mapcontainer: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 20,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',

  },
  title: {
    color: colors.blue,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
    justifyContent: "flex-start",
    alignItems: 'baseline'

},
titleText: {
  fontSize: 17,
  fontWeight: 'normal',
  textAlign: 'center',
  color: '#ffffff'
}
  


});

export default Registerlogin;