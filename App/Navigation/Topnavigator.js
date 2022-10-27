import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import Leavelist from "../Homescreen/Leaverequest_Screen/Leavelist";
import Leaverequest from "../Homescreen/Leaverequest_Screen/Leaverequest";



const Toptab=createMaterialTopTabNavigator();

const Topnavigator =()=>{
return(
    <Toptab.Navigator>
        <Toptab.Screen name='Leave form' component={Leaverequest}/>
        <Toptab.Screen name='Leave  Status' component={Leavelist}/>
    </Toptab.Navigator>
);
}
export default Topnavigator;