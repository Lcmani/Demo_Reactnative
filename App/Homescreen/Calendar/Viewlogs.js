import React, { useEffect, useState } from "react";
import { View, Text, Image,StyleSheet, TouchableOpacity, FlatList, Dimensions } from "react-native";
import axios from "react-native-axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, setData } from "../../API/Devicestorage";
import { refreshtoken_fn, viewlogs_fn } from "../../API/Apifunctions";
import { RFPercentage } from "react-native-responsive-fontsize";
import moment from "moment";


const Viewlog = (props) => {
    const[data,setdata]=useState([]);
    const[day,setday]=useState('');
    const[accessToken,setaccesstoken]=useState('');
      const [refreshToken, setrefreshtoken] = useState('');
    const[logs,setlogs]=useState([]);
    const[hours,sethours]=useState('');
    const getAccesstoken = async () => {
        await getData("accesstoken")
          .then(data => data)
          .then(value => {
    
           // console.log(" Value:  " + value);
            setaccesstoken(value);
    
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

    useEffect(()=>{
       getAccesstoken();
       getrefreshtoken(); 
        try {
            AsyncStorage.getItem('date')       
                  .then(value => {
                      if (value != null) {
                        // let dayparesed= JSON.parse(value)
                          setday(value);
                         console.log(day);
                         
      
                      }
                      
                  })
      
          }
          catch (error) {
            console.log(error);
        }
        if(accessToken !==''&&day !==''){
            viewlogs_fn(day, accessToken)
            .then(function (response) {
                console.log(response);
               
                    setdata(response.data.data.date);
                    sethours(response.data.data.hours);
                    console.log(data);
                    setlogs(response.data.data.logs);
                  
            })
            .catch((error)=>{
                   console.log("Error in view logs",error);
            }
            )
     
        }
      
    },[accessToken,refreshToken,day])
 
    const backscreen = (props) => {
       // AsyncStorage.removeItem('date');
        props.navigation.navigate('Bottomnavigator');
    }
   
const image1='https://www.vhv.rs/dpng/d/191-1916832_down-2-arrow-computer-icons-arrow-down-left.png';
const image2='https://www.seekpng.com/png/detail/432-4321410_thin-left-up-arrow-svg-png-icon-free.png';
    return (


        <View style={{ flex: 1 ,backgroundColor:'white'}}>

                <View style={{ justifyContent: 'flex-start', paddingTop:20, flexDirection: 'row', paddingLeft: 10, }} >
                    <TouchableOpacity onPress={() => backscreen(props)}>
                        <Image source={require('../../Assets/left-arrow.png')} style={{ width: 25, height: 25, tintColor: '#5297F4', resizeMode: 'cover' }} />
                    </TouchableOpacity>
                    <Text style={{ color: '#5297F4', fontSize:RFPercentage(3), fontWeight: 'bold', paddingLeft: 10 }}>{moment(data).format("DD-MM-YYYY")}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20 }} >
                    <Text style={{ fontSize: 45,color:'black' }}>{hours} <Text>hr</Text></Text>
                </View>
                <View style={{flex:0.97}}>
                    <FlatList
                        keyExtractor={({id},index) => id}
                        data={logs}
                        renderItem={({ item }) => (
                            <View style={styles.flatlistview}>
                                <View style={{ paddingRight: 15, paddingTop: 15, }}>
                                <Image source={item.isLogged===0 ?{uri:image2}:{uri:image1}} style={{ width: 40, height: 25, resizeMode: 'contain',  }} />
                                </View>
                                <View style={{ flexDirection: 'column', }}>
                                    <View style={{flexDirection:'row'}}>
                                    <Text style={{ fontSize:RFPercentage(2.3), color: "#5297F4", fontWeight: 'bold', }}>{moment(item.date).format('yyyy MMM DD') } ,</Text>
                                    <Text style={{ fontSize: RFPercentage(2.3), color: "#5297F4", fontWeight: 'bold', }}> {item.time}</Text>
                                    </View>
                                    <Text style={{ fontSize: RFPercentage(2) ,color:'black'}}>{item.createdBy}</Text>
                                </View>
                            </View>
                        )}
                    />

                </View>         
        </View>

    );
}
const styles = StyleSheet.create({
    flatlistview: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
       paddingBottom:10,
       paddingTop:10,
        borderWidth: 1,
        borderColor: '#F6F6F6',
        backgroundColor:'#F6F6F6',
        marginVertical: 5,
        elevation: 10,
        //width:WIDTH-35,
        marginLeft:20,
        marginRight:20
    }

});
export default Viewlog;