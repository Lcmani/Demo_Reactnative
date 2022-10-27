import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView,Image,ToastAndroid,BackHandler,ActivityIndicator} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "../Calendar/Calendarstyles";
import moment from 'moment';
import Smallbox from "../../component/Smallbox";
import Datebox from "../../component/Datebox";
import Calendarcomponent from "../../component/Calendarcomponent";
import Button from "../../component/Button";
import { getattendance_fn, Punchin_btn, refreshtoken_fn } from "../../API/Apifunctions";
import { getData } from "../../API/Devicestorage";
import { useFocusEffect } from '@react-navigation/native';
import { RFPercentage } from "react-native-responsive-fontsize";
import {AuthContext} from "../../component/Context";
import { FloatingAction } from "react-native-floating-action";
import { FAB } from "react-native-paper";
import { colors } from "../../component/Colours";
import Icon from 'react-native-vector-icons/FontAwesome';

const Calendarscreen = (props) => {
  const [punchbtn, setpunchbtn] = useState(true);
  const [view, setview] = useState(false);
  const [accessToken, setaccesstoken] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [month, setmonth] = useState('');
  const [year, setyear] = useState('');
  const [dayinview, setdayinview] = useState();
  const [Dateintoday, setDateintoday] = useState();
  const [refreshToken, setrefreshtoken] = useState('');
  const [maindata, setmaindata] = useState();
  const [yellow_date,setyellow_date] = useState();
  const [isLoading, setloading] = useState(true);
  const [name, setname] = useState();
  const [confirm, setconfirm] = useState(true);
const[date,setdate]=useState();
  const[timeout,settimeout]=useState(true);
  const[disabled,setdisabled]=useState(false);
  const[daypressed,setdaypressed]=useState(false);
  const[redcolour,setredcolour]=useState([]);
  const[greencolour,setgreencolour]=useState([]);
  const[yellowcolour,setyellowcolour]=useState([]);
  const[purplecolour,setpurplecolour]=useState([]);
  const[holiday,setholiday]=useState(false);
  const[fetchmonth_cal,setfetchmonth]=useState();
  const[fetchyear_cal,setfetchyear]=useState();
  const [exitApp, setExitApp] = useState(0);

  const getAccesstoken = async () => {
    await getData("accesstoken")
      .then(data => data)
      .then(value => {
      // console.log(" Accesstoken in calendar screen:  " + value);
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
  const getname = async () => {
    await getData("fullname")
      .then(data => data)
      .then(value => {
        //console.log(" Value:  " + value);
        setname(value);
      })
      .catch(err => console.log(err))

  }
 const maindata_array=(response)=>{
    let responsedata = response.data.data;
    console.log("response data", responsedata);
    let myArray = [];
    let absent_days=[];
    let present_days=[];
    let holiday=[];
    let late=[];
    const length = responsedata.length;

    for (let i = 0; i < length; i++) {
      if (responsedata[i].isPresent == 1) {
        let data = {};
        let key = responsedata[i].createdAt;
        data[key] = { customStyles: {
          container: {backgroundColor: 'white'},
          text: {color: 'green'}}}
        myArray.push(data);
        present_days.push(key);
        //console.log("at is present", responsedata[i]);
      } else if (responsedata[i].isPresent == 0) {

        let data = {};
        // console.log("at is absent", responsedata[i]);
        let key = responsedata[i].createdAt;
        data[key] = { customStyles: {
          container: {backgroundColor: 'white'},
          text: {color: 'red'}}}
        myArray.push(data);
        absent_days.push(key);

        
      }else if(responsedata[i].isPresent == 3){
        let data = {};
        let key = responsedata[i].createdAt;
        data[key] = { customStyles: {
          container: {backgroundColor: 'white'},
          text: {color: '#FF00FF'}}}
        myArray.push(data);
        late.push(key);
      }else{
        let data = {};
        let key = responsedata[i].createdAt;
        data[key] = { customStyles: {
          container: {backgroundColor: 'white'},
          text: {color: '#FFD700'}}}
        myArray.push(data);
        holiday.push(key);
    
      }
    }
    
 
    const alldate = Object.assign({}, ...myArray);
//console.log("All date",alldate);
   setmaindata(alldate);
   setredcolour(absent_days);
   setgreencolour(present_days);
   setyellowcolour(holiday);
   setpurplecolour(late);
  // setredcolour("2022-04-27");
  //  setgreencolour("2022-04-26");
   console.log("Absent days",redcolour);
   console.log("Present days",greencolour);
}

  const getattendance = async () => {

    getattendance_fn(month, year, accessToken)

      .then(function (response) {
        console.log("at .then response", response);
        // setresponsedata(response.data.data);
        maindata_array(response);


      })
      .catch(function (error) {
        console.log(error);
        console.log('There has been a problem with your axios operation: ' + error.message);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }

      })

  }
  const fetchmonth = (nextmonth, nextyear) => {
   // setmonthchanged(true);
    getattendance_fn(nextmonth, nextyear, accessToken)
      .then(function (response) {
        console.log("response in fetchmonth", response);
       
          maindata_array(response);
        
  
      })
      .catch(function (error) {
        console.log(error);
        console.log('There has been a problem with your axios operation: ' + error.message);

        throw error;

      })
  }
  const punch_btn_change=async()=>{
Punchin_btn()
.then((response)=>{
  console.log(response);
if(response.data.punchIn===true){
  console.log('response.data.punchIn',response.data.punchIn);
  setpunchbtn(false);
}else{
  console.log('response.data.punchIn',response.data.punchIn);
  setpunchbtn(true);
}
})
.catch((err)=>{
  console.log(err);
  if (err.response) {
    console.log(err.response.data);
    console.log(err.response.status);
    console.log(err.response.headers);
  }

})
  }
  useEffect(() => {
    // const backAction = () => {
    //   Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //     {
    //       text: "Cancel",
    //       onPress: () => null,
    //       style: "cancel"
    //     },
    //     { text: "YES", onPress: () => BackHandler.exitApp() }
    //   ]);
    //   return true;
    // };
  
    const backAction = () => {
      if (exitApp === 0) {
        setExitApp(exitApp + 1);
  console.log(exitApp);
        ToastAndroid.show("Please press again to exit", ToastAndroid.SHORT);
      } else if (exitApp === 1) {
        console.log(exitApp);
        BackHandler.exitApp();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [exitApp]);
  useFocusEffect(
    React.useCallback(() => {
      // const onBackPress = () => {
      //   console.log("backbtn pressed");
      //  // navigation.navigate('ThirdPage');
      //   // Return true to stop default back navigaton
      //   // Return false to keep default back navigaton
      //   return true;
      // };

      // // Add Event Listener for hardwareBackPress
      // BackHandler.addEventListener(
      //   'hardwareBackPress',
      //   onBackPress
      // );
  
      getAccesstoken();
      getrefreshtoken();
      //console.log("accesstoken in before condition useeffect", accessToken);
      if (accessToken !== ""&&accessToken !== null) {
      //  console.log("accesstoken in useeffect", accessToken);
        getattendance();
        punch_btn_change();
        getname();
        setloading(false);
      }
      try {
        AsyncStorage.removeItem('date');
      }
      catch (error) {
        console.log(error);
  
      }
      var date = moment()
        .utcOffset('+05:30')
        .format('DD MMM YYYY ');
      setCurrentDate(date);
      var date = moment()
      .utcOffset('+05:30')
      .format('YYYY-MM-DD');
    setdate(date);
    console.log('yyyy-mm-dd',date);
  
      var dateintoday = moment()
        .utcOffset('+05:30')
        .format('DD');
      setDateintoday(dateintoday);
  
      var monthincal = moment()
        .utcOffset('+05:30')
        .format(' MM ');
      setmonth(monthincal);
  
      var yearincal = moment()
        .utcOffset('+05:30')
        .format(' YYYY ');
      setyear(yearincal);
      //punch_btn_change();
    }, [accessToken,refreshToken,confirm,punchbtn,disabled,timeout,isLoading])
   
  );
useEffect(()=>{
  
 console.log("Useeffect in red and green colour");
},[redcolour,greencolour])
  if (isLoading) {
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


  //punchin screen
  const nextscreen =async (props) => {
      props.navigation.navigate('Registerlogin');
  }
  //punchout screen
  const nextpunchoutscreen = (props) => {
   // AsyncStorage.removeItem("Punchin");
    props.navigation.navigate('Registeringlogout');
    setpunchbtn(true);
    settimeout(true);
  }
  //viewlog screen
  const viewlogscreen = (props) => {
    props.navigation.navigate('Viewlog');
    setview(false);
    if(punchbtn===false){
      setpunchbtn(false);
    }else{
      setpunchbtn(true);
    }
  }
// const signOut=(props)=>{
//   props.navigation.navigate('Signin');
// }
const actions=[
  {
    text: "Accessibility",
    icon:{ uri: 'https://uxwing.com/wp-content/themes/uxwing/download/13-time-date/schedule-calendar.png'},
    name: "Chart",
    position:'right',
    iconWidth: 20
    
  }
]
const {signOut} = React.useContext(AuthContext);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
     
      <View style={{ paddingTop:15, justifyContent: 'center', alignItems: 'center',paddingBottom:3}}>
                <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width:150, height:45, resizeMode: 'cover' }} />
       </View>
      <View style={styles.text1}>
        <View >
          <Text style={{ fontSize:RFPercentage(2.5),color:'black'}}>
            Hi, {name}
          </Text>
        </View>
       
          <TouchableOpacity onPress={()=>{signOut()}}>
          <View style={{ flexDirection:'column'}}>
          <View style={{justifyContent:'center',alignItems:'center'}}>
            
         <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/92/92961.png' }} style={{ width:35, height:35, resizeMode: 'cover' }} />
         </View>   
          <View style={{justifyContent:'center',alignItems:'center',paddingRight:5}}>
          <Text style={{color:'black',textAlign:'center',fontSize:RFPercentage(1.5)}}>Sign out</Text>
            </View> 
            </View>
          </TouchableOpacity>
         
      </View>
      <View style={{ marginTop:5,height:600}}>
        <Calendarcomponent
          ondayPress={(day) => {
            console.log(day);
            AsyncStorage.removeItem('date');
            console.log(day);
            setdayinview(day.day);
            console.log(day.dateString);
            if(date===day.dateString){
              console.log('current date pressed');
              setview(false);
              setholiday(false);
              if(punchbtn===false){
                setpunchbtn(false);
              }else{
                setpunchbtn(true);
              }
              
            
            }
          
            for (let i = 0; i < redcolour.length; i++) {
              console.log("for lop in day pressed");

              if (day.dateString === redcolour[i]) {
                console.log('red pressed',redcolour[i]);
                setview(false);
                setholiday(false);
                if (punchbtn === false) {
                  setpunchbtn(false);
                } else {
                  setpunchbtn(true);
                }
              }
            }
            for (let i = 0; i < yellowcolour.length; i++) {
              console.log("for lop in day pressed");

              if (day.dateString === yellowcolour[i]) {
                console.log('yellow pressed',yellowcolour[i]);
                setview(false);
                setholiday(true);
                if (punchbtn === false) {
                  setpunchbtn(false);
                } else {
                  setpunchbtn(true);
                }
              }
            }

            for (let i = 0; i < greencolour.length; i++) {
              console.log("for loop present in day pressed");

              if (day.dateString === greencolour[i]) {
                console.log('green pressed',greencolour[i]);
                setholiday(false);
                setview(true);
               
              }
            }
            for (let i = 0; i < purplecolour.length; i++) {
              console.log("for loop present in day pressed");

              if (day.dateString === purplecolour[i]) {
                console.log('Purple pressed',purplecolour[i]);
                setholiday(false);
                setview(true);
               
              }
            }
            setdaypressed(true);
            
            try {
              AsyncStorage.setItem('date', day.dateString)
            }
            catch (error) {
              console.log(error);
            }

           

          }}
          maxdate={currentDate}
          // markedDates={ maindata }
          markedDates={maindata}
          onmonthchange={month =>{
            setfetchmonth(month.month);
            setfetchyear(month.year);
            fetchmonth(month.month, month.year)
          }
   
          }


        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around',paddingTop:10,backgroundColor:'white'}}>
          <Smallbox
            style={{ borderColor: 'green', backgroundColor: 'green' }}
            text='Present' />
          <Smallbox
            style={{ borderColor: 'red', backgroundColor: 'red' }}
            text='Absent' />
          <Smallbox
            style={{ borderColor: '#FF00FF', backgroundColor: '#FF00FF' }}
            text='Late' />
               <Smallbox
            style={{ borderColor: '#FFD700', backgroundColor: '#FFD700' }}
            text='Holiday' />

          <Datebox
          style={{backgroundColor:'white',borderColor:'black'}}
            Date={Dateintoday}
            text='Today' />
          {/* <Datebox
           style={{backgroundColor:'white',borderColor:'#5297F4'}}
            Date={dayinview}
            text='Selected' /> */}
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.smallcircle}>
              <Text style={{ fontSize:RFPercentage(1.4), justifyContent: 'center', alignItems: 'center', color: 'black' }}>{dayinview}</Text>
            </View>
            <Text style={{ fontSize: RFPercentage(1), justifyContent: 'center', position: 'relative', top: 3, color: 'black' }}>Selected</Text>
          </View>

        </View>
        {
          holiday ?
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
              <View>
                <View style={styles.btnview_holiday}>
                  <Text style={{ fontSize: RFPercentage(3), color:colors.blue }}>
                    holiday
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: 400, marginRight: 20, justifyContent: 'flex-end', alignItems: 'flex-end', position: 'relative' }}>
              <TouchableOpacity onPress={() => props.navigation.navigate('Chart')}>
                   <View style={styles.fab}>
                      
                      <Image source={{uri:'https://cdn.iconscout.com/icon/free/png-256/pie-chart-1430973-1208737.png'}} style={{width:30,height:30}}/>
                      </View>
                   </TouchableOpacity>
              </View>
            </View> :
            view ?
              <View>
                <Button
                  onPress={() => viewlogscreen(props)}
                  btnname='View Logs'
                />
                <View style={{ flexDirection: 'row', width: 400, marginRight: 20, justifyContent: 'flex-end', alignItems: 'flex-end', position: 'relative' }}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Chart')}>
                   <View style={styles.fab}>
                      
                      <Image source={{uri:'https://cdn.iconscout.com/icon/free/png-256/pie-chart-1430973-1208737.png'}} style={{width:30,height:30}}/>
                      </View>
                   </TouchableOpacity>
                </View>
              </View>
              :
              punchbtn ?
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                  <TouchableOpacity onPress={() => nextscreen(props)} >
                    <View style={styles.btnview}>
                      <Text style={{ fontSize: RFPercentage(3), color: 'white' }}>
                        Punch In
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', width: 400, marginRight: 20, justifyContent: 'flex-end', alignItems: 'flex-end', position: 'relative' }}>
                    {/* <FAB
                      style={styles.fab}
                      small
                      icon="chart-box"
                      onPress={() => props.navigation.navigate('Chart')}
                      color={'white'}
                    /> */}
                   <TouchableOpacity onPress={() => props.navigation.navigate('Chart')}>
                   <View style={styles.fab}>
                      
                      <Image source={{uri:'https://cdn.iconscout.com/icon/free/png-256/pie-chart-1430973-1208737.png'}} style={{width:30,height:30}}/>
                      </View>
                   </TouchableOpacity>
                  </View>
                </View> :
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                  <TouchableOpacity onPress={() => nextpunchoutscreen(props)} disabled={disabled}>
                    <View style={styles.btnview}>
                      <Text style={{ fontSize: RFPercentage(3), color: 'white' }}>
                        Punch Out
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', width: 400, marginRight: 20, justifyContent: 'flex-end', alignItems: 'flex-end', position: 'relative' }}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('Chart')}>
                   <View style={styles.fab}>
                      
                      <Image source={{uri:'https://cdn.iconscout.com/icon/free/png-256/pie-chart-1430973-1208737.png'}} style={{width:30,height:30}}/>
                      </View>
                   </TouchableOpacity>
                  </View>
                </View>

        }
      </View>
  
    



    </ScrollView>

  );
}
export default Calendarscreen;