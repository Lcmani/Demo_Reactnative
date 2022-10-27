import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Calendarscreen from '../Homescreen/Calendar/Calendarscreen';
import Registerlogin from '../Homescreen/Calendar/Punchin';
import Registeringlogout from '../Homescreen/Calendar/Punchout';
import Viewlog from '../Homescreen/Calendar/Viewlogs';

const Homestack = () => {
    const Stack = createNativeStackNavigator();
    return (
    <Stack.Navigator>
        <Stack.Screen name='Calendar' component={Calendarscreen}
        options={{ headerLeft:()=>(
            <TouchableOpacity onPress={toggleDrawer}>
           
            <Image
              source={{
                uri:
                  'https://www.clipartmax.com/png/middle/303-3030668_hamburger-menu-comments-burger-menu-icon-svg.png',
              }}
              style={{width: 25, height: 25, marginLeft: 5}}
            />
          </TouchableOpacity>
        ) }}/>
        <Stack.Screen name='Registerlogin' component={Registerlogin} options={{ headerShown: false }} />
        <Stack.Screen name='Registeringlogout' component={Registeringlogout} options={{ headerShown: false }} />
        <Stack.Screen name='Viewlog' component={Viewlog} options={{ headerShown: false }} />
    </Stack.Navigator>
    );
}