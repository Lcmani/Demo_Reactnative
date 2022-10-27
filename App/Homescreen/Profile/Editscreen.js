import React, { useState, useEffect } from 'react';
import {
    Text, StyleSheet, View,
    Image, MapView, SafeAreaView,
    Pressable, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Dimensions, PermissionsAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "react-native-axios";
import { colors } from '../../component/Colours';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const WIDTH = Dimensions.get('window').width;
import ImagePicker, { openCamera } from 'react-native-image-crop-picker';
import MainModal from '../../component/Modal';
import { getData } from "../../API/Devicestorage";
import { BASE_URL, UPDATE_DETAILS, UPLOAD_IMAGE } from '../../API/apiconstants';
import { updateuser_fn, refreshtoken_fn } from '../../API/Apifunctions';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';


import moment from 'moment';
const UserEdit = props => {
    const [modalvisible, setmodalvisible] = useState(false);
    const [id, setId] = useState();
    const [input, setinput] = useState('');
    const [mobileNo, setMobileNo] = useState('')
    const [address, setAddress] = useState('')
    const [bloodGroup, setBloodGroup] = useState('')
    const [panNumber, setpanNumber] = useState('')
    const [uanNumber, setuanNumber] = useState('')
    const [fatherName, setfatherName] = useState('')
    const [department, setDepartment] = useState('')
    const [show, setShow] = useState(false);
    const [to_show, settoShow] = useState(false);
    const [accessToken, setaccesstoken] = useState('');
    const [refreshToken, setrefreshtoken] = useState('');
    const [isLoading, setloading] = useState(true);
    const [image, setImage] = useState('');
    const [imageData, setImageData] = useState('');
    const [isVisbleImage, setIsVisbleImage] = useState(true);
    const [storage, setStorage] = useState('');
    const [male, setMale] = useState(false);
    const [female, setFemale] = useState(false);
    const [gender, setGender] = useState('');
    const [mode, setMode] = useState('date');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [textshow, settextshow] = useState(false);
    const [textshow2, settextshow2] = useState(false);
    const [savebutton, setsavebtn] = useState(false);
    const [value, setValue] = useState('');
    const [schedule1, setschedule1] = useState(false);
    const [schedule2, setschedule2] = useState(false);
    const [datechange, setdatechange] = useState(false);
    const [datechange2, setdatechange2] = useState(false);

    var data = props.route.params.responsedata
    const getAccesstoken = async () => {
        await getData("accesstoken")
            .then(data => data)
            .then(value => {

                //console.log(" Value:  " + value);
                setaccesstoken(value);

            })
            .catch(err => console.log(err))

    }
    const getrefreshtoken = async () => {
        await getData("refreshtoken")
            .then(data => data)
            .then(value => {
                // console.log(" Value:  " + value);
                setrefreshtoken(value);
            })
            .catch(err => console.log(err))

    }

    const genderMale = () => {
        setMale(true);
        setFemale(false)
        setGender('Male')
    }
    const genderFemale = () => {
        setMale(false);
        setFemale(true);
        setGender('FeMale')
    }

    const onChange = (event, selectedDate) => {
        setdatechange(true);
        console.log("event", event);
        const currentDate = selectedDate;
        setDateOfJoining(moment(currentDate).format("YYYY-MM-DD"));
        console.log("edit", dateOfJoining);
        setschedule1(false);
        settextshow(true);
        setShow(false);
        console.log(textshow);
        console.log(schedule1);
    };
    const onChange_todate = (event, selectedDate2) => {
        setdatechange2(true);
        const currentDate2 = selectedDate2;
        setDateOfBirth(moment(currentDate2).format("YYYY-MM-DD"));
        //  console.log(to_date);
        setschedule2(false);
        settextshow2(true);
        settoShow(false);
        console.log(textshow2);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showMode_todate = (currentMode) => {
        settoShow(true);
        setMode(currentMode);
    };

    useEffect(() => {
        setShow(false);
        settoShow(false);
    }, [show, to_show])


    const Edituser = async () => {

        const id = data.id
        const A = data.address;
        const M = data.mobileNo;
        const B = data.bloodGroup;
        const D = data.dateOfBirth;
        const Dept = data.Dept;
        const DOB = data.DatteofBirth;
        const FN = data.fatherName;
        const PAN = data.PAN;
        const UAN = data.UAN;
        const email = data.email;
        const fullName = data.fullName;
        const jobDescription = data.jobDescription;
        const g = data.gender;
        setsavebtn(true);
        // console.log("in first if class");
        // console.log(data.mobileNo);
        // console.log(data.address);
        // console.log(data.bloodGroup);
        if (mobileNo === '' || address === '' || bloodGroup === '' || dateOfBirth === '' || dateOfJoining === '' || department === '' || fatherName === '' || panNumber === '' || uanNumber === '' || gender === '') {
            if (mobileNo === '') {
                console.log(data.mobileNo);
                setMobileNo(data.mobileNo);
                console.log(mobileNo);
            }
            if (address === '') {
                console.log(data.personalAddressLine1);
                setAddress(data.personalAddressLine1)
                console.log(address);
            }
            if (bloodGroup === '') {
                console.log(data.bloodGroup);
                setBloodGroup(data.bloodGroup);
                console.log(bloodGroup);
            }
            if (dateOfJoining === '') {
                console.log(data.dateOfJoining);
                setDateOfJoining(data.dateOfJoining);
                console.log(dateOfJoining);
            }
            if (dateOfBirth === '') {
                // console.log(data.);
                setDateOfBirth(data.dateOfBirth);
                console.log(dateOfBirth);
            }
            if (department === '') {
                console.log(data.department);
                setDepartment(data.department);
                console.log(department);
            }
            if (fatherName === '') {
                console.log(data.fatherName);
                setfatherName(data.fatherName);
                console.log(fatherName);
            }
            if (gender === '') {
                console.log(data.gender);
                setGender(data.gender);
                console.log(gender);
            }
        }


        if (A === '' || M === '' || B === '' || D === '' || Dept === '' || DOB === '' || FN === '' || PAN === '' || UAN === '' || g === '') {
            console.log("in  elseif class");
            if (A === '') {
                setAddress(address);
            } else if (M === '') {
                setMobileNo(mobileNo)
            } else if (B === '') {
                setBloodGroup(bloodGroup);

            } else if (D === '') {
                setDateOfJoining(dateOfJoining);
            }
            else if (Dept === '') {
                setDepartment(department);
            }
            else if (DOB === '') {
                setDateOfBirth(dateOfBirth);
            }
            else if (FN === '') {
                setfatherName(fatherName);
            }
            else if (g === '') {
                setGender(value);
            }
            else {
                setAddress(address);
                setBloodGroup(bloodGroup);
                setMobileNo(mobileNo);
                setDateOfJoining(dateOfJoining);
                setDepartment(department);
                setDateOfBirth(dateOfBirth);
                setfatherName(fatherName);
                setGender(value);
            }



        }

        if (address !== '' && mobileNo !== '' && bloodGroup !== '' && id !== '' && accessToken !== '' && dateOfBirth !== '' && dateOfJoining !== '' && department !== '' && fatherName !== '' && gender !== '') {
            console.log("in else class api call");
            updateuser_fn(address, bloodGroup, dateOfBirth, dateOfJoining, department, email, fatherName, fullName, gender, id, jobDescription, mobileNo, accessToken)
                .then(function (response) {

                    console.log('response in update user', response);
                    input.clear();
                    setsavebtn(false);
                    props.navigation.navigate("Profile");


                })
                .catch(function (error) {
                    console.log(error);
                    console.log('There has been a problem with your axios operation: ' + error.message);

                    throw error;

                })
        }
    }
    const updateimage = (image) => {
        const header = {
            'Authorization': accessToken,
            'Content-Type': 'multipart/form-data',
        }

        const formData = new FormData();
        formData.append("file", {
            uri: image,
            type: 'image/jpeg',
            name: 'selfie.jpg'
        });
        console.log("image for formdata", formData);
        const id_parameter = `&id=${encodeURIComponent(data.id)}`
        let urlImage = `${BASE_URL}${UPLOAD_IMAGE}${id_parameter}`;
        axios.post(urlImage, formData, { headers: header })
            .then(function (response) {

                console.log('response in update image', response);



            })
            .catch(function (error) {
                console.log(error);
                console.log('There has been a problem with your axios operation: ' + error.message);

                throw error;

            })
    }
    useEffect(() => {
        getAccesstoken();
        getrefreshtoken();
        setloading(false);
        console.log("Data props", data);
        if (savebutton === false) {
            console.log('savebtn false');
        } else {
            Edituser();
        }

    }, [accessToken, refreshToken, mobileNo, address, bloodGroup, savebutton, value]);
    useEffect(() => {
        console.log("Gender in useeffect", gender);
        if (data.dateOfJoining !== '') {
            setschedule1(true);
        }
        if (data.dateOfBirth !== '') {
            setschedule2(true);
        }
    }, [gender])
    useEffect(() => {
        if (image) {
            setIsVisbleImage(false)
        }
    }, [image])
    useEffect(() => {
        if (datechange === false) {
            console.log(datechange);
        } else {
            onChange();


        }


    }, [datechange])
    useEffect(() => {

        if (datechange2 === false) {
            console.log(datechange);
        } else {
            onChange_todate();

        }

    }, [datechange2])


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }




    const launchcamera = async () => {
        setmodalvisible(false);
        if (Platform.OS === 'android') {
            // Calling the permission function
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Example App Camera Permission',
                    message: 'Example App needs access to your camera',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                ImagePicker.openCamera({
                    width: 300,
                    height: 400,
                    cropping: true,
                }).then(image => {
                    console.log(image);
                    setImage(image.path);
                    updateimage(image.path);
                });
            } else {
                // Permission Denied
                alert('CAMERA Permission Denied');
            }
        } else {
            console.log("end");
        }
    }
    const opengallery = () => {
        setmodalvisible(false);
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
            setImage(image.path);
            updateimage(image.path);
            //   this.bs.current.snapTo(1);
        });
    }
    const Modalopen = () => {
        setmodalvisible(!modalvisible);
    }
    const backscreen = (props) => {
        setschedule2(false);
        settextshow2(false);
        setschedule1(false);
        settextshow(false);
        props.navigation.navigate('Profile');
    }
    const cancel_btn = (props) => {
        setAddress('');
        setBloodGroup('');
        setMobileNo('');
        setschedule2(false);
        settextshow2(false);
        setschedule1(false);
        settextshow(false);
        props.navigation.navigate('Profile');
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.employeeview} >
                <TouchableOpacity onPress={() => backscreen(props)}>
                    <Image source={require('../../Assets/left-arrow.png')} style={{ width: 25, height: 25, tintColor: '#5297F4', }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={styles.title}>Employee</Text>
                    <View style={{ paddingRight: 10 }}>
                        <Image source={{ uri: 'https://www.coherent.in/images/myimg/Coherent_Logo_02_Black.png' }} style={{ width: 100, height: 30, resizeMode: 'cover' }} />

                    </View>
                </View>
            </View>

            <View style={styles.centeredView}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalView}>

                        <View style={styles.modalViewinside}>

                            {
                                image !== '' &&
                                <Image
                                    resizeMode="cover"
                                    resizeMethod="scale"
                                    style={{ width: 120, height: 120, borderRadius: 70, overflow: 'hidden' }}
                                    source={{
                                        uri: image,
                                    }}
                                />}
                            {isVisbleImage ?
                                <Image style={{ width: 120, height: 120, borderRadius: 70, overflow: 'hidden' }} source={{ uri: `data:image/png;base64,${data.image}` }} />
                                : <Text></Text>}
                        </View>

                    </View>
                    <MainModal
                        Modalvisible={modalvisible}
                        modalswipe={() => Modalopen()}
                        buttonone='OPEN CAMERA'
                        buttontwo='OPEN GALLERY'
                        btn_one_press={() => launchcamera()}
                        btn_two_press={() => opengallery()}
                    />
                </View>
                <View style={{ position: 'relative', top: -15, left: -5, justifyContent: 'center', alignItems: 'center' }}>

                    <View style={styles.imagecircleview_phone}>
                        <TouchableOpacity onPress={() => Modalopen()}>
                            <View style={styles.imagecircleview_phone_blue}>
                                <Image source={{ uri: 'https://png.pngtree.com/png-vector/20190418/ourmid/pngtree-vector-camera-icon-png-image_956080.jpg' }} style={styles.imgstyle_phone} />
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: -20, paddingBottom: 10 }}>
                    <Text style={{ fontSize: 22, color: colors.blue, fontWeight: 'bold' }}>
                        {data.fullName}
                    </Text>
                </View>

                <ScrollView >
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Employee ID
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <View style={styles.editbox}>
                            <Text style={{ textAlign: 'left', fontSize: 15, color: "white", fontWeight: 'bold', padding: 10, flex: 1, width: 180,width: Dimensions.get('window').width-180,marginRight:-10 }}>
                                {data.employeeNumber}
                            </Text>
                        </View>

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Role
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <View style={styles.editbox}>
                            <Text style={{ textAlign: 'left', fontSize: 15, color: "white", fontWeight: 'bold', padding: 10, flex: 1, width: 180,width: Dimensions.get('window').width-180,marginRight:-10 }}>
                                {data.jobDescription}
                            </Text>

                        </View>

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={styles.text1}>
                                Email ID
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                        </View>

                        <View style={styles.editbox}>
                            <Text style={{ textAlign: 'left', fontSize: 14, color: "white", fontWeight: 'bold', padding: 10, flex: 1, width: 180,width: Dimensions.get('window').width-180,marginRight:-10 }}>
                                {data.email}
                            </Text>

                        </View>


                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',alignItems:'center' }}>
                            <Text style={styles.text1}>
                                Contact No
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <KeyboardAwareScrollView>
                            <TextInput style={styles.input_editbox} keyboardType='numeric' ref={input => { setinput(input) }} onChangeText={(value) => setMobileNo(value)} maxLength={10} placeholder={data.mobileNo} placeholderTextColor={'grey'} />
                        </KeyboardAwareScrollView>
                        </View>
                      

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',alignItems:'center' }}>
                            <Text style={styles.text1}>
                                Address
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <KeyboardAwareScrollView>
                            <TextInput style={styles.input_editbox} placeholder={data.personalAddressLine1} onChangeText={(value) => setAddress(value)} ref={input => { setinput(input) }} placeholderTextColor={'grey'} />
                        </KeyboardAwareScrollView>
                        </View>
                       

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',alignItems:'center' }}>
                            <Text style={styles.text1}>
                                Blood Group
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <KeyboardAwareScrollView>
                            <TextInput style={styles.input_editbox} placeholder={data.bloodGroup} onChangeText={(value) => setBloodGroup(value)} ref={input => { setinput(input) }} placeholderTextColor={'grey'} />
                        </KeyboardAwareScrollView>

                        </View>
                       
                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',alignItems:'center' }}>
                            <Text style={styles.text1}>
                                Date Of Joining
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <TouchableOpacity onPress={showMode}>
                            <View style={styles.datepicker}>
                                {
                                    schedule1 ?
                                        <Text style={{ textAlign: 'left', fontSize: 15, color: "grey", paddingTop: 10, paddingLeft: 3, flex: 1, width: 180 }}> {data.dateOfJoining} </Text>
                                        :
                                        textshow ?
                                            <Text style={{ textAlign: 'left', fontSize: 15, color: "black", paddingTop: 10, paddingLeft: 3, flex: 1, width: 180 }}>{dateOfJoining}</Text>
                                            :
                                            <Text></Text>
                                }
                            </View>
                        </TouchableOpacity>
                        </View>
                        
                        <View style={{ flexDirection: 'row' }}>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={new Date()}
                                    mode={mode}
                                    onChange={onChange}
                                    minimumDate={new Date("01-29-2015")}
                                    maximumDate={new Date()}
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',alignItems:'center' }}>
                            <Text style={styles.text1}>
                                Department
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <KeyboardAwareScrollView>
                            <TextInput style={styles.input_editbox} placeholder={data.department} onChangeText={(value) => setDepartment(value)} ref={input => { setinput(input) }} placeholderTextColor={'grey'} />
                        </KeyboardAwareScrollView>
                        </View>
                       

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',alignItems:'center' }}>
                            <Text style={styles.text1}>
                                Gender
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                            <TextInput style={styles.input_editbox} placeholder={data.gender} onChangeText={(value) => setGender(value)} ref={input => { setinput(input) }} />
                            {/* <View style={{borderColor: colors.slate_gray, flexDirection:'row', borderWidth: 1, borderRadius: 5,
                                 width:Dimensions.get('window').width - 180,fontSize: 14,color:'black',backgroundColor: "white", height:40,color:'black',alignItems:'center'}}>
                         
                         <RadioButton.Group onValueChange={value =>setGender(value)} value={gender}>
                         <View style={{flexDirection:'row'}}>
                         <RadioButton.Item label="M" value="Male"  color={colors.blue}/>
                         <RadioButton.Item label="F" value="Female"  color={colors.blue}/>
                         </View>
                         </RadioButton.Group>
                        
                        </View> */}
                        </View>
                        </View>
                        

                    </View>
                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',alignItems:"center" }}>
                            <Text style={styles.text1}>
                                Date Of Birth
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <TouchableOpacity onPress={showMode_todate}>
                            <KeyboardAwareScrollView style={styles.datepicker}>
                                {
                                    schedule2 ?
                                        <Text style={{ textAlign: 'left', fontSize: 15, color: "grey", paddingTop: 10, paddingLeft: 3, flex: 1, width: 180 }}>{data.dateOfBirth}  </Text>
                                        :
                                        textshow2 ?
                                            <Text style={{ textAlign: 'left', fontSize: 15, color: "black", paddingTop: 10, paddingLeft: 3, flex: 1, width: 180 }}> {dateOfBirth} </Text>
                                            :
                                            <Text></Text>
                                }


                            </KeyboardAwareScrollView>
                        </TouchableOpacity>
                        </View>
                       
                        <View style={{ flexDirection: 'row' }}>
                            {to_show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={new Date()}
                                    mode={mode}
                                    onChange={onChange_todate}
                                    minimumDate={new Date("01-01-1985")}
                                    maximumDate={new Date()}
                                />
                            )}
                        </View>
                    </View>


                    <View style={styles.parent_scrollview}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row',alignItems:'center' }}>
                            <Text style={styles.text1}>
                                Father's/Spouse name
                            </Text>
                            <Text style={{ textAlign: 'left', fontSize: 16, color: colors.blue, fontWeight: 'bold', padding: 10 }}>
                                :
                            </Text>
                            <KeyboardAwareScrollView>
                            <TextInput style={styles.input_editbox} placeholder={data.fatherName} placeholderTextColor={'grey'} onChangeText={(value) => setfatherName(value)} ref={input => { setinput(input) }} />
                        </KeyboardAwareScrollView>
                        </View>
                      

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20 }}>

                        <TouchableOpacity onPress={() => cancel_btn(props)}>
                            <View style={styles.btnview}>
                                <Text style={{ fontSize: 20, color: 'white' }}>
                                    Cancel
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Edituser()}>
                            <View style={styles.btnview}>
                                <Text style={{ fontSize: 20, color: 'white' }}>
                                    Save
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>


        </View >
    );
}
const styles = StyleSheet.create({
    btnview: {
        borderColor: '#5297F4',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: WIDTH - 250,
        height: 40,
        // marginLeft:60,
        //marginTop:100,
        backgroundColor: '#5297F4',
        borderRadius: 12,

    },
    parent_scrollview: {

        flex: 1,
        flexDirection: 'row',
        marginVertical: 5
    },
    editbox: {
        borderColor: colors.slate_gray,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.light_slate_gray,
        width: Dimensions.get('window').width - 180,
        justifyContent:'center'



    },

    datepicker: {
        borderColor: colors.slate_gray,
        borderWidth: 1,
        borderRadius: 5,
        width: Dimensions.get('window').width - 180,
        fontSize: 14,
        color: 'black',
        backgroundColor: "white",
        height: 40,
        color: 'black',
        textAlign: 'left',

    },


    input_editbox: {
        borderColor: colors.slate_gray,
        borderWidth: 1,
        borderRadius: 5,
        width: Dimensions.get('window').width - 180,
        fontSize: 14,
        color: 'black',
        backgroundColor: "white",
        height: 40,
        color: 'black',
        textAlign: 'left',
        marginTop: 5



    },
    employeeview: {
        justifyContent: 'flex-start',
        paddingTop: 30,
        flexDirection: 'row',
        paddingLeft: 5,
        paddingBottom: 60
    },
    title: {
        color: colors.blue,
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 5,
        justifyContent: "flex-start",
        alignItems: 'baseline'

    },
    imagecircleview_phone: {
        width: 40,
        height: 40,
        backgroundColor: '#5297F4',
        // margin:10,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingLeft:10,
        position: 'relative',
        left: 50,
        top: -20
    },

    centeredView: {
        flex: 0.97,
        //alignItems: "center",
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#f2f3f9',
        borderRadius: 10
    },
    imagecircleview_phone_blue: {
        width: 20,
        height: 20,
        backgroundColor: 'blue',
        // margin:10,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
        // paddingLeft:10,
        // position:'relative',
        // left:30
    },
    imgstyle_phone: {
        width: 20,
        height: 20,
        //tintColor: 'white',
        resizeMode: 'cover',

        // overflow: 'hidden'
    },
    modalView: {
        // margin: 20,
        backgroundColor: "white",
        borderRadius: 70,
        //padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 120,
        height: 120,
        marginTop: -50
    },
    modalViewinside: {
        // margin: 20,
        //backgroundColor: "white",
        borderRadius: 70,
        //padding: 35,
        alignItems: "center",

        width: 120,
        height: 120,
        //marginTop: -90
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        padding: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },




    header: {
        backgroundColor: "#d3d3d3",
        height: 520,
        marginHorizontal: 20,
        borderRadius: 10
    },
    avatar: {
        width: 40,
        height: 40,
        borderColor: 'blue',
        backgroundColor: 'blue',
        borderRadius: 20,

    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',

    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        // marginTop: 10,
        // margin: 15,
        paddingRight: 10,
        color: '#5297F4',

    },
    description: {
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'grey',
        width: 190,
        justifyContent: 'flex-start',

    },

    screen: {
        flex: 1,

        alignItems: 'center',
        padding: 55,
        paddingTop: 150
    },
    details: {
        color: '#5297F4',
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 10
    },
    fullName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#5297F4'
    },
    empId: {
        marginVertical: 20,
        width: '100%',
        flex: 1,
        marginStart: 5
    },
    CaptionID: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 10,
        color: '#5297F4',
        width: 110,
        paddingBottom: 10
    },
    inputId: {
        textAlignVertical: 'center',
        fontWeight: 'bold',
        backgroundColor: '#dcdcdc',
        padding: 10,
        height: 35,
        width: '60%',

    },
    gridItem: {
        flex: 1,
        margin: 15,
        height: 70,
    },
    textInput: {
        padding: 10,
        height: 35,
        width: '59.6%',
        fontWeight: 'bold',
        backgroundColor: 'white'
    },
    buttonContainers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingTop: 10,
        paddingHorizontal: 55,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingTop: 40,
        paddingHorizontal: 15,
        alignSelf: 'center',
        alignItems: 'center'
    },
    button: {
        width: 100
    },
    imageViewContainer: {
        backgroundColor: 'gray',
        height: 100,
        width: 100,
        borderRadius: 50,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageOverlay: {
        backgroundColor: 'rgba(0,0,0,1)'
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: 250,
        paddingBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    imageContainer: {
        padding: 30
    },
    image: {
        width: 400,
        height: 300,
        resizeMode: 'cover'
    },
    text1: {
        textAlign: 'left',
        fontSize: 16,
        color: colors.blue,
        fontWeight: 'bold',
        padding: 10,
        width: 120
    }

});

export default UserEdit;
