import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ToastAndroid } from 'react-native';
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts"
import { RFPercentage } from "react-native-responsive-fontsize";
import { colors } from "../../component/Colours";
import DatePicker from 'react-native-modern-datepicker';
import Datepickermodern from "../../component/Datepickermodal";
import jwtDecode from "jwt-decode";
import { getData } from "../../API/Devicestorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Getusepresent_fn,Getuseabsent_fn,Getuserlate_fn, Getpiechart_fn } from "../../API/Apifunctions";
import moment from "moment";
import { Pie } from 'react-native-pathjs-charts'

const colores = [
  '#0d47a1',
  '#1976D2',
  '#2196F3',
  '#64B5F6',
  '#BBDEFB',
  '#E3F2FD',
];

const getXY = (percent: number, radius: number) => {
  const x = Math.cos((2 * Math.PI * percent) / 100) * radius;
  const y = Math.sin((2 * Math.PI * percent) / 100) * radius;
  return {x, y};
};

const slices = [
  {percent: 22, id: 1},
  {percent: 66, id: 2},
  {percent: 5, id: 3},
  {percent: 17, id: 4},
].sort((a, b) => b.percent - a.percent);


const D_chart = (props) => {

  const radius = 100;
  let tempPercent = 0;
  let tempTextPercent = 0;
  let prevMiddlePercent = 0;

  

  const [toggle1, settoggle1] = useState(true);
  const [toggle3, settoggle3] = useState(true);
  const [toggle2, settoggle2] = useState(true);
  const [modalvisible, setmodalvisible] = useState(false);
  const [month, setmonth] = useState('');
  const [chart, setchart] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setdata] = useState([]);
  const [day, setday] = useState('');
  const [accessToken, setaccesstoken] = useState('');
  const [refreshToken, setrefreshtoken] = useState('');
  const [logs, setlogs] = useState([]);
  const [absentlogs, setabsentlogs] = useState([]);
  const [latelogs, setlatelogs] = useState([]);
 const [pieData, setpieData] = useState([]);
const[presentdays,setpresentdays]=useState(true);
const[absentdays,setsbsentdays]=useState(false);
const[latedays,setlatedays]=useState(false);




const backscreen = (props) => {
    props.navigation.navigate('Calendar');
  }
  const showdate = () => {
    setmodalvisible(true);
  };

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

  useEffect(() => {
    getAccesstoken();
    getrefreshtoken();
    const month = moment()
      .utcOffset('+05:30')
      .format('YYYY ');

    const year = moment()
      .utcOffset('+05:30')
      .format('MM');
      

    if (accessToken !== '' && month !== '' && year !== null&&accessToken!==null) {
      let decode = jwtDecode(accessToken);
      console.log("decode", decode);
      if (decode.id !== undefined) {
        Getusepresent_fn(year, month, decode.id, accessToken)
          .then(function (response) {
            console.log(response.data.data);
            setlogs(response.data.data);
            console.log(logs);
          })
          .catch((error) => {
            console.log("Error in view logs", error);
          }
          )

          Getuseabsent_fn(year, month, decode.id)
            .then(function (response) {
              console.log(response);
              setabsentlogs(response.data.data);
              console.log(absentlogs);
            })
            .catch((error) => {
              console.log("Error in view logs", error);
            }
            )
          
      }
    } else {
      ToastAndroid.show("Loading...", ToastAndroid.SHORT);

    }
  }, [accessToken, refreshToken])
//  const pieData = [
//     { value: 7, color: 'red' },
//     { value: 1, color: 'green' },
//     { value: 0, color: 'purple' }
//   ];
  useEffect(()=>{
    getAccesstoken();
    getrefreshtoken();
    const month = moment()
    .utcOffset('+05:30')
    .format('YYYY ');

  const year = moment()
    .utcOffset('+05:30')
    .format('MM');

  if (accessToken !== '' && month !== '' && year !== null) {
    let decode = jwtDecode(accessToken);
    console.log("decode", decode);
    if (decode.id !== undefined) {
      Getpiechart_fn(year, month, decode.id, accessToken)
      .then(function (response) {
        console.log(response);
        const present_count=response.data.data.present_count;
        const absent_count= response.data.data.absent_count;
        const late_count=response.data.data.late_count;
        console.log(present_count,absent_count,late_count);
        const pie= [
          { value: present_count, color: 'green' },
          { value:absent_count, color: 'red' },
          { value:late_count, color: 'purple' }
        ];
        console.log("pi1",pie);
                   setpieData(pie);
                  console.log(pieData);
                  
      })
      .catch((error) => {
        console.log("Error in view logs", error);
      }
      )
        
    }
  } else {
    ToastAndroid.show("Loading...", ToastAndroid.SHORT);

  }
     

  },[accessToken,refreshToken])
  useEffect(()=>{
    getAccesstoken();
    getrefreshtoken();
    const month = moment()
    .utcOffset('+05:30')
    .format('YYYY ');

  const year = moment()
    .utcOffset('+05:30')
    .format('MM');

  if (accessToken !== '' && month !== '' && year !== null) {
    let decode = jwtDecode(accessToken);
    console.log("decode", decode);
    if (decode.id !== undefined) {
      Getuserlate_fn(year, month, decode.id, accessToken)
      .then(function (response) {
        console.log(response);
        setlatelogs(response.data.data);
        console.log(latelogs);
      })
      .catch((error) => {
        console.log("Error in view logs", error);
      }
      )
        
    }
  } else {
    ToastAndroid.show("Loading...", ToastAndroid.SHORT);

  }
     

  },[accessToken,refreshToken])

  const renderLegend = (text, color) => {
    return (
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text style={{ color: 'black', fontSize: RFPercentage(2.3) }}>{text || ''}</Text>
      </View>
    );
  };
  const togglefunction1 = () => {
    settoggle1(!toggle1);
    settoggle2(true);
    settoggle3(true);
    setpresentdays(true);
    setsbsentdays(false);
    setlatedays(false);
  }
  const togglefunction2 = () => {
    setpresentdays(false);
    setsbsentdays(true);
    setlatedays(false);
    settoggle2(false);
    settoggle1(false);
    settoggle3(true);

  }

  const togglefunction3 = () => {
    setpresentdays(false);
    setsbsentdays(false);
    setlatedays(true);
    settoggle3(false);
    settoggle2(true);
    settoggle1(false);

  }
  const piechart=(year,month,id)=>{
   
    if (accessToken !== '' && month !== '' && year!== null && id !== null) {
      let decode = jwtDecode(accessToken);
      console.log("decode", decode);
      if (decode.id !== undefined) {
        Getpiechart_fn(month,year, decode.id,)
          .then(function (response){
            console.log(response);
            const present_count=response.data.data.present_count;
            const absent_count= response.data.data.absent_count;
            const late_count=response.data.data.late_count;
            console.log(present_count,absent_count,late_count);
            const pie_value= [
              { value: present_count, color: 'green' },
              { value:absent_count, color: 'red' },
              { value:late_count, color: 'purple' }
            ];
            // const pathDataList = pie_value.map((v) => {
            //   const start = getXY(tempPercent, radius);
            //   tempPercent += v.percent;
            //   const end = getXY(tempPercent, radius);
            //   const largeArcFlag = v.percent > 50 ? 1 : 0;
            //   tempTextPercent += prevMiddlePercent + v.percent / 2;
            //   prevMiddlePercent = v.percent / 2;
            //   return {
            //     d: `M ${start.x} ${start.y}
            //     A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
            //     L 0 0`,
            //     id: v.id,
            //     textPos: {
            //       x: getXY(tempTextPercent, radius / 2).x,
            //       y: getXY(tempTextPercent, radius / 2).y,
            //     },
            //     percent: v.percent,
            //   };
            // });
            // console.log("pi",pathDataList);
                       setpieData(pie_value);
                      console.log(pieData);
  
          })
          .catch((error) => {
            console.log("Error in view logs", error);
          }
          )
  
      }
    } else {
      ToastAndroid.show("Loading...", ToastAndroid.SHORT);
  
    }
  }
const presentlist=(year,month,id)=>{
  if (accessToken !== '' && month !== '' && year!== null && id !== null) {
    let decode = jwtDecode(accessToken);
    console.log("decode", decode);
    if (decode.id !== undefined) {
      Getusepresent_fn(month,year, decode.id,)
        .then(function (response){
          console.log(response);
          setlogs(response.data.data);
          console.log(logs);

        })
        .catch((error) => {
          console.log("Error in view logs", error);
        }
        )

    }
  } else {
    ToastAndroid.show("Loading...", ToastAndroid.SHORT);

  }
}

const absentlist=(year,month,id)=>{
  if (accessToken !== '' && month !== '' && year!== null && id !== null) {
    let decode = jwtDecode(accessToken);
    console.log("decode", decode);
    if (decode.id !== undefined) {
               
      Getuseabsent_fn(month,year, decode.id)
            .then(function (response) {
              console.log(response);
              setabsentlogs(response.data.data);
              console.log(absentlogs);
            })
            .catch((error) => {
              console.log("Error in view logs", error);
            }
            )
    }
  } else {
    ToastAndroid.show("Loading...", ToastAndroid.SHORT);

  }
}



const latelist=(year,month,id)=>{
  if (accessToken !== '' && month!== '' && year !== null && id !== null) {
    let decode = jwtDecode(accessToken);
    console.log("decode", decode);
    if (decode.id !== undefined) {
      Getuserlate_fn(month,year, decode.id, )
      .then(function (response) {
        console.log(response);
        setlatelogs(response.data.data);
        console.log(latelogs);
      })
      .catch((error) => {
        console.log("Error in view logs", error);
      }
      )

    }
  } else {
    ToastAndroid.show("Loading...", ToastAndroid.SHORT);

  }
}
const currentmonth = moment()
.utcOffset('+05:30')
.format('MMM');
  return (
    <View style={{ flex: 1, backgroundColor: '#f2f3f9' }}>
      <View style={styles.employeeview} >
        <TouchableOpacity onPress={() => backscreen(props)}>
          <Image source={require('../../Assets/left-arrow.png')} style={{ width: 25, height: 25, tintColor: '#5297F4', }} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <Text style={styles.title}>Back</Text>
          <View style={{ paddingRight: 10 }}>
            <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width: 100, height: 30, resizeMode: 'cover' }} />

          </View>
        </View>
      </View>
      <Datepickermodern
        modalvisible={modalvisible}
        onMonthYearChange={(selecteddate) => {
          console.log(selecteddate.substring(0, 4));
          console.log(selecteddate.substring(5, 7));
          setmonth(selecteddate.substring(5, 7));
          console.log(month);
          let decode = jwtDecode(accessToken);
          console.log("decode", decode);
          if (decode.id !== undefined) {
          presentlist(selecteddate.substring(0, 4),selecteddate.substring(5,7),decode.id);
          absentlist(selecteddate.substring(0, 4),selecteddate.substring(5,7),decode.id);
          latelist(selecteddate.substring(0, 4),selecteddate.substring(5,7),decode.id);
          piechart(selecteddate.substring(0, 4),selecteddate.substring(5,7),decode.id);
          setchart(true);
          }

          setmodalvisible(false);
        }} />
      <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', borderColor: 'white', backgroundColor: 'white', marginLeft: 15, marginRight: 15, borderRadius: 10, elevation: 10 }}>

        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={showdate}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              {
                month !== "" ?
                  <Text
                    style={{
                      color: 'black',
                      fontSize: RFPercentage(3),
                      fontWeight: 'bold',
                      marginBottom: 12,
                    }}>
                    {moment(month).format('MMM')}
                  </Text> :
                  <Text
                    style={{
                      color: 'black',
                      fontSize: RFPercentage(3),
                      fontWeight: 'bold',
                      marginBottom: 12,
                    }}>
                    {currentmonth}
                  </Text>
              }
              <View style={{ justifyContent: 'center', }}>
                <Image style={{ width: 25, height: 20, marginLeft: 10 }} source={{ uri: 'https://www.seekpng.com/png/detail/11-117107_down-arrow-png-image-background-arrow-down-icon.png' }} />
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: 350, marginLeft: 20, marginRight: 20 }}>
            <View
              style={{

                flexDirection: 'column',
                justifyContent: 'space-evenly',
                marginTop: 10,
                marginLeft: 15
              }}>
              {renderLegend('Present', 'green')}
              {renderLegend('Absent', 'red')}
              {renderLegend('Late', 'purple')}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingTop: 10 }}>
            

            <Pie data={pieData}
         
          accessorKey="population"
          margin={{top: 20, left: 20, right: 20, bottom: 20}}
          color="#2980B9"
          pallete={
            [
              {'r':25,'g':99,'b':201},
              {'r':24,'g':175,'b':35},
              {'r':190,'g':31,'b':69},
              {'r':100,'g':36,'b':199},
              {'r':214,'g':207,'b':32},
              {'r':198,'g':84,'b':45}
            ]
          }
          r={50}
          R={150}
          legendPosition="topLeft"
          label={{
            fontFamily: 'Arial',
            fontSize: 8,
            fontWeight: true,
            color: '#ECF0F1'
          }}
          />


            
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: 10, marginRight: 10, marginTop: 20, width: 370, }}>
        <TouchableOpacity onPress={() => togglefunction1()}>
          <View style={{ width: 120, backgroundColor: toggle1 ? colors.blue : "white", height: 50, marginLeft: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={toggle1 ? styles.selectedtext : styles.deselectedtext}>
              Present Days
            </Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity onPress={() => togglefunction2()}>
          <View style={{ width: 120, backgroundColor: toggle2 ? "white" : colors.blue, height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={toggle2 ? styles.deselectedtext : styles.selectedtext}>
              Absent Days
            </Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity onPress={() => togglefunction3()}>
          <View style={{ width: 120, backgroundColor: toggle3 ? "white" : colors.blue, height: 50, marginRight: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={toggle3 ? styles.deselectedtext : styles.selectedtext}>
              Late Days
            </Text>
          </View>

        </TouchableOpacity>
      </View>
      {/* <View style={{backgroundColor:'white',borderColor:'white',marginTop:10,flex:0.15,justifyContent:'center',alignItems:'center',marginLeft:10,marginRight:10,borderRadius:10,elevation:10}}>

            </View> */}
            {presentdays&&
            <View style={{ flex: 0.7 }}>
            <FlatList
              keyExtractor={({ id }, index) => id}
              data={logs}
              renderItem={({ item }) => (
                <View style={styles.flatlistview}>
    
                  <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                  <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',width:120}}>
                            <Text style={styles.text1}>
                                Present At
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>
                                :
                            </Text>
                        </View>

                        <View style={{marginLeft:5}}>
                        <Text style={{ textAlign: 'left',fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold',marginRight:10 , }}>
                        {item.createdAt}
                        </Text>
                          </View>
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',width:120 }}>
                            <Text style={styles.text1}>
                                Punchin time
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', }}>
                                :  
                            </Text>
                        </View>

                        <View style={{marginLeft:3}}>
                        <Text style={{textAlign: 'left',fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold',marginRight:10 , }}>
                        {item.punchInTime}
                        </Text>
                          </View>
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',width:120 }}>
                            <Text style={styles.text1}>
                                Punchout time
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>
                                :
                            </Text>
                        </View>

                        <View style={{marginLeft:5}}>
                        <Text style={{ textAlign: 'left',fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold',marginRight:10 , }}>
                        {item.punchOutTime}
                        </Text>
                          </View>
                    </View>
                  </View>
                </View>
              )}
            />
    
          </View>
            }
             {latedays&&
            <View style={{ flex: 0.7 }}>
            <FlatList
              keyExtractor={({ id }, index) => id}
              data={latelogs}
              renderItem={({ item }) => (
                <View style={styles.flatlistview}>
    
                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                <View style={styles.parent_scrollview}>
                      <View style={{ justifyContent: 'space-between', flexDirection: 'row',width:120}}>
                          <Text style={styles.text1}>
                              Late At
                          </Text>
                          <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>
                              :
                          </Text>
                      </View>

                      <View style={{marginLeft:5}}>
                      <Text style={{ textAlign: 'left',fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold',marginRight:10 , }}>
                      {item.createdAt}
                      </Text>
                        </View>
                  </View>
                  <View style={styles.parent_scrollview}>
                      <View style={{ justifyContent: 'space-between', flexDirection: 'row',width:120 }}>
                          <Text style={styles.text1}>
                              Punchin time
                          </Text>
                          <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold', }}>
                              :  
                          </Text>
                      </View>

                      <View style={{marginLeft:3}}>
                      <Text style={{textAlign: 'left',fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold',marginRight:10 , }}>
                      {item.punchInTime}
                      </Text>
                        </View>
                  </View>
                  <View style={styles.parent_scrollview}>
                      <View style={{ justifyContent: 'space-between', flexDirection: 'row',width:120 }}>
                          <Text style={styles.text1}>
                              Punchout time
                          </Text>
                          <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>
                              :
                          </Text>
                      </View>

                      <View style={{marginLeft:5}}>
                      <Text style={{ textAlign: 'left',fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold',marginRight:10 , }}>
                      {item.punchOutTime}
                      </Text>
                        </View>
                  </View>
                </View>
              </View>
              )}
            />
    
          </View>
            }
             {absentdays&&
            <View style={{ flex: 0.7 }}>
            <FlatList
              keyExtractor={({ id }, index) => id}
              data={absentlogs}
              renderItem={({ item }) => (
                <View style={styles.flatlistview}>
    
                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                <View style={styles.parent_scrollview}>
                      <View style={{ justifyContent: 'space-between', flexDirection: 'row',width:120}}>
                          <Text style={styles.text1}>
                              Absent At
                          </Text>
                          <Text style={{ textAlign: 'left', fontSize:RFPercentage(2.3), color: colors.blue, fontWeight: 'bold' }}>
                              :
                          </Text>
                      </View>

                      <View style={{marginLeft:5}}>
                      <Text style={{ textAlign: 'left',fontSize:RFPercentage(2.3), color: "black", fontWeight: 'bold',marginRight:10 , }}>
                      {item.createdAt}
                      </Text>
                        </View>
                  </View>
                 
                </View>
              </View>
              )}
            />
    
          </View>
            }
      


    </View>
  )
}
const styles = StyleSheet.create(
  {
    flatlistview: {
      flex: 0.5,
      flexDirection: 'row',
      paddingBottom: 10,
      paddingTop: 10,
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: 'white',
      marginVertical: 5,
      elevation: 10,
      width: 350,
      marginLeft: 20,
      marginRight: 20,
      borderRadius: 10,
      elevation: 10
    },
    text1:{
      textAlign: 'left', 
      fontSize:RFPercentage(2.3), 
      color: colors.blue, 
      fontWeight: 'bold', 
      //padding: 10, 
      
      
  },
    parent_scrollview: {

      //flex: 1,
      flexDirection: 'row',
      //marginVertical: 5,
     
  },
    selectedtext: {
      color: "white", fontSize: RFPercentage(2.3),
    },
    deselectedtext: {
      color: "black", fontSize: RFPercentage(2.3),
    },
    employeeview: {
      justifyContent: 'flex-start',
      paddingTop: 30,
      flexDirection: 'row',
      paddingLeft: 5,
      marginBottom: 15,
    },
    title: {
      color: colors.blue,
      fontSize: 20,
      fontWeight: 'bold',
      paddingLeft: 5,
      justifyContent: "flex-start",
      alignItems: 'baseline'

    },
  }
)




export default D_chart;