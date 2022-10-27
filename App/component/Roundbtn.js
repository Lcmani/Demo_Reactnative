import React from 'react';
import{View,Text, Image ,StyleSheet,TouchableOpacity} from 'react-native';
import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import { Icon } from 'react-native-vector-icons/AntDesign';

const Roundbtn=(props)=>{
    return(
        
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
          <View style={{...styles.iconview,...props.style}}>
              <Image source={require('../Assets/right-arrow.png')} style={styles.icon}/>
          </View>
          </TouchableOpacity>
          
        
    );
}



const styles = StyleSheet.create({ 
    
    iconview:{
        width:50,
        height:50,
       // borderColor:'#5297F4',
        borderWidth:1,
        color:'blue',
        marginTop:30,
        alignSelf:'center',
        justifyContent:'center',
        borderRadius:25,
       // backgroundColor:'#5297F4'
    
        
        

    },
    icon:{
        width:30,
        height:30,
        tintColor:'white',
        justifyContent:'center',
        alignSelf:'center'
    }

}); 
export { styles };
export default Roundbtn;