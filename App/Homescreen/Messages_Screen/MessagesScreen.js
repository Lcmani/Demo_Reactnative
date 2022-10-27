import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image, TouchableOpacity, FlatList, TextInput
} from 'react-native';

const MessagesScreen = props => {
 
  const UserName=props.route.params
  console.log("username", UserName)

  const DATA = [
    {id:1, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit amet"},
    {id:2, date:"9:50 am", type:'out', message: "Lorem ipsum dolor sit amet"} ,
    {id:3, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"}, 
    {id:4, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"}, 
    {id:5, date:"9:50 am", type:'out', message: "Lorem ipsum dolor sit a met"}, 
    {id:6, date:"9:50 am", type:'out', message: "Lorem ipsum dolor sit a met"}, 
    {id:7, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"}, 
    {id:8, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"},
    {id:9, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"},
  ];
  
  
  
  const backscreen = (props) => {
    props.navigation.navigate('Employee Details');
}
const renderDate = (DATA) => {
  return(
    <Text style={styles.time}>
      {DATA}
    </Text>
  );
}
    return (
      <View style={styles.container}>
           <View style={styles.employeeview} >
                <TouchableOpacity onPress={() => backscreen(props)}>
                    <Image source={require('../../Assets/left-arrow.png')} style={{ width: 25, height: 25, tintColor: '#5297F4', }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={styles.title}>Employee</Text>
                    <View style={{paddingRight:10}}>
                    <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width:100, height:30, resizeMode: 'cover' }} />
                    </View>
                </View>
            </View>
          <View style={styles.header}>
            <View style={styles.headerContent}>
            
                <Image style={styles.avatar}
                  source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                
                <Text style={styles.name}>UserName</Text>
            
            </View>
          </View>

          <View style={styles.body}>
          <FlatList style={styles.list}
          data={DATA}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={(message) => {
            console.log(item);
            const item = message.item;
            let inMessage = item.type === 'in';
            let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            return (
              <View style={[styles.item, itemStyle]}>
                {!inMessage && renderDate(item.date)}
                <View style={[styles.balloon]}>
                  <Text>{item.message}</Text>
                </View>
                {inMessage && renderDate(item.date)}
              </View>
            )
          }}/>
   <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Write a message..."
                underlineColorAndroid='transparent'
                />
          </View>

            <TouchableOpacity style={styles.btnSend}>
              <Image source={{uri:"https://img.icons8.com/small/75/ffffff/filled-sent.png"}} style={styles.iconSend}  />
            </TouchableOpacity>
        </View>
       </View>
      </View>
    );
  }
  export default MessagesScreen;


const styles = StyleSheet.create({
  header:{
    backgroundColor: "#DCDCDC",
  },
  headerContent:{
    padding:5,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'space-evenly'
  },
  avatar: {
    width: 60,
    height:60,
    borderRadius: 23,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:5,
  },
  name:{
    fontSize:22,
    color:"#000000",
    fontWeight:'600',
    paddingRight:5,
  },
  userInfo:{
    fontSize:16,
    color:"#778899",
    fontWeight:'600',
  },
  body:{
    backgroundColor: "#778899",
    height:650,
  },
  item:{
    flexDirection : 'row',
  },
  infoContent:{
    flex:1,
    alignItems:'flex-start',
    paddingLeft:5
  },
  iconContent:{
    flex:1,
    alignItems:'flex-end',
    paddingRight:5,
  },
  icon:{
    width:30,
    height:30,
    marginTop:20,
  },
  info:{
    fontSize:18,
    marginTop:20,
    color: "#FFFFFF",
  },
  employeeview: {
    justifyContent: 'flex-start',
    paddingTop: 30,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingBottom: 20
},
title: {
  fontSize: 18,
  width: 200,
  padding: 10
},
list:{
  paddingHorizontal: 17,
},
footer:{
  flexDirection: 'row',
  height:60,
  backgroundColor: '#eeeeee',
  paddingHorizontal:10,
  padding:5,
},
btnSend:{
  backgroundColor:"#00BFFF",
  width:40,
  height:40,
  borderRadius:360,
  alignItems:'center',
  justifyContent:'center',
},
iconSend:{
  width:30,
  height:30,
  alignSelf:'center',
},
inputContainer: {
  borderBottomColor: '#F5FCFF',
  backgroundColor: '#FFFFFF',
  borderRadius:30,
  borderBottomWidth: 1,
  height:40,
  flexDirection: 'row',
  alignItems:'center',
  flex:1,
  marginRight:10,
},
inputs:{
  height:40,
  marginLeft:16,
  borderBottomColor: '#FFFFFF',
  flex:1,
},
balloon: {
  maxWidth: 250,
  padding: 15,
  borderRadius: 20,
},
itemIn: {
  alignSelf: 'flex-start'
},
itemOut: {
  alignSelf: 'flex-end'
},
time: {
  alignSelf: 'flex-end',
  margin: 15,
  fontSize:12,
  color:"#808080",
},
item: {
  marginVertical: 14,
  flex: 1,
  flexDirection: 'row',
  backgroundColor:"#eeeeee",
  borderRadius:300,
  padding:5,
},
});
