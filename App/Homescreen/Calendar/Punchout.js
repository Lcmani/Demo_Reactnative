import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet, Dimensions, BackHandler, TouchableOpacity, ScrollView, PermissionsAndroid, Platform, Alert } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import { Confirmpunchin_fn_punchout,refreshtoken_fn, userdata} from "../../API/Apifunctions";
import { getData } from "../../API/Devicestorage";
import ImagePicker, { openCamera } from 'react-native-image-crop-picker';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../component/Colours";
import MapView ,{ PROVIDER_GOOGLE } from 'react-native-maps';
import Slider from 'react-native-slide-to-unlock';
import { useFocusEffect } from "@react-navigation/native";
import jwtDecode from "jwt-decode";
const Registeringlogout = (props) => {
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
  const[accessToken,setaccesstoken]=useState('');
  const [refreshToken, setrefreshtoken] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [back, setback] = useState();
  const [locationboolean, setlocationboolean] = useState(true);
  const [range, setrange] = useState();
  const [images, setImages] = useState('');
  const [isVisbleImage, setIsVisbleImage] = useState(false);

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
  
    }, [accessToken,images,isVisbleImage])
  );
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
      //  console.log(" Value:  " + value);
        setrefreshtoken(value);
      })
      .catch(err => console.log(err))

  } 
useEffect(() => {
    getAccesstoken();
    getrefreshtoken();

  var date = moment()
  .utcOffset('+05:30')
  .format('DD MMM YYYY ,hh:mm a');
setCurrentDate(date);

    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
       // subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        
            getOneTimeLocation();
            //subscribeLocationLocation();
           
           
           
          } else {
            console.log("else block");
            Alert.alert('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
  
    requestLocationPermission();
    
  }, [accessToken,location,refreshToken]);

  const getOneTimeLocation = () => {
    
    Geolocation.getCurrentPosition(
   
      (position) => {

        
    
        const currentLongitude = 
          JSON.stringify(position.coords.longitude);

       
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);


      
        setCurrentLongitude(currentLongitude);
        
        
  
        setCurrentLatitude(currentLatitude);
        setlocation(false);
         
      },
      (error) => {
        console.log("else block");
        Alert.alert('Permission Denied');
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };
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
  const nextprocess = () => {
    if(accessToken!==''){  
  
      let punchnumber = 0;
      Confirmpunchin_fn_punchout(currentLatitude,currentLongitude,accessToken,punchnumber)
        .then(function (response) {
          console.log(response);
          if(response.data.statusMsg==="SUCCESS"){
            setconfirm(!confirm);
          }else{
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
    const backscreen = (props) => {
      const num='1'
        props.navigation.navigate('Bottomnavigator',{punchout_confirm:num});


    }
  
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
        longitude:position.longitude, }} 
>
<View style={{width:40,height:40,backgroundColor:'white',justifyContent:'center',alignItems:'center',borderRadius:20,borderColor:'black',borderWidth:1}}>
       <Image
        source={images==null?{uri:"https://img.icons8.com/ultraviolet/344/user.png"}:{uri: `data:image/png;base64,${images}`}}
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
                    Registering Logout at,
                </Text>
                <View style={styles.date}>
                    <Text style={{ fontSize: RFPercentage(3), color: '#5297F4', fontWeight: 'bold' }}>
                        {currentDate}
                    </Text>
                </View>

                {location ?
                    <View style={styles.locationview}>
                        <ActivityIndicator size="small" />
                        <Text style={styles.locationtext}>
                            Fetching location data
                        </Text>

                    </View> :
                    <View style={{ justifyContent: 'center', paddingTop: 10,flex:1}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image source={require('../../Assets/tick.png')} style={{ width: 25, height: 25 }} />

                            <Text style={styles.locationtext}>
                                Location data received
                            </Text>
                        </View>
                        {
                            confirm ?
                                <View style={{ paddingTop: 30, justifyContent:'center',alignItems:'center',flex:0.9,
                                justifyContent: 'flex-end',
                                marginBottom: 36,
                                 }}>
                                   
                                    <Slider
                                  childrenContainer={{ backgroundColor:colors.blue }}
                                  onEndReached={nextprocess}
                                  containerStyle={{
                                    marginLeft:10,
                                    marginRight:10,
                                    backgroundColor:colors.blue,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width:350,
                                    height:60
                                  }}
                                  sliderElement={
                                    <Image
                                      style={{
                                        width: 50,
                                        margin: 4,
                                        borderRadius: 5,
                                        height: 50,
                                        marginLeft:5,
                                        marginRight:10
                                      }}
                                      source={{
                                        uri:
                                          'https://img.icons8.com/flat-round/344/wide-long-right-arrow.png',
                                      }}
                                    />
                                  }
                                >
                                  <Text style={{color:'white',fontSize:RFPercentage(2.5)}}>{'Swipe Right to Puchout'}</Text>
                                </Slider>
                                </View> :
                                <View>
                                    <View style={{justifyContent:'center',alignItems:'center'}}>
                                    <View style={styles.text3}>
        
                                        <Image source={require('../../Assets/check.png')} style={{ width: 25, height: 25, }} />

                                        <Text style={{ fontSize:RFPercentage(3), color: 'black', fontWeight: 'bold', paddingLeft: 20, color: 'green' }}>
                                            Punch Out registered Sucessfully

                                        </Text>
                                    </View>
                                    </View>
                                    <TouchableOpacity onPress={() => backscreen(props)}>
                                        <View style={styles.backbtnview}>
                                            <Text style={styles.backtext}>Back</Text>
                                        </View>
                                    </TouchableOpacity>

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
    width:200,
    height: 120,
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
    flexDirection:'row',
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
  


});

export default Registeringlogout;