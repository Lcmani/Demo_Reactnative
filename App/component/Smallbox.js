import React from "react";
import {View,Text,StyleSheet} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const Smallbox=(props)=>{
    return(
        <View style={{flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
        <View style={{...styles.smallbox,...props.style}}>
        </View>
        <Text style={{ fontSize:RFPercentage(1), justifyContent: 'center',position:'relative',top:4,color:'black' }}>{props.text}</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    smallbox:{
        width:15,
        height:15,
       // borderColor:'green',
        borderWidth:1,
       // backgroundColor:'green',
        


    },
});
export default Smallbox;