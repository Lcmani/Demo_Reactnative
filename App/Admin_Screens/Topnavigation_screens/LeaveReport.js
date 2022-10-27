import React, { useEffect, useState } from "react";
import { View, Text, Image,StyleSheet, TouchableOpacity, FlatList, Dimensions } from "react-native";
import axios from "react-native-axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from "../../API/Devicestorage";
import { RFPercentage } from "react-native-responsive-fontsize";
import moment from "moment";
import { Leavereport_fn } from "../../API/Apifunctions";
import jwtDecode from "jwt-decode";


const LeaveReport = (props) => {
    const[data,setdata]=useState([]);
    const[day,setday]=useState('');
    const[accessToken,setaccesstoken]=useState('');
      const [refreshToken, setrefreshtoken] = useState('');
    const[logs,setlogs]=useState([]);
    const [pageNo, setpageNo] = useState(1);
    const [pageSize, setpageSize] = useState(10);
  
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
        if(accessToken !==''){
            let decode=jwtDecode(accessToken);
            Leavereport_fn(pageNo,pageSize, accessToken,decode.id)
            .then(function (response) {
                console.log(response);
               
                    // setdata(response.data.data);
                   
                    // setlogs(response.data.data.logs);
                  
            })
            .catch((error)=>{
                   console.log("Error in view logs",error);
            }
            )
     
        }
      
    },[accessToken,refreshToken,pageNo,pageSize])
    const onScrollHandler = () => {
        setpageSize(pageSize + 10);
    }
    const backscreen = (props) => {
        props.navigation.navigate('Pending Request');
    }
   

    return (


        <View style={{ flex: 1 ,backgroundColor:'white'}}>

                <View style={{ justifyContent: 'flex-start', paddingTop:20, flexDirection: 'row', paddingLeft: 10, }} >
                    <TouchableOpacity onPress={() => backscreen(props)}>
                        <Image source={require('../../Assets/left-arrow.png')} style={{ width: 25, height: 25, tintColor: '#5297F4', resizeMode: 'cover' }} />
                    </TouchableOpacity>
                    <Text style={{ color: '#5297F4', fontSize:RFPercentage(3), fontWeight: 'bold', paddingLeft: 10 }}>Back</Text>
                </View>
                
                <View style={{flex:0.97}}>
                <FlatList
                    onEndReached={onScrollHandler}
                    onEndThreshold={0}
                    keyExtractor={(item) => item.id}
                    data={logs}
                    // refreshControl={
                    //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    // }
                    renderItem={({ item }) => (
                        <View>
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
export default LeaveReport;