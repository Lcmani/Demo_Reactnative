import React from "react";
import {View,TouchableOpacity,Text,StyleSheet,Dimensions} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
const WIDTH=Dimensions.get('window').width;

const Button=(props)=>{
    return(
        <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:20,marginBottom:20 }}>
        <TouchableOpacity onPress={props.onPress}>
          <View style={styles.btnview}>
            <Text style={{ fontSize:RFPercentage(3), color: 'white' }}>
             {props.btnname}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

    );
}
const styles=StyleSheet.create({
    btnview:{
        borderColor:'#5297F4',
        borderWidth:1,
         justifyContent:'center',
         alignItems:'center',
        width:200,
        height:40,
       // marginLeft:60,
        marginTop:20,
        backgroundColor:'#5297F4',
        borderRadius:12,
        
        



    }
});
export default Button;