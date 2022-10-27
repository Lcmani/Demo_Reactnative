import React from 'react';
import {View,Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calendarscreen from '../Homescreen/Calendar/Calendarscreen';
import EmployeeScreen from '../Homescreen/Employee_screen/Employee_screen';
import { colors } from '../component/Colours';
import Topnavigator from './Topnavigator';
import UserDetails from '../Homescreen/Profile/Profile';
import Topnavigationtabs from '../Admin_Topnavigation/Topnaviagtiontabs';

const Tab = createBottomTabNavigator();


const Admintabs=()=>{
    return(
    <Tab.Navigator initialRouteName='Calendar'>
              <Tab.Screen name="Calendar" component={Calendarscreen} options={{
                headerShown: false, tabBarShowLabel:true, 
                tabBarLabelStyle:{
                    paddingLeft:8
                    },
                tabBarStyle: {
                    position: 'absolute',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    height: 60,
                    elevation: 30,
                    backgroundColor: 'white'
                },

                tabBarIcon: ({ focused }) => (
                    <View>
                        <View style={{ width: 25, height:25 }}>
                        <Image source={{ uri: 'https://uxwing.com/wp-content/themes/uxwing/download/13-time-date/schedule-calendar.png' }} style={{ width:30, height:30, resizeMode: 'contain',tintColor:focused?colors.blue:colors.slate_gray }} />
                                                   </View>
                    </View>
                )
            }}/>
        <Tab.Screen name="Employee_Details" component={EmployeeScreen} options={{
                headerShown: false, tabBarShowLabel:true,
                tabBarLabelStyle:{
                paddingLeft:10,
                
                },
                tabBarStyle: {
                    position: 'absolute',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    height: 60,
                    elevation: 30,
                    backgroundColor: 'white',
            
                },
                tabBarIcon: ({ focused }) => (
                    <View>
                        <View style={{ width: 25, height:25 }}>
                            {/* <Image source={require('../assets/warehouse.png')} style={{ width: 25, height: 25, tintColor: focused ? 'red' : 'black' }} /> */}
                         <Image source={{ uri: 'https://icon-library.com/images/employee-icon-png/employee-icon-png-23.jpg' }} style={{ width: 40, height:35, resizeMode: 'contain',tintColor:focused?colors.blue:colors.slate_gray}} />
                        </View>
                    </View>
                )
            }}/>
     
              
              <Tab.Screen name="Leave_Request" component={Topnavigator} options={{
                headerShown: false, tabBarShowLabel:true, tabBarStyle: {

                    position: 'absolute',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    height: 60,
                    elevation: 30,
                    backgroundColor: 'white'
                },
                tabBarLabelStyle:{
                    paddingLeft:20
                    },

                tabBarIcon: ({ focused }) => (
                    <View>
                        <View style={{ width:25, height:25,paddingLeft:10}}>
                        <Image source={{ uri:'https://cdn-icons-png.flaticon.com/512/2942/2942924.png' }} style={{ width:30, height:30, resizeMode: 'contain',tintColor:focused?colors.blue:colors.slate_gray }} />
                        </View>
                    </View>
                )
            }}/>
             <Tab.Screen name="Leave Authentication" component={Topnavigationtabs} options={{
                headerShown: false, tabBarShowLabel:true, tabBarStyle: {

                    position: 'absolute',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    height: 60,
                    elevation: 30,
                    backgroundColor: 'white'
                },
                tabBarLabelStyle:{
                    paddingLeft:20
                    },

                tabBarIcon: ({ focused }) => (
                    <View>
                        <View style={{ width:25, height:25,paddingLeft:10}}>
                        <Image source={{ uri:'https://cdn-icons-png.flaticon.com/512/2942/2942924.png' }} style={{ width:30, height:30, resizeMode: 'contain',tintColor:focused?colors.blue:colors.slate_gray }} />
                        </View>
                    </View>
                )
            }}/>
                 <Tab.Screen name="Profile" component={UserDetails} options={{
                headerShown: false, tabBarShowLabel:true, 
                tabBarLabelStyle:{
                    paddingLeft:6
                    },
                tabBarStyle: {
                    position: 'absolute',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    height: 60,
                    elevation: 30,
                    backgroundColor: 'white'
                },

                tabBarIcon: ({ focused }) => (
                    <View>
                        <View style={{ width:25,height:25}}>
                        <Image source={{ uri: 'https://cdn.onlinewebfonts.com/svg/img_24787.png' }} style={{ width:30, height:30, resizeMode: 'contain',tintColor:focused?colors.blue:colors.slate_gray }} />
                        </View>
                    </View>
                )
            }}/>
    </Tab.Navigator>

    );
}
export default Admintabs;