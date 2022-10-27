import React, {createContext, useState, useEffect} from 'react'; 
import {View,TouchableOpacity,Text,StyleSheet,Dimensions, Alert} from "react-native";
import TouchID from 'react-native-touch-id';
import { useNavigation } from '@react-navigation/native';
import {AuthContext} from "../component/Context";

const Biometric = props => {
    const navigation = useNavigation();
    const [isAuth, setIsAuth] = useState(false);
    const optionalConfigObject = {
        title: "Authentication Required", // Android
        color: "#e00606", // Android,
      };

    useEffect(() => {
        handleBiometric();
        
    })
  
    const handleBiometric = () => {
    TouchID.isSupported(optionalConfigObject)
    .then(biometryType => {
        // Success code.
  // as we are focusing on fingerprint for now 
        if (biometryType && biometryType != 'FaceID') {
          authenticate()
        } else {
      // let fingerprintLableForOS = Platform.OS == "ios" ? "Touch ID" : "Fingerprint";
      //       alert( fingerprintLableForOS + " is not available on this device");
      finger();
        }
    })
    .catch(error => {
        // iOS Error Format and android error formats are different
        // android use code and ios use name
        // check at https://github.com/naoufal/react-native-touch-id
      //   let errorCode = Platform.OS == "ios" ? error.name : error.code;
      //   if (errorCode === "LAErrorTouchIDNotEnrolled" || errorCode === "NOT_AVAILABLE" || errorCode === "NOT_ENROLLED") {
      // let fingerprintLableForOS = Platform.OS == "ios" ? "Touch ID" : "Fingerprint";
      //       alert(fingerprintLableForOS + " has no enrolled fingers. Please go to settings and enable " + fingerprintLableForOS + " on this device.");
      //   } else {
      //      // alert(Platform.OS == "ios" ? error.message : translations.t(error.code));
      //   }
      finger();
      
    });
  }
 
  const {signOut,finger} = React.useContext(AuthContext);
function authenticate(props) {
  return TouchID.authenticate()
  .then( success => {
      if(success===true) {
  
        backscreen(props)
        
      }
    })
    .catch(error => {
      Alert.alert('Authenticated Failed',' FINGERPRINT_ERROR_LOCKOUT', [{text: 'Proceed', onPress: () =>signOut()}]);
  })
}

const backscreen = () => {
  console.log('go to calender screen')
  navigation.navigate("Bottomnavigator", { name: 'Jane' })
}
   
return(

<View>
    
</View>
    )
}
export default Biometric;
