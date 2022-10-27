import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, Pressable, ToastAndroid, TouchableOpacity, RefreshControl } from "react-native";
import { colors } from "../../component/Colours";
import axios from "react-native-axios";
import { Leavelist_fn, Leavelist_pending_fn, leave_status_Leave_approve_fn, leave_status_Leave_reject_fn, Permissionlist_fn } from "../../API/Apifunctions";
import { getData } from "../../API/Devicestorage";
import moment from 'moment';
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Profile_modal from "../../component/Profile_modal";
import Rejectmodal from "../../component/Rejectmodal";


const Pending_request = (props) => {
    const [accessToken, setaccesstoken] = useState('');
    const [msg, setmessage] = useState('');
    const [input, setinput] = useState('');
    const [pageNo, setpageNo] = useState(1);
    const [pageSize, setpageSize] = useState(10);
    const [responsedata, setresponsedata] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [refreshToken, setrefreshtoken] = useState('');
    const [permission, setpermission] = useState(false);
    const [modalvisible, setmodalvisible] = useState(false);
    const [loading, setloading] = useState(true);
   
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
    const reject_fn = (props) => {
        setreject_field(true);
        if (msg !== '') {
            const Id = props.route.params.itemid;
            leave_status_Leave_reject_fn(accessToken, Id, msg)
                .then((response) => {
                    console.log(response);
                    if (response.data.statusMessage === "Success") {
                        props.navigation.navigate("Pending Request");
                    }else{
                        alert('error in updating');
                    }

                })
        }

        // props.navigation.navigate('Completed Leave');


    }
    useFocusEffect(
        React.useCallback(() => {
            getAccesstoken();
            getrefreshtoken();
            Leavelist_pending_fn(accessToken, pageNo, pageSize)
                .then(function (response) {
                    console.log('response', response);
                    setresponsedata(response.data.data);
                    setloading(false);
                    //console.log('responsedata', responsedata);
                })
                .catch(err => {
                    console.log('Error in axios', err);
                });
        }, [accessToken, refreshToken, pageNo, pageSize,])
    );
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const Aprrove_fn = (item_id) => {
        
        leave_status_Leave_approve_fn(accessToken, item_id)
            .then((response) => {
                console.log(response);
                if (response.data.statusMessage === "Success") {
                    ToastAndroid.show("Approved Successfully", ToastAndroid.SHORT);
                    onRefresh();
                }
            })
    }
    //Refreshing the flatlist
    const onRefresh = () => {
        setRefreshing(true);
        wait(1000)
            .then(() => {
                Leavelist_pending_fn(accessToken, pageNo, pageSize)
                    .then(function (response) {
                        console.log('response', response);
                        setresponsedata(response.data.data);
                        setloading(false);
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
        props.navigation.navigate("Admin_Status", { itemid: item });
    }
    const Modalopen = () => {
        setmodalvisible(!modalvisible);
    }
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    style={{ width: 70, height: 70, borderRadius: 70, overflow: 'hidden' }}
                    source={{ uri: 'https://support.lenovo.com/esv4/images/loading.gif' }}
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
                                                <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}>{item.createdUser.fullName}</Text>  has raised a Halfday Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> and its waiting for your approval.
                                                </Text> :
                                                item.requestType === "Leave" ?
                                                <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}>{item.createdUser.fullName}</Text>  has raised a Leave request for <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> and its waiting for your approval.
                                                </Text>:
                                                 <Text style={{ color: 'black', fontSize: RFPercentage(2) }}>
                                                 <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5) }}>{item.createdUser.fullName}</Text>  has raised a  <Text style={{ fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>{item.subject}</Text> and its waiting for your approval.
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
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <TouchableOpacity onPress={() => Leavestatus(item.id)} >
                                                <Text style={{ color: colors.blue, marginTop: 5, textDecorationLine: 'underline' }}>
                                                    Leave Details
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Text style={{ color: colors.blue, marginTop: 5, textDecorationLine: 'underline' }}>
                                                    Leave Report
                                                </Text>
                                            </TouchableOpacity>


                                        </View>
                                        <View style={{ flexDirection: 'row-reverse', marginHorizontal: 10, marginTop: 10, marginBottom: 10 }}>
                                            <TouchableOpacity onPress={()=>Aprrove_fn(item.id)}>
                                                <View style={{ backgroundColor: '#50C878', width: 60, borderColor: colors.light_slate_gray, height: 30, marginHorizontal: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                    {/* <Image source={{uri:'https://www.citypng.com/public/uploads/preview/-31622591288o404eftvwa.png'}} style={{width:20,height:20,resizeMode:'center'}}/> */}
                                                    <Text style={{ color: 'white',fontWeight:'bold' }}>Approve</Text>

                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>Modalopen()}>
                                                <View style={{ backgroundColor: '#FA5F55', width: 60, borderColor: colors.light_slate_gray, height: 30, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ color: 'white',fontWeight:'bold' }}>Reject</Text>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                        <Rejectmodal
                                        modalvisible={modalvisible}
                                        onSwipeComplete={Modalopen}
                                        onChangeText={(value)=>setmessage(value)}
                                        ref={(input)=>setinput(input)}
                                        btn1={()=>input.clear()}
                                        btn2={reject_fn}
                                        />
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

        marginTop:5,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 10,
        marginBottom:5
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
export default Pending_request;