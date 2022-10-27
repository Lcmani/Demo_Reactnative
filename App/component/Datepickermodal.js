
import React,{useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { colors } from './Colours';

import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment';

const Datepickermodern = (props) => {
    const [modalvisible, setmodalvisible] = useState(true);
    const[date,setdate]=useState('');

    const Modalopen=()=>{
        setmodalvisible(!modalvisible);
    }
  useEffect(()=>{
    var currentdate = moment()
    .utcOffset('+05:30')
    .format('YYYY-MM-DD');
  setdate(currentdate);
  },[])
    return (

        <Modal
            isVisible={props.modalvisible}
            style={{ flex: 1, justifyContent: 'center', }}
            onSwipeComplete={() => Modalopen()}
            swipeDirection={['left', 'right', 'down', 'up']} >


            <View style={{ flex:0.6, backgroundColor: 'white',justifyContent:'center',borderRadius:10 }} >
            <DatePicker
               mode="monthYear"
               selectorStartingYear={2000}
               onMonthYearChange={props.onMonthYearChange}
               style={{borderRadius:10}}
               maximumDate={date}
               
             />
            </View>


        </Modal>





    );
}


const styles = StyleSheet.create({
    button: {
        width: 150,
        height: 50,
        backgroundColor: colors.blue,
        borderColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
});

export default Datepickermodern;