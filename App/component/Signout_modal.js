
import React from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight, StyleSheet } from 'react-native';

import Modal from 'react-native-modal';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { colors } from './Colours';


const Signout_modal = (props) => {
    const [modalvisible, setmodalvisible] = useState(true);

    const Modalopen = () => {
        setmodalvisible(!modalvisible);
    }
    const { signOut } = React.useContext(AuthContext);
    const Login_page = () => {
        setmodalvisible(false);
        signOut()
    }
    return (

        <Modal
            isVisible={modalvisible}
            style={{ flex: 1, justifyContent: 'center', }}
            onSwipeComplete={() => Modalopen()}
            swipeDirection={['left', 'right', 'down', 'up']} >


            <View style={{ flex: 0.2, backgroundColor: 'white', borderRadius: 10 }} >

                <View style={{ marginLeft: 20, marginRight: 20, justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                    <Text style={{ fontSize: RFPercentage(3), color: 'black', }}>Something went wrong</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 5, marginRight: 5, marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => Login_page()}>
                        <View style={styles.button}>
                            <Text style={{ fontSize: RFPercentage(2.5), color: 'white', textAlign: 'center' }}>Ok</Text>
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
    }
});

export default Signout_modal;