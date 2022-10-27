import React from "react";
import {View,Text,StyleSheet} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { colors } from "./Colours";

const Datebox=(props)=>{
    return(
        <View style={{flexDirection:'column', justifyContent: 'center',alignItems:'center'}}>
        <View style={{...styles.smallcircle,...props.style}}>
            <Text style={{ fontSize: RFPercentage(1.4), justifyContent: 'center', alignItems: 'center',color: colors.blue }}>{props.Date}</Text>
          </View>
          <Text style={{ fontSize: RFPercentage(1), justifyContent: 'center',position:'relative',top:3,color:'black'}}>{props.text}</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    smallcircle:{
        width:20,
        height:20,
       // borderColor:'green',
        borderWidth:1,
      //  backgroundColor:'green',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
        
       
        


    }
});
export default Datebox;