import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import Completed_Permission from "../../Admin_Screens/Topnavigation_screens/Completed_Permission";
import Completed_request from "../../Admin_Screens/Topnavigation_screens/Completed_request";
import Pending_request from "../../Admin_Screens/Topnavigation_screens/Pending_request";





const Toptab_admin=createMaterialTopTabNavigator();

const Topnavigationtabs =()=>{
return(
    <Toptab_admin.Navigator>
        <Toptab_admin.Screen name='Pending Request' component={Pending_request}/>
        <Toptab_admin.Screen name='Completed Leave' component={Completed_request}/>
        <Toptab_admin.Screen name='Completed Permission' component={Completed_Permission}/>
        
    </Toptab_admin.Navigator>
);
}
export default Topnavigationtabs;