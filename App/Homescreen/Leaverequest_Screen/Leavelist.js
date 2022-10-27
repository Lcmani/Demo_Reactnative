import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator,RefreshControl} from "react-native";
import { colors } from "../../component/Colours";
import axios from "react-native-axios";
import { Leavelist_fn } from "../../API/Apifunctions";
import { getData } from "../../API/Devicestorage";
import moment from 'moment';
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
const Leavelist = (props) => {
    const [accessToken, setaccesstoken] = useState('');
    const [pageNo, setpageNo] = useState(1);
    const [pageSize, setpageSize] = useState(10);
    const [responsedata, setresponsedata] = useState({});
    const [refreshing, setRefreshing] =useState(false);
    const [refreshToken, setrefreshtoken] = useState('');
    const[permission,setpermission]=useState(false);
    const[loading,setloading]=useState(true);

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
          //  console.log(" Value:  " + value);
            setrefreshtoken(value);
          })
          .catch(err => console.log(err))
    
      }
      useFocusEffect(
        React.useCallback(() => {
            getAccesstoken();
            getrefreshtoken();
            Leavelist_fn(accessToken,pageNo,pageSize)
            .then(function (response) {
                console.log('response', response);
                setresponsedata(response.data.data);
                setloading(false);
                //console.log('responsedata', responsedata);
            })
            .catch(err => {
                console.log('Error in axios', err);
            });
        }, [accessToken,refreshToken,pageNo,pageSize,])
      );
      const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    //Refreshing the flatlist
    const onRefresh = () => {
        setRefreshing(true);
        wait(1000)
            .then(() => {
                Leavelist_fn(accessToken,pageNo,pageSize)
                .then(function (response) {
                    console.log('response', response);
                    setresponsedata(response.data.data);
                   // console.log('responsedata', responsedata);
                })
                .catch(err => {
                    console.log('Error in axios', err);
                });
                setRefreshing(false);

            });
    }
    const onScrollHandler = () => {
        setpageSize(pageSize + 10);
    }
    const Leavestatus = (item) => {
        props.navigation.navigate("Leave Detail", { itemid: item });
    }
    if(loading){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           
            <Image
                                     resizeMode="cover"
                                     resizeMethod="scale"
                                     style={{ width:70, height:70, borderRadius: 70, overflow: 'hidden' }}
                                     source={{ uri:'https://support.lenovo.com/esv4/images/loading.gif' }}
                                 />
            </View>
          );
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 0.9 }}>
                <FlatList
                    onEndReached={onScrollHandler}
                    onEndThreshold={0}
                    keyExtractor={(item) => item.id}
                    data={responsedata}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({ item }) => (

                        <View style={{ backgroundColor: '#f2f3f9' }}>

                        <View style={styles.card}>
                            <View style={{ marginTop: 10, marginLeft: 5, flexDirection: 'row' }}>

                                {
                                    item.createdUser.image === null ? <Image style={styles.pic} source={{ uri: 'https://img.icons8.com/ultraviolet/344/user.png' }} />
                                        :
                                        item.createdUser.image !== null && <Image source={{ uri: `data:image/png;base64,${item.createdUser.image}` }} style={styles.pic} />
                                }
                                <View style={{ flexDirection: "column", marginLeft: 10, marginRight: 10, width: 300, }}>
                                    {
                                        item.requestType === "HalfDay" ?
                                        item.masterStatus.statusName==='Pending'?
                                            <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a Halfday Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is in <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                            </Text>:
                                             item.masterStatus.statusName==='Approved'?
                                             <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                             <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a Halfday Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                         </Text>:
                                          item.masterStatus.statusName==='Cancelled'?
                                          <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                             <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a Halfday Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                         </Text>:
                                         <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                             <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a Halfday Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                         </Text>
                                          :
                                            item.requestType === "Leave" ?
                                            item.masterStatus.statusName==='Pending'?
                                            <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is in <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                            </Text>:
                                             item.masterStatus.statusName==='Approved'?
                                             <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                             <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                         </Text>:
                                          item.masterStatus.statusName==='Cancelled'?
                                          <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                             <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                         </Text>:
                                         <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                             <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                         </Text>
                                             :
                                             item.masterStatus.statusName==='Pending'?
                                             <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                                 <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a  <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is in <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                             </Text>:
                                              item.masterStatus.statusName==='Approved'?
                                              <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                              <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a  <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                          </Text>:
                                           item.masterStatus.statusName==='Cancelled'?
                                           <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                              <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                          </Text>:
                                          <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                              <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}></Text>You have raised a <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> is <Text style={{color:item.masterStatus.statusName==='Approved'?"green":item.masterStatus.statusName==='Pending'?'#FFD700':'red',fontWeight:'bold',fontSize:RFPercentage(2.3)}}>{item.masterStatus.statusName}.</Text> 
                                          </Text>
                                    }

                                    <Text style={{ marginTop: 5, fontWeight: '500' }}>
                                        {moment(item.date).format('yyyy MMM DD')},{item.requestTime}
                                    </Text>
                                    <View style={{ flexDirection: 'column' }}>

                                        {
                                            item.requestType === "HalfDay" ?
                                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                                        Date :
                                                    </Text>
                                                    <Text style={{ paddingTop: 3, fontWeight: '600' }}>
                                                        {moment(item.fromDate).format('DD-MM-YYYY')} to {moment(item.toDate).format('DD-MM-YYYY')}
                                                    </Text>
                                                </View>:
                                                item.requestType === "Leave"?
                                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                                        Date :
                                                    </Text>
                                                    <Text style={{ paddingTop: 3, fontWeight: '600' }}>
                                                        {moment(item.fromDate).format('DD-MM-YYYY')} to {moment(item.toDate).format('DD-MM-YYYY')}
                                                    </Text>
                                                </View>

                                                :
                                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                                        Time :
                                                    </Text>
                                                    <Text style={{ paddingTop: 3, fontWeight: '600' }}>
                                                        {item.fromTime} to {item.toTime}
                                                    </Text>
                                                </View>
                                        }

                                        {
                                            item.requestType === "HalfDay" ?
                                                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                                        Days :
                                                    </Text>
                                                    <Text style={{ paddingTop: 3, fontWeight: '600' }}>
                                                        {item.leaveCount}
                                                    </Text>
                                                </View> :
                                                item.requestType === "Leave" ?
                                                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                                            Days :
                                                        </Text>
                                                        <Text style={{ paddingTop: 3, fontWeight: '600' }}>
                                                            {item.leaveCount}
                                                        </Text>
                                                    </View>
                                                    :
                                                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                                        Total :
                                                    </Text>
                                                    <Text style={{ paddingTop: 2, fontWeight: '600' }}>
                                                        {item.hoursCount}
                                                    </Text>
                                                </View>
                                        }

                                    </View>
                                    <View style={{  justifyContent: 'center',marginBottom:20 }}>
                                        <TouchableOpacity onPress={() => Leavestatus(item.id)} >
                                            <Text style={{ color: colors.blue, marginTop: 5, textDecorationLine: 'underline' }}>
                                                View Details
                                            </Text>
                                        </TouchableOpacity>
                                        


                                    </View>
                                    
                                </View>
                            </View>
                            {/* </View>flexDirection:row */}


                        </View>
                    </View>
                    )}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {

        marginTop: 10,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 10,
        marginBottom: 10
    },
    pic: {
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    title2: {
        color: colors.blue,
        fontSize: RFPercentage(1.7),
        //  marginHorizontal: 10,
        marginLeft: 10,
        width: 90,
        marginVertical: 2,
        fontWeight: 'bold',

    },
    title3: {
        color: "black",
        fontSize: RFPercentage(1.7),
        marginHorizontal: 2,
        fontWeight: 'bold',
        width: 160,
        marginVertical: 2


    },
    btnview: {
        borderColor: '#6B8E23',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 40,
        backgroundColor: '#6B8E23',
        borderRadius: 7,

    },
    btnviewinpending: {
        borderColor: '#FFD700',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 40,
        backgroundColor: "#FFD700",
        borderRadius: 7,

    },
    btnviewinreject: {
        borderColor: 'red',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 40,
        backgroundColor: 'red',
        borderRadius: 7,

    }
});
export default Leavelist;