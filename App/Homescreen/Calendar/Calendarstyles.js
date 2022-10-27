import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../component/Colours";
const WIDTH=Dimensions.get('window').width;
const HEIGHT=Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        //justifyContent:'center',
        //alignItems:'center'
    },
    smallbox:{
        width:15,
        height:15,
        borderColor:'green',
        borderWidth:1,
        backgroundColor:'green',
        


    },
    text1:{ 
       // paddingTop: 20,
         flexDirection: 'row', 
         justifyContent:'space-between', 
         alignItems:'center',
         marginLeft:10,
         marginRight:10
         
         //paddingRight: 20 ,
        // alignItems:'baseline'
    },
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
    },
    btnview_holiday:{
      borderColor:'#5297F4',
      borderWidth:1,
      justifyContent:'center',
      alignItems:'center',
      width:200,
      height:40,
     // marginLeft:60,
      marginTop:20,
     // backgroundColor:'#5297F4',
      borderRadius:12,
    },
    fab: {
     width:50,
     height:50,
     // flexDirection:'row-reverse',
        justifyContent:'center',
       alignItems:'center',
        backgroundColor:'white',
       // position: 'absolute',
         margin:5,
         
        right:0,bottom:0,
        borderRadius:30,
        elevation:10,
        borderColor:colors.blue,
        borderWidth:1
        
      },
    container2:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      floatinBtn: {
        
        position: 'absolute',
        bottom: 10,
        right: 10,
      },
    opencolor:{
        color:'red'
    },
    open:{
        color:'green'
    },
    smallcircle:{
        width:20,
        height:20,
        borderColor:colors.blue,
        borderWidth:1,
      backgroundColor:'white',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    }
   
}); 
export { styles };