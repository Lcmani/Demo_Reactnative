import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const OfflineNotice = () => {
  const netInfo = useNetInfo();

  if (netInfo.type !== 'unknown' && netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../Assets/network.png')}
        />
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );

  return null;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    zIndex: 1,
    backgroundColor:'white'
  },
  image: {
    height: HEIGHT
    width: WIDTH
  },
  text: {
    fontSize: 25,
  },
});

export default OfflineNotice;
