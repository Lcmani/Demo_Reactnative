import React from "react";
import {View,Image,Text  } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';

const Signoutmenu=(props)=>{
    return(
        <MenuProvider>
        <Menu >
          <MenuTrigger >
            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} >
              <Image source={require('../Assets/menu.png')} />
            </View>
          </MenuTrigger>
          <MenuOptions >
            <MenuOption onSelect={props.onSelect} >
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Image source={require('../Assets/signout.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ fontSize: 20 }}>Signout</Text>

              </View>
            </MenuOption>
            {/* <MenuOption>
              <Text style={{ fontSize: 20 }}>Close</Text>
            </MenuOption> */}
          </MenuOptions>
        </Menu>
      </MenuProvider>



    );
}
export default Signoutmenu;