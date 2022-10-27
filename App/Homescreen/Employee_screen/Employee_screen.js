import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ToastAndroid,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../component/Colours';
import filter from 'lodash.filter';
import {Employeelist, refreshtoken_fn} from '../../API/Apifunctions';
import {getData} from '../../API/Devicestorage';
import {useFocusEffect} from '@react-navigation/native';
import {RFPercentage} from 'react-native-responsive-fontsize';

const EmployeeScreen = props => {
  const [accessToken, setaccesstoken] = useState('');
  const [refreshToken, setrefreshtoken] = useState('');
  const [data, setData] = useState('');
  const [input, setinput] = useState('');
  const [pageNo, setpageNo] = useState(1);
  const [pageSize, setpageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [fullData, setFullData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setsearch] = useState('');

  const getAccesstoken = async () => {
    await getData('accesstoken')
      .then(data => data)
      .then(value => {
        //  console.log(" Value:  " + value);
        setaccesstoken(value);
      })
      .catch(err => console.log(err));
  };
  const getrefreshtoken = async () => {
    await getData('refreshtoken')
      .then(data => data)
      .then(value => {
        // console.log(" Value:  " + value);
        setrefreshtoken(value);
      })
      .catch(err => console.log(err));
  };

  useFocusEffect(
    React.useCallback(() => {
      getAccesstoken();
      getrefreshtoken();

      if (accessToken !== '') {
        setIsLoading(false);

        Employeelist(accessToken, pageNo, pageSize, search)
          .then(function (response) {
            console.log('response', response);
            if (response.data.data === undefined) {
              setIsLoading(true);
              //ToastAndroid.show("Loading...", ToastAndroid.SHORT);
            } else {
              console.log('data in else statement', response.data.data);
              // ToastAndroid.show("Loading...", ToastAndroid.SHORT);
              var data = response.data.data;
              if (response.data.totalRecord === 0) {
                console.log('no data');
                setError(true);
              } else {
                setError(false);
                setData(data);
                setIsLoading(false);
                // setFullData(data);
              }
            }
          })
          .catch(err => {
            setIsLoading(false);
            //setError(err);
          });
      }
    }, [pageNo, pageSize, accessToken, refreshToken, search, error]),
  );

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          resizeMode="cover"
          resizeMethod="scale"
          style={{width: 70, height: 70, borderRadius: 70, overflow: 'hidden'}}
          source={{uri: 'https://support.lenovo.com/esv4/images/loading.gif'}}
        />
      </View>
    );
  }
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = () => {
    setRefreshing(true);
    wait(500).then(() => {
      if (accessToken !== '') {
        setIsLoading(false);
        Employeelist(accessToken, pageNo, pageSize, search)
          .then(function (response) {
            console.log('response', response);
            if (response.data.data === undefined) {
              setIsLoading(true);
            } else {
              console.log('data in else statement', response.data.data);
              ToastAndroid.show('Loading...', ToastAndroid.SHORT);
              var data = response.data.data;
              setError(false);
              setData(data);
              setFullData(data);
              setIsLoading(true);
            }
          })
          .catch(err => {
            setIsLoading(false);
            // setError(err);
          });
      }
      setRefreshing(false);
    });
  };

  // if (error) {
  //   return (
  //     <View style={{flex:1,justifyContent: 'center', alignItems: 'center' }}>
  //       <Image
  //                                      resizeMode="cover"
  //                                      resizeMethod="scale"
  //                                      style={{ width:70, height:70, borderRadius: 70, overflow: 'hidden' }}
  //                                      source={{ uri:'https://support.lenovo.com/esv4/images/loading.gif' }}
  //                                  />
  //     </View>
  //   );
  // }
  const backscreen = props => {
    props.navigation.navigate('Calendar');
  };
  const forwardscreen = item => {
    setsearch('');
    input.clear();
    props.navigation.navigate('Employee', {EmployeeDetatils: item});
  };
  const MessagesScreen = item => {
    setsearch('');
    input.clear();
    props.navigation.navigate('MessagesScreen', {MessageDetatils: item});
  };

  const onScrollHandler = () => {
    setpageSize(pageSize + 10);
  };
  return (
    <View style={styles.container}>
      <View style={styles.employeeview}>
        <TouchableOpacity onPress={() => backscreen(props)}>
          <Image
            source={require('../../Assets/left-arrow.png')}
            style={{width: 25, height: 25, tintColor: '#5297F4'}}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <Text style={styles.title}>Employee</Text>
          <View style={{paddingRight: 10}}>
            <Image
              source={{
                uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png',
              }}
              style={{width: 100, height: 30, resizeMode: 'cover'}}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Search Here"
            placeholderTextColor="grey"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={value => setsearch(value)}
            ref={input => {
              setinput(input);
            }}
          />
        </View>
      </View>
      <View></View>
      <View style={{flex: 0.9, backgroundColor: '#f2f3f9'}}>
        {error ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              marginLeft: 10,
              marginRight: 10,
            }}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{
                width: 400,
                height: 300,
                borderRadius: 70,
                overflow: 'hidden',
              }}
              source={{
                uri: 'https://c.tenor.com/unvXyxtdn3oAAAAC/no-result.gif',
              }}
            />
          </View>
        ) : (
          <FlatList
            style={styles.notificationList}
            onEndReached={onScrollHandler}
            onEndThreshold={0}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={data}
            renderItem={({item}) => (
              <View style={styles.content}>
                <View style={[styles.card, {borderColor: '#6A5ACD'}]}>
                  <View style={styles.contentHeader}>
                    <TouchableOpacity
                      style={styles.cardContent}
                      onPress={() => forwardscreen(item)}>
                      {item.image == null ? (
                        <Image
                          style={[styles.image, styles.imageContent]}
                          source={{
                            uri: 'https://img.icons8.com/ultraviolet/344/user.png',
                          }}
                        />
                      ) : (
                        item.image !== null && (
                          <Image
                            source={{
                              uri: `data:image/png;base64,${item.image}`,
                            }}
                            style={[styles.image, styles.imageContent]}
                          />
                        )
                      )}

                      <Text style={styles.name}>{item.fullName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => MessagesScreen(props)}>
                      <Image
                        source={{
                          uri: 'https://img.icons8.com/bubbles/344/messages-mac.png',
                        }}
                        style={[styles.image, styles.imageContent]}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.cardContent, styles.tagsContent]}>
                    <Text style={styles.time}>{item.jobDescription}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 20,
    color: '#101010',
    marginTop: 60,
    fontWeight: '700',
  },
  listItem: {
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  metaInfo: {
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    width: 200,
    padding: 10,
  },
  employeeview: {
    justifyContent: 'flex-start',
    paddingTop: 30,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingBottom: 20,
  },
  title: {
    color: colors.blue,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  row: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    elevation: 10,
  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 220,
  },
  nameTxt: {
    //marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: RFPercentage(2),
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontWeight: '400',
    color: 'black',
    fontSize: RFPercentage(1.5),
  },
  icon: {
    height: 25,
    width: 20,
    tintColor: 'black',
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#eeeeee',
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    color: 'black',
  },
  btnSend: {
    backgroundColor: '#00BFFF',
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationList: {
    marginTop: 20,
    padding: 10,
  },
  card: {
    height: null,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    borderTopWidth: 40,
    marginBottom: 20,
  },
  cardContent: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  imageContent: {
    marginTop: -40,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    alignSelf: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  imageContent: {
    marginTop: -40,
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
export default EmployeeScreen;
