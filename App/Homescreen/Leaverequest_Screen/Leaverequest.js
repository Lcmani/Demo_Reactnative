import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Dimensions, Alert, TouchableOpacity, Pressable, Image, ToastAndroid, ScrollView, RefreshControl } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../../component/Colours";
const WIDTH = Dimensions.get('window').width;
import { getData } from "../../API/Devicestorage";
import { leaverequest, refreshtoken_fn, leaverequest_Permission, leaverequest_Permission_reshedule, Permission_leaverequest_, leaverequest_reschedule } from "../../API/Apifunctions";
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFPercentage } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment_range = extendMoment(Moment);
//const moment_time = extendMoment(Moment);
import { RadioButton } from 'react-native-paper';


const Leaverequest = (props) => {
  const [fromdate, setfromdate] = useState();
  const [input, setinput] = useState('');
  const [todate, settodate] = useState('');
  const [sub, setsub] = useState('');
  const [msg, setmessage] = useState('');
  const [accessToken, setaccesstoken] = useState('');
  const [refreshToken, setrefreshtoken] = useState('');
  const [date, setDate1] = useState('');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [Per_date, setShow_Per_date] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [to_date, settoDate] = useState('');
  const [to_show, settoShow] = useState(false);
  const [textshow, settextshow] = useState(true);
  const [textshow2, settextshow2] = useState(true);
  const [schedule1, setschedule1] = useState(false);
  const [sub_reshedule, setsub_reshedule] = useState('');
  const [msg_reshedule, setmsg_reshedule] = useState('');
  const [schedule2, setschedule2] = useState(false);
  const [schedule3, setschedule3] = useState(false);
  const [schedule4, setschedule4] = useState(false);
  const [schedule5, setschedule5] = useState(false);
  const [schedule6, setschedule6] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Leave', value: 'Leave' },
    { label: 'Permission', value: 'Permission' }
  ]);
  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState(null);
  const [items2, setItems2] = useState([
    { label: 'Sick Leave', value: 'Sick Leave' },
    { label: 'Casual Leave', value: 'Casual Leave' },
    { label: 'Maternity Leave', value: 'Maternity Leave' }
  ]);
  const [open3, setOpen3] = useState(false);
  const [value3, setValue3] = useState(null);
  const [items3, setItems3] = useState([

    { label: 'Personal Permission', value: 'Personal Permission' },
    { label: 'Emergency Permission', value: 'Emergency Permission' },
  ]);
  const [page_chg, setpage_chg] = useState(true);
  const [fromtime, setfromtime] = useState('');
  const [totime, settotime] = useState('');
  const [fromtime_reschedule, setfromtime_reschedule] = useState('');
  const [totime_reschedule, settotime_reschedule] = useState('');
  const [show_totime, settoShow_time] = useState(false);
  const [show_fromtime, setfromShow_time] = useState(false);
  const [Per_date_string, setDate_Per_date] = useState('');
  const [textshow_fromtime, settextshow_fromtime] = useState(false);
  const [textshow_totime, settextshow_totime] = useState(false);
  const [leaveTypeId, setleaveTypeId] = useState();
  const [id, setid] = useState();
  const [reschedule, setreshedule] = useState(false);
  const [leavetypeid_reshedule, setleavetypeid_reshedule] = useState();
  const [sub_reshedule_Permission, setsub_reshedule_Permission] = useState('');
  const [fromdate_reschedule, setfromdate_reschedule] = useState('');
  const [fromtime_am, setfromtime_am] = useState('');
  const [totime_am, settotime_am] = useState('');
  const [Am_reschedule, setAM_reschedule] = useState('');
  const [textshow_mins, settextshow_mins] = useState(false);
  const [textshow_noof_days, settextshow_noof_days] = useState(false);
  const [Permission_totaltime, setPermission_totaltime] = useState('');
  const [num, set_num] = useState(false);
  const [toggle, settoggle] = useState(true);
  const [halfday, sethalfday] = useState(false);
  const [boolean, setboolean] = useState();
  const[Am,setAM]=useState('');
  useFocusEffect(
    React.useCallback(() => {
      setValue(null);
      setValue2(null);
      setValue3(null);
      getAccesstoken();
      getrefreshtoken();
      settextshow(false);
      settextshow2(false);
      settextshow_fromtime(false);
      settextshow_totime(false);
      settextshow_mins(false);
      //setreshedule(false);
      setAM('');
      console.log("useeffect");
      // fetchdata();
      setItems3([
        { label: 'Personal Permission', value: 'Personal Permission' },
        { label: 'Emergency Permission', value: 'Emergency Permission' },
      ]);
      setItems2([
        { label: 'Sick Leave', value: 'Sick Leave' },
        { label: 'Casual Leave', value: 'Casual Leave' },
        { label: 'Maternity Leave', value: 'Maternity Leave' }
      ]);
    }, [reschedule])
  );
  useFocusEffect(
    React.useCallback(() => {
      fetchdata();
    }, [fromdate, todate,halfday,Am,Am_reschedule, id, msg_reshedule, sub_reshedule, leavetypeid_reshedule, fromtime, totime, sub_reshedule_Permission])
  );
  const fetchdata = async () => {
    try {
      const reshedule_data = await AsyncStorage.getItem("reschedule");
      if (reshedule_data === null) {
        setschedule1(false);
        setschedule2(false);
        setschedule3(false);
        setschedule4(false);
        setschedule5(false);
        setschedule6(false);
      } else {
        setValue(2);
        const parsed = JSON.parse(reshedule_data);
        console.log('Resheduled getdata', parsed);
        setreshedule(true);
        if (parsed.requestType === "Permission") {
          setfromdate_reschedule(parsed.fromDate);
          setsub_reshedule_Permission(parsed.subject);
          setfromtime_reschedule(parsed.fromTime);
          settotime_reschedule(parsed.toTime);
          setleavetypeid_reshedule(parsed.leaveType.id);
          setid(parsed.id);
          setpage_chg(false);
          setschedule1(true);
          setschedule2(true);
          setschedule3(true);
          setschedule4(true);
          setschedule5(true);
          setschedule6(true);
        } else {
          setfromdate(parsed.fromDate);
          settodate(parsed.toDate);
          setsub_reshedule(parsed.subject);
          setmsg_reshedule(parsed.leaveReason);
          setleavetypeid_reshedule(parsed.leaveType.id);
          setid(parsed.id);
          if(parsed.requestType==='HalfDay'){
            sethalfday(true);
          }else{
            sethalfday(false);
          }
          setAM_reschedule(parsed.leaveStatus);
          setpage_chg(true);
          setschedule1(true);
          setschedule2(true);
          setschedule3(true);
          setschedule4(true);
          setschedule5(true);
          setschedule6(true);
        }
        //console.log(reshedule_data.fromDate);

      }

    }
    catch (error) {
      console.log("error in getting storage", error);
    }
  }
  useEffect(() => {
    AsyncStorage.removeItem("reschedule");
    setShow(false);
    settoShow(false);

  }, [show, to_show, schedule1, schedule2, schedule3, schedule4, date, , to_date, , sub, msg, leaveTypeId, fromtime, totime, id])
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
  const save_btn_permission = () => {
    if (page_chg === true) {
      settextshow(false);
      settextshow2(false);
      setschedule3(false);
      setschedule4(false);
      setschedule5(false);
      setschedule6(false);
      //   input3.clear();
      input.clear();
    } else {
      settextshow(false);
      settextshow2(false);
      setschedule3(false);
      setschedule4(false);
      setschedule5(false);
      setschedule6(false);
      settextshow_fromtime(false);
      settextshow_totime(false);
      //  input3.clear();

    }
    if (reschedule === false) {
      console.log(reschedule);
      if (Per_date_string === '' || fromtime_am === '' || sub === '' || totime_am === '' || leaveTypeId === '') {
        alert("Please fill all the fields");
      }

      if (Per_date_string !== '' && fromtime !== '' && sub !== '' && totime !== '' && leaveTypeId !== '') {
        Permission_leaverequest_(accessToken, Per_date_string, fromtime_am, sub, totime_am, leaveTypeId)
          .then(function (response) {
            console.log("response in fetchmonth", response);

            console.log('response in save btn', response);
            if (response.data.statusMessage === "Please mention correct time") {
              alert(response.data.statusMessage);
            } else {
              if (response.data.statusMessage === "Success") {
                setDate_Per_date("");
                setfromtime("");
                setsub("");
                settotime("");
                setleaveTypeId("");
                props.navigation.navigate('Leave  Status');

              } else {
                ToastAndroid.show("Error in updating", ToastAndroid.SHORT);
              }
            }

            // props.navigation.navigate('Leave  Status');

          })
          .catch(function (error) {
            console.log(error.response);
            if (error.response) {

              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          })
      } else {
        alert("Please fill all the fields");
        //console.log("in else");
      }




    } else {
      if (reschedule === true) {

        if (Per_date_string === '') {
          setDate_Per_date(fromdate_reschedule);
          console.log(fromdate_reschedule);
        } else {
          setDate_Per_date(Per_date_string);
          console.log(Per_date_string);
        }
        if (fromtime_am === '') {
          setfromtime(fromtime_reschedule);
          console.log(fromtime_reschedule);
        } else {
          setfromtime(fromtime);
          console.log(fromtime);
        }
        if (sub === '') {
          setsub(sub_reshedule_Permission);
          console.log(sub_reshedule_Permission);
        } else {
          setsub(sub);
          console.log(sub);
        }
        if (totime_am=== '') {
          settotime(totime_reschedule);
          console.log(totime_reschedule);
        } else {
          settotime(totime);
          console.log(totime);
        }
        if (leaveTypeId === '') {
          setleaveTypeId(leavetypeid_reshedule);
          console.log(leavetypeid_reshedule);
          console.log(id);
        } else {
          setleaveTypeId(leaveTypeId);
          console.log(leaveTypeId);
        }
      }

      if (Per_date_string !== '' && fromtime_am !== '' && sub !== '' && totime_am !== '' && leaveTypeId !== '' && id !== '') {
        leaverequest_Permission_reshedule(accessToken, Per_date_string, fromtime_am, sub, totime_am, leaveTypeId, id)
          .then(function (response) {
            console.log("response in fetchmonth", response);

            console.log('response in save btn', response);
            if (response.data.statusMessage === "Please mention correct time") {
              alert(response.data.statusMessage);
            } else {
              if (response.data.statusMessage === "Success") {
                setDate_Per_date('');
                setfromtime('');
                setsub('');
                settotime('');
                setleaveTypeId('');
                setreshedule(false);

                AsyncStorage.removeItem("reschedule");
                props.navigation.navigate('Leave  Status');

              } else {
                ToastAndroid.show("Error in updating", ToastAndroid.SHORT);

              }
            }

            // props.navigation.navigate('Leave  Status');

          })
          .catch(function (error) {
            console.log(error.response);
            if (error.response) {

              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          })
      } else {
        Alert.alert("Something went wrong",
          "Please fill all the fields again",
          [{
            text: "Ok",
            onPress: () => {
              console.log("ok pressed in permission");
              setschedule1(false);
              setschedule2(false);
              setschedule3(false);
              setschedule4(false);
              settextshow(false);
              settextshow2(false);
              setschedule5(false);
              setschedule6(false);
              // input3.clear();
              setValue3(null);
              settextshow_fromtime(false);
              settextshow_totime(false);
              settextshow_mins(false);
            }


          },]);
      }

    }



  }

  const save_btn = async () => {
    if (page_chg === true) {
      settextshow(false);
      settextshow2(false);
      setschedule3(false);
      setschedule4(false);
      //input3.clear();
      input.clear();
    } else {
      settextshow(false);
      settextshow2(false);
      setschedule3(false);
      setschedule4(false);
      // input3.clear();

    }
    if (reschedule === false) {
      console.log(reschedule);
      if (date === '' || msg === '' || to_date === '' || leaveTypeId == '' || sub === '') {
        alert("Please fill all the field");
      }
      else {
        console.log(Am);
        leaverequest(date, msg, sub, to_date, accessToken, leaveTypeId,Am,halfday)
          .then(function (response) {
            // console.log("response in fetchmonth", response);
            console.log('response in save btn', response);
            if (response.data.statusMessage === "Success") {
              input.clear();
              props.navigation.navigate('Leave  Status');

            } else {
              ToastAndroid.show("Error in updating", ToastAndroid.SHORT);

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

    } else {
      if (reschedule === true) {

        if (date === '') {
          setDate1(fromdate);
          console.log("fromdate", fromdate);
        } else {
          setDate1(date);
          console.log("fromdate", date);
        }
        if (msg === '') {
          setmessage(msg_reshedule);
          console.log("fromdate", msg);

        } else {
          setmessage(msg);
          console.log("fromdate", msg);
        }
        if (sub === '') {

          setsub(sub_reshedule);
          console.log("fromdate", sub_reshedule);
        } else {

          setsub(sub);
          console.log("fromdate", sub);
        }
        if (leaveTypeId === '') {
          setleaveTypeId(leavetypeid_reshedule);
          console.log("fromdate", leavetypeid_reshedule);
        } else {
          setleaveTypeId(leaveTypeId);
          console.log("fromdate", leaveTypeId);
        }
        if (to_date === '') {
          settoDate(todate);
          console.log("fromdate", todate);
        } else {
          settoDate(to_date);
          console.log("fromdate", to_date);
        }
        if(Am===''){
          setAM(Am_reschedule)
        }else{
        setAM(Am);
        }
        
      }
      if (date === '' || msg === '' || to_date === '' || leaveTypeId == '' || id === '') {
        Alert.alert("Something went wrong",
          "Please fill all the fields again",
          [{
            text: "Ok",
            onPress: () => {
              console.log("ok pressed");
              setschedule1(false);
              setschedule2(false);
              setschedule3(false);
              setschedule4(false);
              settextshow(false);
              settextshow2(false);
              //  input3.clear();
              setValue2(null);
              input.clear();
            }


          },]);
        // console.log("error");

      }
      else {
        
        leaverequest_reschedule(date, msg, sub, to_date, accessToken, id, leaveTypeId,Am,halfday)
          .then((response) => {
            console.log(response);
            if (response.data.statusMessage === "Success") {
              setDate1('');
              settoDate('');
              setmessage('');
              setsub();
              setleaveTypeId();
              setreshedule(false);
              AsyncStorage.removeItem("reschedule");
              props.navigation.navigate('Leave  Status');

            } else {
              ToastAndroid.show("Error in updating", ToastAndroid.SHORT);
            }
          })
      }



    }


  }

  const cancel_btn = (props) => {
    if (page_chg === true) {
      setschedule1(false);
      setschedule2(false);
      setschedule3(false);
      setschedule4(false);
      settextshow(false);
      settextshow2(false);
      //  input3.clear();
      setValue2(null);
      input.clear();
      setValue(null);
      settextshow_mins(false);
      setid('');
      setreshedule(false);
    } else {
      setschedule1(false);
      setschedule2(false);
      setschedule3(false);
      setschedule4(false);
      settextshow(false);
      settextshow2(false);
      setschedule5(false);
      setschedule6(false);
      // input3.clear();
      setValue3(null);
      settextshow_fromtime(false);
      settextshow_totime(false);
      setValue(null);
      settextshow_mins(false);
      setid('');
      setreshedule(false);
    }

  }
  const onChange = (event, selectedDate) => {
    var date = moment()
      .utcOffset('+05:30')
      .format('YYYY-MM-DD');
    if (moment(selectedDate).format('YYYY-MM-DD') === date) {
      Alert.alert("Contact Admin", "You are not allowed to select the current date");

    } else {
      setschedule1(false);
      console.log("event", event);
      const currentDate = selectedDate;
      console.log(moment(currentDate).format('YYYY,MM,DD'));
      setDate1(moment(currentDate).format("YYYY-MM-DD"));
      console.log(date);
      settextshow(true);
      setShow(false);
    }

  };
  const onChange_Per_date = (event, selectedDate4) => {
    setShow_Per_date(false);
    setschedule1(false);
    console.log("event", event);
    const currentDate4 = selectedDate4;
    console.log(moment(currentDate4).format('YYYY,MM,DD'));
    setDate_Per_date(moment(currentDate4).format("YYYY-MM-DD"));
    console.log(date);
    settextshow(true);
  };


  const showMode = (currentMode) => {

    setShow(true);
    setMode(currentMode);
  };
  const showMode_Permission_date = (currentMode) => {
    setShow_Per_date(true);
    setMode(currentMode);
  };


  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const onChange_todate = (event, selectedDate2) => {
    var date2 = moment()
      .utcOffset('+05:30')
      .format('YYYY-MM-DD');
    if (moment(selectedDate2).format('YYYY-MM-DD') === date2) {
      set_num(true);
      Alert.alert("Contact Admin", "You are not allowed to select the current date");

    } else {
      setschedule2(false);
      const currentDate2 = selectedDate2;
      //  settoDate('');
      //  setfromdate(selectedDate2);
      // const string2= moment(currentDate2).format("YYYY-MM-DD")
      settoDate(moment(currentDate2).format("YYYY-MM-DD"));
      console.log(to_date);
      settextshow2(true);
      settoShow(false);
      settextshow_noof_days(true);
    }

  };

  const showMode_todate = (currentMode) => {
    settoShow(true);
    setMode(currentMode);
  };
  const showMode_totime = (currentMode) => {
    settoShow_time(true);
    setMode(currentMode);
  };
  const showMode_fromtime = (currentMode) => {
    setfromShow_time(true);
    setMode(currentMode);
  };
  const onChange_fromtime = (event, selectedtime) => {
    setfromShow_time(false);
    const currentime = selectedtime;
    console.log(currentime);
    setfromtime(moment(currentime).format("hh:mm"));
    setfromtime_am(moment(currentime).format("hh:mm a"));
    //console.log(fromtime);
    settextshow_fromtime(true);
  }
  const onChange_totime = (event, selectedtime2) => {
    settoShow_time(false);
    const currentime2 = selectedtime2;
    settotime(moment(currentime2).format("hh:mm"));
    settotime_am(moment(currentime2).format("hh:mm a"));
    // console.log(totime);
    settextshow_totime(true);
    settextshow_mins(true);
  }
  //Calculating the days
  const start = new Date(date);
  const end = new Date(to_date);
  const range1 = moment_range.range(start, end);
  const years = Array.from(moment_range.range(start, end).by('days'));
  // const fromtime_24=moment(fromtime,"h:mm").format("h:mm");
  // const totime_24=moment(fromtime,"h:mm").format("h:mm");

  // const mins = moment.utc(moment(totime_24, "h:mm").diff(moment(fromtime_24, "h:mm"))).format("h:mm");
  // console.log(moment(fromtime,"h:mm").format("h:mm"));
  // console.log(moment(totime,"h:mm").format("h:mm"));

  // console.log(mins);

  // const range = moment.range(fromtime, totime);
  // const hours = Array.from(range.by('hour', { excludeEnd: true }));
  // hours.length == 5 // true
  // hours.map(m => m.format('HH:mm'))
  //console.log(fromtime.subtract(totime));
  // var startTime = moment(fromtime, 'hh:mm a');
  // var endTime = moment(totime, 'hh:mm a');
  // var totalHours = (endTime.diff(startTime, 'hours'));
  // var totalMinutes = endTime.diff(startTime, 'minutes');
  // var clearMinutes = totalMinutes % 60;
  // const totalTime = totalHours + " hrs and " + clearMinutes + " mins"
  // console.log("final", totalTime);
  var startTime = moment(fromtime, 'hh:mm');
  
  var endTime = moment(totime, 'hh:mm');
  if (endTime.isBefore(startTime)) {
    endTime.add(1, 'd')
  }
  
  
    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(duration.asHours());
    var totalhours = ((hours + 11) % 12 + 1);
    var minutes = parseInt(duration.asMinutes()) % 60
  
 // var duration = moment.duration(endTime.diff(startTime));
 

  console.log("test", endTime, startTime);
  //console.log('duration in Mins: ', (duration.hours() * 60) + duration.minutes());
  
 //  var hours = parseInt(duration.asHours());
   var finshTime="5:00:00 pm";
   
   
   
    console.log("courrect", totalhours)
  
  
  var hour = (endTime.diff(startTime, 'hours'));
  var totalMinutes = endTime.diff(startTime, 'minutes');
  console.log(hour, "testing2")
  var clearMinutes = totalMinutes % 60;
  const totalTime = hours + " hrs and " + minutes + " mins"
  //setPermission_totaltime(totalTime);
 // console.log("final", totalTime);
  const togglefunction1 = () => {
    settoggle(!toggle);
    setboolean(true);
  }

  const togglefunction = () => {
    settoggle(!toggle);
    setboolean(false);
  }
  useEffect(() => {
    if (boolean === true) {
      sethalfday(true);
    } else {
      sethalfday(false);
    }
  }, [boolean,])
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

      <View style={styles.editbox}>
        <View style={{ paddingTop: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width: 150, height: 45, resizeMode: 'cover' }} />

        </View>
        <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10, height: value === null ? 550 : 50 }}>
          <DropDownPicker
            style={{
              borderColor: 'white',
              elevation: 15
            }}
            // textStyle={{
            //   color:'white'
            // }}
            placeholder="Select the request type"
            open={open}
            value={value}
            items={items}
            disabled={value !== null || value2 !== null || value3 !== null ? true : false}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onSelectItem={(item) => {
              // console.log(item.label);
              if (item.label === "Leave") {
                setpage_chg(true);
                console.log(page_chg);
              } else {
                setpage_chg(false);
              }

            }}

          />

        </View>
        <View style={{ flex: 0.5, marginBottom: 40 }}>
          {
            page_chg && value !== null ?
              <View style={{ marginLeft: 10, marginRight: 10 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <Pressable onPress={showMode}>
                    <View style={styles.datebox}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 130, alignItems: 'center', margin: 4, borderRadius: 10 }}>

                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrcd1JQy4R_8GqjivacUv8ApcoR2xX8558Fw&usqp=CAU' }} style={{ width: 35, height: 35, resizeMode: 'cover' }} />
                        {
                          schedule1 ?
                            <Text style={{ color: 'grey', fontSize: RFPercentage(2), textAlign: 'center' }}> {fromdate}</Text>
                            :
                            textshow ?
                              <Text style={{ color: 'black', fontSize: RFPercentage(2), textAlign: 'center' }}> {date}</Text>
                              :
                              <Text style={{ fontSize: RFPercentage(2.3), color: "#838ea6" }}>
                                Start Date
                              </Text>
                        }

                      </View>
                      {show && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={new Date()}
                          mode={mode}
                          onChange={onChange}
                          minimumDate={new Date()}
                        />
                      )}
                    </View>
                  </Pressable>
                  <Pressable onPress={showMode_todate}>
                    <View style={styles.datebox}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 130, alignItems: 'center', margin: 4, borderRadius: 10 }}>
                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrcd1JQy4R_8GqjivacUv8ApcoR2xX8558Fw&usqp=CAU' }} style={{ width: 35, height: 35, resizeMode: 'cover' }} />
                        {
                          schedule2 ?
                            <Text style={{ color: 'grey', fontSize: RFPercentage(2), textAlign: 'center' }}> {todate}</Text>
                            :
                            textshow2 ?
                              <Text style={{ color: 'black', fontSize: RFPercentage(2), textAlign: 'center' }}> {to_date}</Text>
                              :
                              <Text style={{ fontSize: RFPercentage(2.3), color: "#838ea6" }}>
                                End Date
                              </Text>
                        }

                      </View>
                      {to_show && (
                        schedule1 === true || textshow === true ?
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date()}
                            mode={mode}
                            onChange={onChange_todate}
                            minimumDate={new Date(date)}
                          /> :
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date()}
                            mode={mode}
                            onChange={onChange_todate}
                            minimumDate={new Date()}
                          />

                      )}
                    </View>
                  </Pressable>
                </View>
              </View>
              :
              value !== null &&
              <View style={{ marginTop: 20, marginLeft: 10 }}>

                <Pressable onPress={showMode_Permission_date}>
                  <View style={styles.datebox}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-around", width: 130, alignItems: 'center', margin: 4, borderRadius: 10 }}>
                      <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrcd1JQy4R_8GqjivacUv8ApcoR2xX8558Fw&usqp=CAU' }} style={{ width: 35, height: 35, resizeMode: 'cover' }} />
                      {
                        schedule1 ?
                          <Text style={{ color: 'grey', fontSize: RFPercentage(2), textAlign: 'center' }}> {fromdate_reschedule}</Text>
                          :
                          textshow ?
                            <Text style={{ color: 'black', fontSize: RFPercentage(2), textAlign: 'center' }}> {Per_date_string}</Text>
                            :
                            <Text style={{ fontSize: RFPercentage(2.3), color: "#838ea6" }}>
                              Select Date
                            </Text>
                      }

                    </View>
                    {Per_date && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={mode}
                        onChange={onChange_Per_date}
                        minimumDate={new Date()}
                      />
                    )}
                  </View>
                </Pressable>
              </View>
          }
          {page_chg === false && value !== null &&

            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <Pressable onPress={showMode_fromtime}>
                  <View style={styles.datebox}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 130, alignItems: 'center', margin: 4, borderRadius: 10 }}>

                      <Image source={{ uri: 'https://img.favpng.com/10/4/2/computer-icons-clock-icon-design-png-favpng-RSPTBYmiSmkbvYhsetuy2wtxy.jpg' }} style={{ width: 35, height: 35, resizeMode: 'cover' }} />
                      {
                        schedule5 ?
                          <Text style={{ color: 'grey', fontSize: RFPercentage(2), textAlign: 'center' }}>{fromtime_reschedule}</Text> :
                          textshow_fromtime ?
                            <Text style={{ color: 'black', fontSize: RFPercentage(2), textAlign: 'center' }}>{fromtime_am}</Text>
                            :
                            <Text style={{ fontSize: RFPercentage(2.3), color: "#838ea6" }}>
                              Start Time
                            </Text>
                      }


                    </View>
                    {show_fromtime && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode='time'
                        //  is24Hour={true}
                        onChange={onChange_fromtime}
                        display='spinner'
                      />
                    )}
                  </View>
                </Pressable>
                <Pressable onPress={showMode_totime}>
                  <View style={styles.datebox}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 130, alignItems: 'center', margin: 4, borderRadius: 10 }}>
                      <Image source={{ uri: 'https://img.favpng.com/10/4/2/computer-icons-clock-icon-design-png-favpng-RSPTBYmiSmkbvYhsetuy2wtxy.jpg' }} style={{ width: 35, height: 35, resizeMode: 'cover' }} />
                      {
                        schedule6 ?

                          <Text style={{ color: 'grey', fontSize: RFPercentage(2), textAlign: 'center' }}> {totime_reschedule}</Text> :

                          textshow_totime ?
                            <Text style={{ color: 'black', fontSize: RFPercentage(2), textAlign: 'center' }}> {totime_am}</Text>
                            :
                            <Text style={{ fontSize: RFPercentage(2.3), color: "#838ea6" }}>
                              End Time
                            </Text>
                      }


                    </View>
                    {show_totime && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode='time'
                        //is24Hour={true}
                        onChange={onChange_totime}
                        display='spinner'

                      />
                    )}
                  </View>
                </Pressable>
              </View>
            </View>
          }
          {
            page_chg && value !== null &&
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: 10, marginRight: 10, marginTop: 20 }}>
              <TouchableOpacity onPress={() => togglefunction()}>
                <View style={{ width: 170, backgroundColor: toggle ? colors.blue : "white", height: 50, marginLeft: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={toggle ? styles.selectedtext : styles.deselectedtext}>
                    Full Day
                  </Text>
                </View>

              </TouchableOpacity>
              <TouchableOpacity onPress={() => togglefunction1()}>
                <View style={{ width: 170, backgroundColor: toggle ? "white" : colors.blue, height: 50, marginRight: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={toggle ? styles.deselectedtext : styles.selectedtext}>
                    Half Day
                  </Text>
                </View>

              </TouchableOpacity>
            </View>
          }
          {page_chg && value !== null && halfday === false &&
            <View style={styles.no}>
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 50 }}>

                <Text style={{ color: colors.blue, fontSize: RFPercentage(2.5), marginLeft: 10, fontWeight: 'bold' }}>
                  No. of Days
                </Text>
              </View>
              <Text style={{ color: colors.blue, fontWeight: '900', fontSize: RFPercentage(2.5), marginLeft: 5, marginRight: 5 }}>
                :
              </Text>
              <View style={{ alignItems: 'baseline' }}>
                {textshow2 ?

                  <Text style={{ color: 'black', fontSize: RFPercentage(2.5), marginLeft: 5 }}>
                    {years.length}
                  </Text> :
                  <Text style={{ color: 'black', fontSize: RFPercentage(2.5), marginLeft: 5 }}>

                  </Text>

                }

              </View>
            </View>
          }
          {
            page_chg&& value!==null&&halfday&&
             <View style={{marginLeft:10,marginRight:10,marginTop:10, borderColor: colors.slate_gray, flexDirection:'row', borderWidth: 1, borderRadius:10,
                                fontSize: 14,borderColor:'white', backgroundColor: "white", height:40,color:'black',alignItems:'center',justifyContent:'center',elevation:10}}>
                        

                         <RadioButton.Group onValueChange={value =>setAM(value)} value={Am}>
                         <View style={{flexDirection:'row'}}>
                         <RadioButton.Item label="Forenoon" value="Forenoon"  color={colors.blue}/>
                         <RadioButton.Item label="Afternoon" value="Afternoon"  color={colors.blue}/>
                         </View>
                         </RadioButton.Group>
                        
                        </View>
          }
          {
            page_chg && value !== null ?
              <View style={{ flexDirection: 'column', paddingTop: 20 }}>
                <Text style={styles.title2}>
                  Sub
                </Text>
                <View style={styles.input_editbox4}>
                  <DropDownPicker
                    style={{
                      borderColor: 'white',
                      elevation: 15
                    }}
                    placeholder="Select a Leave type"
                    open={open2}
                    value={value2}
                    items={items2}
                    setOpen={setOpen2}
                    setValue={setValue2}
                    setItems={setItems2}
                    disabled={value === null ? true : false}
                    onSelectItem={(item) => {
                      console.log(item.label);
                      if (item.label === 'Sick Leave') {
                        setleaveTypeId(1);
                        setsub(item.label);

                      } else if (item.label === 'Casual Leave') {
                        setleaveTypeId(2);
                        setsub(item.label);
                      } else {
                        setleaveTypeId(3);
                        setsub(item.label);
                      }


                    }}
                  />
                </View>
              </View>
              :
              value !== null &&
              <View style={{ flexDirection: 'column' }}>
                <View style={styles.no}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', height: 50 }}>

                    <Text style={{ color: colors.blue, fontSize: RFPercentage(2.5), marginLeft: 10, fontWeight: 'bold' }}>
                      Total Permission Time
                    </Text>
                  </View>
                  <Text style={{ color: colors.blue, fontWeight: '900', fontSize: RFPercentage(2.5), marginLeft: 5, marginRight: 5 }}>
                    :
                  </Text>
                  <View style={{ alignItems: 'baseline' }}>
                    {textshow_mins ?

                      <Text style={{ color: 'black', fontSize: RFPercentage(2.3), }}>
                        {totalTime}
                      </Text> :
                      <Text style={{ color: 'black', fontSize: RFPercentage(2.3), marginLeft: 5 }}>

                      </Text>

                    }

                  </View>
                </View>

                <View style={{ flexDirection: 'column', paddingTop: 20, marginBottom: 20 }}>
                  <Text style={styles.title2}>
                    Sub
                  </Text>
                  {/* {
        schedule3 ?
          <KeyboardAwareScrollView>
            <TextInput style={styles.input_editbox4} clearButtonMode='always' onChangeText={(value) => setsub(value)} ref={input3 => { setinput3(input3) }} placeholder={sub_reshedule} placeholderTextColor='black' />
          </KeyboardAwareScrollView>
          :
          <KeyboardAwareScrollView>
            <TextInput style={styles.input_editbox4} clearButtonMode='always' onChangeText={(value) => setsub(value)} ref={input3 => { setinput3(input3) }} />
          </KeyboardAwareScrollView>
      } */}
                  <View style={styles.input_editbox4}>
                    <DropDownPicker
                      style={{
                        borderColor: 'white',
                        elevation: 15
                      }}
                      placeholder="Select a Permission type"
                      disabled={value === null ? true : false}
                      open={open3}
                      value={value3}
                      items={items3}
                      setOpen={setOpen3}
                      setValue={setValue3}
                      setItems={setItems3}
                      onSelectItem={(item) => {
                        console.log(item.label);
                        if (item.label === 'Personal Permission') {
                          setleaveTypeId(4);
                          setsub(item.label);

                        } else {
                          setleaveTypeId(5);
                          setsub(item.label);
                        }



                      }}
                    />
                  </View>
                </View>
              </View>

          }
          {page_chg === true && value !== null &&
            <View>

              <View style={{ justifyContent: 'space-around', paddingTop: 20, }}>
                <Text style={styles.title2}>
                  Message
                </Text>
                {
                  schedule4 ?
                    <KeyboardAwareScrollView style={{ textAlignVertical: 'top' }}>
                      <TextInput style={styles.input_editbox3} multiline={true} clearButtonMode='always' onChangeText={(value) => setmessage(value)} ref={input => { setinput(input) }} placeholder={msg_reshedule} placeholderTextColor='grey' />
                    </KeyboardAwareScrollView>
                    :
                    <KeyboardAwareScrollView style={{ textAlignVertical: 'top' }}>
                      <TextInput style={styles.input_editbox3} multiline={true} clearButtonMode='always' onChangeText={(value) => setmessage(value)} ref={input => { setinput(input) }} />
                    </KeyboardAwareScrollView>
                }
              </View>

            </View>

          }
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 15, marginBottom: 20 }}>
            {
              value !== null &&


              <TouchableOpacity onPress={() => { cancel_btn(props) }}>
                <View style={styles.btnview}>
                  <Text style={{ fontSize: 20, color: 'white' }}>
                    Clear
                  </Text>
                </View>
              </TouchableOpacity>
            }

            {
              page_chg && value !== null ?
                <TouchableOpacity onPress={save_btn}>
                  <View style={styles.btnview}>
                    <Text style={{ fontSize: 20, color: 'white' }}>
                      Submit
                    </Text>
                  </View>
                </TouchableOpacity> :
                value !== null &&
                <TouchableOpacity onPress={save_btn_permission}>
                  <View style={styles.btnview}>
                    <Text style={{ fontSize: 20, color: 'white' }}>
                      Submit
                    </Text>
                  </View>
                </TouchableOpacity>
            }

          </View>
        </View>
      </View>

    </ScrollView>



  );
}
const styles = StyleSheet.create(
  {
    selectedtext: {
      color: "white", fontSize: RFPercentage(2.3),
    },
    deselectedtext: {
      color: "black", fontSize: RFPercentage(2.3),
    },
    datebox: {
      width: 140,
      height: 50,
      backgroundColor: 'white',
      borderColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 15,
      borderRadius: 10
    },
    title1: {
      color: colors.blue,
      fontSize: RFPercentage(2.5),
    },
    title2: {
      color: colors.blue,
      fontSize: RFPercentage(2.5),
      fontWeight: 'bold',
      marginLeft: 10
    },
    editbox: {
      flex: 0.9,
      backgroundColor: '#f2f3f9',
      marginLeft: 15,
      marginRight: 15,
      marginBottom: 15,
      marginTop: 15,
      borderRadius: 5

    },
    no: {
      backgroundColor: 'white', flexDirection: 'row', marginTop: 20, alignItems: 'center', alignItems: 'baseline', marginLeft: 10, height: 50, marginRight: 10, elevation: 10, borderRadius: 10
    },
    input_editbox2: {
      borderColor: "black",
      borderWidth: 1,
      borderRadius: 8,
      width: 100,
      height: 40,
      fontSize: 14,
      backgroundColor: 'white',
      marginTop: 10,
      marginLeft: 5,
      marginRight: 10,
      justifyContent: 'center'

    },
    input_editbox4: {
      // borderColor: "black",
      //borderWidth: 1,
      //borderRadius: 8,
      height: 40,
      // fontSize: 14,
      // backgroundColor: 'white',
      marginTop: 10,
      marginRight: 10,
      marginLeft: 10

      //color: 'black'
      // marginLeft: 10,
      // justifyContent:'center'

    },
    input_editbox3: {
      borderColor: "white",
      borderWidth: 1,
      borderRadius: 8,
      fontSize: 14,
      backgroundColor: 'white',
      marginTop: 10,
      height: 70,
      marginLeft: 10,
      marginRight: 10,
      textAlignVertical: 'top',
      color: 'black',
      elevation: 10,
      marginBottom: 10


    },
    btnview: {
      borderColor: '#5297F4',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: 120,
      height: 40,
      // marginLeft:60,
      //marginTop:100,
      backgroundColor: '#5297F4',
      borderRadius: 12,

    },
  }
);
export default Leaverequest;