
import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Modal from 'react-native-modal';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { colors } from './Colours';


const Rejectmodal = (props) => {
   
    return (

        <Modal
            isVisible={props.modalvisible}
            style={{ flex: 1, justifyContent: 'center', }}
            onSwipeComplete={props.onSwipeComplete}
            swipeDirection={['left', 'right', 'down', 'up']} >


            <View style={{ flex: 0.4, backgroundColor: 'white', borderRadius: 10 }} >

            <View style={{ justifyContent: 'space-around', paddingTop: 20, }}>
                            <Text style={styles.title2}>
                                Reject Reason
                            </Text>

                            <KeyboardAwareScrollView style={{ textAlignVertical: 'top' }}>
                                <TextInput style={styles.Reject_box} multiline={true} clearButtonMode='always' onChangeText={props.onChangeText} ref={props.ref} />
                            </KeyboardAwareScrollView>


                        </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft:10, marginRight:10, marginVertical: 20 }}>
                    <TouchableOpacity onPress={props.btn1}>
                        <View style={styles.button}>
                            <Text style={{ fontSize: RFPercentage(2.5), color: 'white', textAlign: 'center' }}>Clear</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.btn2}>
                        <View style={styles.button}>
                            <Text style={{ fontSize: RFPercentage(2.5), color: 'white', textAlign: 'center' }}>Reject</Text>
                        </View>
                    </TouchableOpacity>


                </View>
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
    },
    title2: {
        color: colors.blue,
        fontSize: RFPercentage(2.3),
        marginHorizontal: 10,
        marginLeft: 10,
        marginRight: 30,
        fontWeight: 'bold'

    },
    Reject_box: {
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 14,
        backgroundColor: 'white',
        marginTop: 10,
        height: 90,
        marginLeft: 10,
        marginRight: 10,
        textAlignVertical: 'top',
        color: 'black'


    },
});

export default Rejectmodal;