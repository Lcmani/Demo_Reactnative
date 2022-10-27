import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, ToastAndroid } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../../component/Colours";
const WIDTH = Dimensions.get('window').width;
import { getData } from "../../API/Devicestorage";

import axios from "react-native-axios";
import { leaverequest, leave_status_fn, leave_status_Leave_cancel_fn } from "../../API/Apifunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFPercentage } from "react-native-responsive-fontsize";
import moment from "moment";



const Leave_Detail = (props) => {
    const [accessToken, setaccesstoken] = useState('');
    const [responsedata, setresponsedata] = useState({});
    const [approve, setapprove] = useState();
    const [reject, setreject] = useState();
    const [refreshToken, setrefreshtoken] = useState('');
    const [cancel, setcancel] = useState();
    const [statusId, setstatusId] = useState();
    const [pending, setpending] = useState();
    const [requesttime, setrequesttime] = useState('');
    const [boolean, setboolean] = useState(false);
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
                // console.log(" Value:  " + value);
                setrefreshtoken(value);
            })
            .catch(err => console.log(err))

    }

    const getUserData = async () => {
        const Id = props.route.params.itemid;
        leave_status_fn(accessToken, Id)
            .then(function (response) {
                console.log('response in getuserdata function', response);
                var data = response.data.data;
                if (accessToken !== '') {

                    setresponsedata(data);
                    setrequesttime(response.data.data.requestTime);
                    if (requesttime === undefined) {
                        setboolean(false);
                    } else {
                        setboolean(true);
                    }
                    console.log("In if statement", responsedata);
                    if (response.data.data.masterStatus.statusName === "Pending") {
                        // setapprove(false);
                        // setreject(false);
                        // setcancel(false);
                        setpending(true);
                        console.log('STATUSName', response.data.data.masterStatus.statusName);
                        console.log("Pending", approve);
                        setstatusId(3);

                    } else if (response.data.data.masterStatus.statusName === "Approved") {
                        setapprove(true);
                        setstatusId(1);

                        console.log("Approved");
                    } else if (response.data.data.masterStatus.statusName === "Cancelled") {
                        // setapprove(false);
                        // setreject(false);
                        setcancel(true);
                        console.log("Cancelled");
                        setstatusId(4);
                    } else {
                        //setapprove(false);
                        setreject(true);

                        console.log("Rejected");
                        setstatusId(2);
                    }
                } else {
                    console.log("In else statement");

                    ToastAndroid.show("Loading...", ToastAndroid.LONG);
                }


            })
            .catch(function (error) {
                console.log(error);
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                throw error;


            })
    }
    useEffect(() => {
        getAccesstoken();
        getrefreshtoken();
        if (accessToken !== '') {
            getUserData();
        } else {
            console.log("In else statement in useeffect");

            ToastAndroid.show("Loading...", ToastAndroid.LONG);
        }
        if (boolean) {
            getUserData();
        }
    }, [accessToken, approve, reject, cancel, boolean]);
    const backscreen = (props) => {
        props.navigation.navigate('Leave  Status');
    }
    const reschedule = (props) => {
        try {
            AsyncStorage.setItem("reschedule", JSON.stringify(responsedata));
        }
        catch {
            console.log("Error in storing the reschedule ");
        }


        props.navigation.navigate('Leave form');

    }
    const leavecancel = (props) => {
        const Id = props.route.params.itemid;

        leave_status_Leave_cancel_fn(accessToken, Id, statusId)
            .then((response) => {
                console.log(response);
                if (response.data.statusMessage === "Success") {
                    props.navigation.navigate("Leave  Status");
                }

            })
    }
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.employeeview} >
                <TouchableOpacity onPress={() => backscreen(props)}>
                    <Image source={require('../../Assets/left-arrow.png')} style={{ width: 25, height: 25, tintColor: '#5297F4', }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={styles.emp_title}>Status</Text>
                    <View style={{ paddingRight: 10 }}>
                        <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width: 100, height: 30, resizeMode: 'cover' }} />
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: 'center', flex: 1 }}>
                <View style={styles.card}>
                    <View style={{ alignItems: 'center', marginBottom: 5 }}>
                        {
                            responsedata.requestType === null ?
                                <Text style={{ color: colors.blue, fontSize: RFPercentage(3.3), fontWeight: '800' }}>

                                </Text> :
                                <Text style={{ color: colors.blue, fontSize: RFPercentage(3.3), fontWeight: '800' }}>
                                    {responsedata.requestType}
                                </Text>
                        }
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                Sub
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                {responsedata.subject}
                            </Text>
                        </View>

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                Request Date
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                {moment(responsedata.requestDate).format("DD-MM-YYYY")}
                            </Text>
                        </View>

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                Request Time
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            {
                                responsedata.requestTime !== null &&
                                <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                    {requesttime}
                                </Text>
                            }
                        </View>


                    </View>
                    {responsedata.requestType === "Permission" ?
                        <View>
                            <View style={styles.parent_scrollview}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                        Permission Date
                                    </Text>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                        :
                                    </Text>
                                </View>
                                <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                    {moment(responsedata.fromDate).format("DD-MM-YYYY")}
                                </Text>
                            </View>
                            <View style={styles.parent_scrollview}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                        Permission Time
                                    </Text>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                        :
                                    </Text>
                                </View>
                                <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                    {responsedata.fromTime} to {responsedata.toTime}
                                </Text>
                            </View>
                            <View style={styles.parent_scrollview}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                        Total Permission Time
                                    </Text>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                        :
                                    </Text>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                        {responsedata.hoursCount} hrs
                                    </Text>
                                </View>

                            </View>
                            {
                                reject === true &&
                                <View>
                                    <View style={styles.parent_scrollview}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                                Rejected Time
                                            </Text>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                                :
                                            </Text>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                                {responsedata.actionTime}
                                            </Text>
                                        </View>

                                    </View>
                                    <View style={styles.parent_scrollview}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                                Reject Reason
                                            </Text>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                                :
                                            </Text>
                                        </View>
                                        <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                            {responsedata.rejectReason}
                                        </Text>
                                    </View>
                                </View>
                            }
                        </View>
                        :
                        <View>
                            <View style={styles.parent_scrollview}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                        Leave Date
                                    </Text>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                        :
                                    </Text>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                        {moment(responsedata.fromDate).format("DD-MM-YYYY")} to {moment(responsedata.toDate).format("DD-MM-YYYY")}
                                    </Text>
                                </View>

                            </View>
                            {
                                responsedata.requestType==="HalfDay"?
                                <View style={styles.parent_scrollview}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                        Section
                                    </Text>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                        :
                                    </Text>
                                </View>
                               {
                                   responsedata.leaveStatus==="2nd Half"?
                                   <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                   Afternoon     
                               </Text>:
                                <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                Forenoon                               
                            </Text>
                               }

                            </View>:
                                <View style={styles.parent_scrollview}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                        Total no.of Days
                                    </Text>
                                    <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                        :
                                    </Text>
                                </View>
                                {
                                    responsedata.leaveCount === 1 ?
                                        <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                            {responsedata.leaveCount} day
                                            
                                        </Text>
                                        :
                                        <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                            {responsedata.leaveCount} days
                                        </Text>
                                }

                            </View>
                            }
                          
                            {
                                reject === true &&
                                <View>
                                    <View style={styles.parent_scrollview}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                                Rejected Time
                                            </Text>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                                :
                                            </Text>
                                        </View>
                                        <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                            {responsedata.actionTime}
                                        </Text>
                                    </View>
                                    <View style={styles.parent_scrollview}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                                Reject Reason
                                            </Text>
                                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                                :
                                            </Text>
                                        </View>
                                        <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                            {responsedata.rejectReason}
                                        </Text>
                                    </View>
                                </View>
                            }
                            <View style={{ justifyContent: 'space-around', paddingTop: 20, paddingLeft: 5, paddingRight: 5 }}>
                                <Text style={styles.title2}>
                                    Message
                                </Text>
                                <KeyboardAwareScrollView>
                                    <Text style={styles.input_editbox3} >
                                        Hi Sir,
                                    </Text>
                                    <Text style={{ paddingLeft: 10, color: 'black', fontSize: RFPercentage(2.3) }}>
                                        {responsedata.leaveReason}
                                    </Text>
                                </KeyboardAwareScrollView>
                            </View>
                        </View>
                    }
                    {
                        approve === true &&
                        <View style={styles.parent_scrollview}>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10, width: 150 }}>
                                    Approved Time
                                </Text>
                                <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                    :
                                </Text>
                            </View>
                            <Text style={{ textAlign: 'left', fontSize: RFPercentage(2.3), color: "black", fontWeight: '400', padding: 10, width: 180 }}>
                                {responsedata.actionTime}
                            </Text>
                        </View>
                    }
                    {
                        approve === true &&
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                            <View style={styles.btnview}>
                                <Text style={{ fontSize: RFPercentage(2.5), color: 'white' }}>
                                    Approval
                                </Text>
                            </View>
                        </View>
                    }
                    {
                        reject === true &&
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                            <View style={styles.btnviewinreject}>
                                <Text style={{ fontSize: RFPercentage(2.5), color: 'white' }}>
                                    Rejected
                                </Text>
                            </View>
                        </View>
                    }
                    {
                        cancel === true &&
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                            <View style={styles.btnviewinreject}>
                                <Text style={{ fontSize: RFPercentage(2.5), color: 'white' }}>
                                    Cancelled
                                </Text>
                            </View>
                        </View>
                    }
                    {
                        pending === true &&
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                            <View style={styles.btnviewinpending}>
                                <Text style={{ fontSize: RFPercentage(2.5), color: 'white' }}>
                                    Pending
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: Dimensions.get("screen").width - 35, justifyContent: 'space-between' }}>
                                {
                                    responsedata.requestType === "Permission" ?
                                        <TouchableOpacity onPress={() => leavecancel(props)}>
                                            <View style={styles.btnviewinleavecancel}>
                                                <Text style={{ fontSize: RFPercentage(2.5), color: 'white' }}>
                                                    Permission Cancel
                                                </Text>
                                            </View>
                                        </TouchableOpacity> :
                                        <TouchableOpacity onPress={() => leavecancel(props)}>
                                            <View style={styles.btnviewinleavecancel}>
                                                <Text style={{ fontSize: RFPercentage(2.5), color: 'white' }}>
                                                    Leave Cancel
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={() => reschedule(props)}>
                                    <View style={styles.btnviewinreschedule}>
                                        <Text style={{ fontSize: RFPercentage(2.5), color: 'white' }}>
                                            Reschedule
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>


                        </View>

                    }


                </View>
            </View>

        </ScrollView>

    );
}
const styles = StyleSheet.create(

    {
        employeeview: {
            justifyContent: 'flex-start',
            paddingTop: 30,
            flexDirection: 'row',
            paddingLeft: 5,
            paddingBottom: 40,
            backgroundColor: 'white'
        },
        emp_title: {
            color: colors.blue,
            fontSize: 20,
            fontWeight: 'bold',
            paddingLeft: 5,
            justifyContent: "flex-start",
            alignItems: 'baseline'

        },
        card: {
            borderColor: '#F6F6F6',
            borderWidth: 1,
            borderRadius: 7,
            backgroundColor: 'white',
            borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 20,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            paddingTop: 20,
            paddingBottom: 10,
            //flex: 0.8,
            justifyContent: 'center',
            paddingBottom: 20,



        },
        input_editbox3: {
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            color: 'black',
            fontSize: RFPercentage(2.3)

        },
        title2: {
            color: colors.blue,
            fontSize: RFPercentage(2.3),
            marginHorizontal: 10,
            marginLeft: 10,
            marginRight: 30,
            fontWeight: 'bold'

        },
        parent_scrollview: {
            flexDirection: 'row',
            alignItems: 'baseline',
            paddingLeft: 5

        },

        btnview: {
            borderColor:colors.green,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: WIDTH - 220,
            height: 40,
            backgroundColor:colors.green,
            borderRadius: 12,


        },
        btnviewinpending: {
            borderColor: '#FFD700',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: WIDTH - 220,
            height: 40,
            backgroundColor: '#FFD700',
            borderRadius: 7,
            marginBottom: 10

        },
        btnviewinleavecancel: {
            borderColor: colors.blue,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 140,
            height: 50,
            backgroundColor: colors.blue,
            borderRadius: 7,
            marginBottom: 10,
            //marginRight:20

        },
        btnviewinreschedule: {
            borderColor: colors.blue,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 140,
            height: 45,
            backgroundColor: colors.blue,
            borderRadius: 7,
            marginBottom: 10

        },
        btnviewinreject: {
            borderColor:colors.red,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: WIDTH - 220,
            height: 40,
            backgroundColor:colors.red,
            borderRadius: 7,

        }
    }
);
export default Leave_Detail;