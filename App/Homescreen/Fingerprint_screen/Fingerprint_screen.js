import React from "react";
import {View} from "react-native";
import Biometric from "../../component/Fingerprint";
const Fingerprint_screen=()=>{
    return(
<View style={{backgroundColor:"white",flex:1}}>
    <Biometric/>
</View>
        );
}
export default Fingerprint_screen
