
import { Dimensions, StyleSheet } from "react-native";
const WIDTH=Dimensions.get('window').width;
const HEIGHT=Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
       // justifyContent:'center',
        //alignItems:'center'
    },
    
    imageview:{
        flex:1,
        width:WIDTH,
        height:HEIGHT-370,
        //backgroundColor:'red',
     
        alignSelf:'center',
       justifyContent:'center'

    },
    image:{
        
        width:WIDTH,
       height:HEIGHT-260,
        resizeMode:'contain',
        //flex:0.3,
        alignItems:'center',
   //backgroundColor:'red'


        
    },
    textinput:{
        borderWidth:1,
        borderColor:'grey',
        flex:0.3,
        
    
        //alignSelf:'flex-start'

    },
    iconview:{
        width:50,
        height:50,
        borderColor:'#5297F4',
        borderWidth:1,
        color:'blue',
        marginTop:30,
        alignSelf:'center',
        justifyContent:'center',
        borderRadius:25,
        backgroundColor:'#5297F4'
    
        
        

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