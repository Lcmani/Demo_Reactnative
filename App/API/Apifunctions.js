import axios from 'react-native-axios';
import jwtDecode from "jwt-decode";
import { BASE_URL_IN_AUTH,BASE_URL,LOGIN, REFRESH_TOKEN, RESEND_OTP, VERIFY_OTP, LOCATION_VERIFY, ATTENDANCE_PUNCH, GET_BY_DATE, IMAGE_VIEW, PROFILE_GET_BY_ID, UPDATE_DETAILS, LEAVE_REQUEST, LEAVE_LIST, LEAVE_GET_BY_ID, EMP_LIST, EMP_DETAIL, EMP_DETAIL_IMG, LEAVE_CANCEL, LEAVE_PERMISSION, PUNCH_BTN, PERMISSION_REJECT_LIST, LEAVE_REJECT_LIST, LEAVE_PENDING_LIST, USER_PRESENT, USER_ABSENT, USER_LATE, TOTAL_COUNT, LEAVE_REPORT} from './apiconstants';
import {instance} from "./Api"
import { getData } from './Devicestorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Refreshing the token
export const refreshtoken_fn=async()=>{
   
       const token=await AsyncStorage.getItem("keys");
       const parsed=JSON.parse(token);
    console.log(parsed);
    if (parsed.accessToken !== '') {
        let decode = jwtDecode(parsed.accessToken);
        var email = (decode.email);
        let url = `${BASE_URL_IN_AUTH}${REFRESH_TOKEN}`;
        const body = {
          "email": email,
          "refreshToken":parsed.refreshToken
        }
        console.log("body in refresh token function", body);
 const response = await axios.post(url, body);
 if(response){   
    console.log(response);
     return response;  
     
 }
    }
}

//In signin screen.
export const signin_fn =async (email) => {
    const response=axios.post(`${BASE_URL_IN_AUTH}${LOGIN}`, {email})
     return response;  
}

//In otp screen refresh image click
export const refresh_fn=(email)=>{
 const response = axios.post(`${BASE_URL_IN_AUTH}${RESEND_OTP}`,{email})
return response;
}
//In otp screen nextscreen function
export const otpnextscreen=async(email,otp)=>{
    let data = { email, otp: otp };
    console.log(data);
    let url = `${BASE_URL_IN_AUTH}${VERIFY_OTP}`;
    const response=await axios.post(url, data, {});
    console.log("response in api function",response);
    
    return response;

}

//In calendar screen
export const getattendance_fn=async(monthinapi,yearinapi,accessToken)=>{
    if(accessToken!==null ||accessToken!==''){
        let monthapi = parseInt(monthinapi);
        let yearapi = parseInt(yearinapi);
        const headerscalendar = {
    
          "Content-type":"application/json",
          "Authorization":accessToken
        }
        console.log(headerscalendar);
        const params = {
          "month": monthapi,
          "year": yearapi
        };
        const url2=`/data/listbydaysbymonth?month=${encodeURIComponent(params.month)}&year=${encodeURIComponent(params.year)}`
        let url = `${BASE_URL}${url2}`;
      const response=  await instance.get(url)
      return response;
    }else{
        console.log(accessToken);
    }
    
}

//In punchin screen location verify
export const Locationverify_fn=(currentLatitude,currentLongitude,accessToken)=>{
    var latitudeinverify = parseFloat(currentLatitude);
    var longitudeinverify = parseFloat(currentLongitude);

    const headerpunchin = {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
    }
    console.log(headerpunchin);
    let data = {};
    const params = {
        lat: latitudeinverify,
        lng: longitudeinverify
    }
const parameter=`lat=${encodeURIComponent(params.lat)}&lng=${encodeURIComponent(params.lng)}`
    let url = `${BASE_URL}${LOCATION_VERIFY}${parameter}`;

    const response = instance.get(url,{headers: headerpunchin})
    return response;
}
//In punchin screen confirm button
export const Confirmpunchin_fn =(currentLatitude,currentLongitude,accessToken,punchnumber,image,photo)=>{
  if(photo===true){
    let latitude = parseFloat(currentLatitude);
    let longitude = parseFloat(currentLongitude);
    const formData = new FormData();
    formData.append("file", {
        uri: image,
        type: 'image/jpeg',
        name: 'selfie.jpg'
    });
    console.log("image for formdata", formData);
      const headersinconfirm = { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': accessToken
      }
      console.log(headersinconfirm);
      const  params = {  "isLogged": punchnumber,
      "latitude": latitude,
      "longitude": longitude};
      const parameter2=`isLogged=${encodeURIComponent(params.isLogged)}&latitude=${encodeURIComponent(params.latitude)}&longitude=${encodeURIComponent(params.longitude)}`
      let urlinconfirm = `${BASE_URL}${ATTENDANCE_PUNCH}${parameter2}`;
      const response=instance.post(urlinconfirm,formData,{headers: headersinconfirm })
      return response;
  }else{
    let latitude = parseFloat(currentLatitude);
    let longitude = parseFloat(currentLongitude);
      const headersinconfirm = { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': accessToken
      }
      console.log(headersinconfirm);
      const  params = {  "isLogged": punchnumber,
      "latitude": latitude,
      "longitude": longitude};
      const parameter2=`isLogged=${encodeURIComponent(params.isLogged)}&latitude=${encodeURIComponent(params.latitude)}&longitude=${encodeURIComponent(params.longitude)}`
      let urlinconfirm = `${BASE_URL}${ATTENDANCE_PUNCH}${parameter2}`;
      const response=instance.post(urlinconfirm,{},{headers: headersinconfirm })
      return response;
  }

}
//In punchout
export const Confirmpunchin_fn_punchout =(currentLatitude,currentLongitude,accessToken,punchnumber)=>{
    let latitude = parseFloat(currentLatitude);
    let longitude = parseFloat(currentLongitude);
  
    const headersinconfirm = { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':accessToken
    }
    console.log(headersinconfirm);
    const  params = {  "isLogged": punchnumber,
    "latitude": latitude,
    "longitude": longitude};
    const parameter2=`isLogged=${encodeURIComponent(params.isLogged)}&latitude=${encodeURIComponent(params.latitude)}&longitude=${encodeURIComponent(params.longitude)}`
    let urlinconfirm = `${BASE_URL}${ATTENDANCE_PUNCH}${parameter2}`;
    const response=instance.post(urlinconfirm,{},{headers:headersinconfirm })
    return response;
  }
//In profile
export const userdata=async(id,accessToken,data)=>{
    const headers = {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
    }
    const params = {
        id: id,
    }
    const idparameter=`id=${encodeURIComponent(params.id)}`
    if(data===2){
        let url=`${BASE_URL}${IMAGE_VIEW}${idparameter}`
        const response=await axios.get(url, { headers: headers });
        return response;
    }else{
        let urlimage = `${BASE_URL}${PROFILE_GET_BY_ID}${idparameter}`;
        const response=await instance.get(urlimage, { headers: headers });
        return response;
    }
}

//In employee list
export const Employeelist=(accessToken,pageNo,pageSize,search)=>{
    const headerscalendar = {
        "Content-type": "application/json",
        "Authorization":accessToken
      }
 
        const  params = {  "PageNo": pageNo, "PageSize": pageSize, "name": search,"sortBy":'id'};
    const list_parameter=`name=${encodeURIComponent(params.name)}&pageNo=${encodeURIComponent(params.PageNo)}&pageSize=${encodeURIComponent(params.PageSize)}&sortBy=${encodeURIComponent(params.sortBy)}`
        let url = `${BASE_URL}${EMP_LIST}${list_parameter}`;
     const response =instance.get(url, { headers: headerscalendar })
     return response;

}
// In editscreen
export const updateuser_fn=async(address,bloodGroup,dateOfBirth,dateOfJoining,department,email,fatherName,fullName,gender,id,jobDescription,mobileNo, accessToken)=>{
    const headers = {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
    }
    const params = {
        address, mobileNo, bloodGroup, id
    }
    let datainsave =JSON.stringify({
        "personalAddressLine1": address,
        "bloodGroup": bloodGroup,
        "dateOfBirth": dateOfBirth,
        "dateOfJoining": dateOfJoining,
        "department": department,
        "email":email,
        "fatherName":fatherName,
        "fullName":fullName,
        "gender":gender,
        "id":id,
        "jobDescription":jobDescription,
        "mobileNo": mobileNo,
      
    });
    console.log(datainsave);
    //post function
    let url = `${BASE_URL}${UPDATE_DETAILS}`;
   const response= await axios.put(url, datainsave, { headers: headers })
   return response;
}

//In leave request
export const leaverequest=async(fromdate,msg,sub,todate,accessToken,leaveTypeId,Am,halfday)=>{
    if(accessToken !==''){
        const headers = {
            'Authorization': accessToken,
            'Content-Type': 'application/json',
        }
        if(halfday===true){
            const data_halfday =JSON.stringify( {
                "fromDate": fromdate,
                "leaveReason": msg,
                "leaveStatus":Am==='Afternoon'?"2nd Half":"1st Half",
                "masterStatusId": 0,
                "requestTime": 0,
                "requestType": "HalfDay",
                "leaveTypeId":leaveTypeId,
                "subject": sub,
                "toDate": todate
            });
            console.log(data_halfday);
            let url =`${BASE_URL_IN_AUTH}${LEAVE_REQUEST}`;
       const response=  await instance.post(url,data_halfday,{headers: headers })
       return response; 
        }else{

            const data_fullday =JSON.stringify( {
                "fromDate": fromdate,
                "leaveReason": msg,
                "masterStatusId": 0,
                "requestTime": 0,
                "requestType": "Leave",
                "leaveTypeId":leaveTypeId,
                "subject": sub,
                "toDate": todate
            });
            console.log(data_fullday);
            let url =`${BASE_URL_IN_AUTH}${LEAVE_REQUEST}`;
       const response=  await instance.post(url,data_fullday,{headers: headers })
       return response; 
        }
           
                 
}
}

export const leaverequest_reschedule=async(fromdate,msg,sub,todate,accessToken,leaveid,leaveTypeId,Am,halfday)=>{
    
    if(accessToken !==''){
        const headers = {
            'Authorization': accessToken,
            'Content-Type': 'application/json',
        }
        if(halfday===true){
            const data_halfday =JSON.stringify( {
                "fromDate": fromdate,
                "id":leaveid,
                "leaveReason": msg,
                "leaveStatus":Am==='Afternoon'?"2nd Half":"1st Half",
                "masterStatusId": 0,
                "requestTime": 0,
                "requestType": "HalfDay",
                "leaveTypeId":leaveTypeId,
                "subject": sub,
                "toDate": todate
            });
            console.log(data_halfday);
            let url =`${BASE_URL_IN_AUTH}${LEAVE_REQUEST}`;
       const response=  await instance.post(url,data_halfday,{headers: headers })
       return response; 
        }else{

            const data_fullday =JSON.stringify( {
                "fromDate": fromdate,
                "id":leaveid,
                "leaveReason": msg,
                "masterStatusId": 0,
                "requestTime": 0,
                "requestType": "Leave",
                "leaveTypeId":leaveTypeId,
                "subject": sub,
                "toDate": todate
            });
            console.log(data_fullday);
            let url =`${BASE_URL_IN_AUTH}${LEAVE_REQUEST}`;
       const response=  await instance.post(url,data_fullday,{headers: headers })
       return response; 
        }
           
                 
}  
        

}

// In Leave Report

export const Leavereport_fn=(pageNo,pageSize,accessToken,userid)=>{
    const headerpunchin = {
        'Authorization':accessToken,
        'Content-Type': 'application/json',
      }
      const params = { "PageNo": pageNo, "PageSize": pageSize, "sortBy": 'id',"user_id":userid };
      const parameter_list=`pageNo=${encodeURIComponent(params.PageNo)}&pageSize=${encodeURIComponent(params.PageSize)}&sortBy=${encodeURIComponent(params.sortBy)}&user_id=${encodeURIComponent(params.user_id)}`
      let url=`${BASE_URL}${LEAVE_REPORT}${parameter_list}`;
console.log(params);
  const response=instance.get(url,{headers: headerpunchin });
  return response;
 }


// In leave list
export const Leavelist_fn= async (accessToken, pageNo, pageSize) => {
    if (accessToken !== "") {
       
        const headers = {
            "Content-type": "application/json",
            "Authorization": accessToken
        }
        const params = { "PageNo": pageNo, "PageSize": pageSize, "sortBy": 'id' };
        const parameter_list=`pageNo=${encodeURIComponent(params.PageNo)}&pageSize=${encodeURIComponent(params.PageSize)}&sortBy=${encodeURIComponent(params.sortBy)}`
        let url = `${BASE_URL}${LEAVE_LIST}${parameter_list}`;
        const response = instance.get(url, { headers: headers });
        return response;
    }
}
//In completed permission
export const Permissionlist_fn= async (accessToken, pageNo, pageSize) => {
    if (accessToken !== "") {
       
        const headers = {
            "Content-type": "application/json",
            "Authorization": accessToken
        }
        const params = { "PageNo": pageNo, "PageSize": pageSize, "sortBy": 'id' };
        const parameter_list=`pageNo=${encodeURIComponent(params.PageNo)}&pageSize=${encodeURIComponent(params.PageSize)}&sortBy=${encodeURIComponent(params.sortBy)}`
        let url = `${BASE_URL}${PERMISSION_REJECT_LIST}${parameter_list}`;
        const response = instance.get(url, { headers: headers });
        return response;
    }
}
//In completed leave
export const Leavelist_completed_fn= async (accessToken, pageNo, pageSize) => {
    if (accessToken !== "") {
       
        const headers = {
            "Content-type": "application/json",
            "Authorization": accessToken
        }
        const params = { "PageNo": pageNo, "PageSize": pageSize, "sortBy": 'id' };
        const parameter_list=`pageNo=${encodeURIComponent(params.PageNo)}&pageSize=${encodeURIComponent(params.PageSize)}&sortBy=${encodeURIComponent(params.sortBy)}`
        let url = `${BASE_URL}${LEAVE_REJECT_LIST}${parameter_list}`;
        const response = instance.get(url, { headers: headers });
        return response;
    }
}
//In admin leave pending
export const Leavelist_pending_fn= async (accessToken, pageNo, pageSize) => {
    if (accessToken !== "") {
        const headers = {
            "Content-type": "application/json",
            "Authorization": accessToken
        }
        const params = { "PageNo": pageNo, "PageSize": pageSize, "sortBy": 'id' };
        const parameter_list=`pageNo=${encodeURIComponent(params.PageNo)}&pageSize=${encodeURIComponent(params.PageSize)}&sortBy=${encodeURIComponent(params.sortBy)}`
        let url = `${BASE_URL}${LEAVE_PENDING_LIST}${parameter_list}`;
        const response = instance.get(url, { headers: headers });
        return response;
    }
}
//In the employee detail user data
export const getUserData_fn=async(accessToken,userId)=>{

if(accessToken!==''||userId!==''||userId!==undefined){
    const headers = {
        'Authorization':accessToken,
        'Content-Type': 'application/json',
    }
console.log(headers);
    const params = {
        id: userId,
    }
    console.log(params);
    const det_parameter=`id=${encodeURIComponent(params.id)}`;
    let url = `${BASE_URL}${EMP_DETAIL}${det_parameter}`;
    const response= await instance.get(url);
    return response;
}

}

//In the employee detail user image
 export const userimage_fn =async(accessToken,userId)=>{
    const headers = {
        'Authorization':accessToken,
        'Content-Type': 'application/json',
    }
    
    const params = {
        id: userId,
    }
    const idparam=`id=${encodeURIComponent(params.id)}`
    let url = `${BASE_URL}${EMP_DETAIL_IMG}${idparam}`;
    console.log(url);
   const response= await instance.get(url);
   return response;
 }

 export const Getusepresent_fn=(month,year,id)=>{
    
      const  params = { 
        "month":month,
        "user_id":id,
        "year":year
        };
        console.log(params);
      const day_parameter=`month=${encodeURIComponent(params.month)}&user_id=${encodeURIComponent(params.user_id)}&year=${encodeURIComponent(params.year)}`
      let url=`${BASE_URL}${USER_PRESENT}${day_parameter}`;
     
      
console.log(params);
  const response=instance.get(url);
  return response;
 }
 export const Getpiechart_fn=(month,year,id)=>{
    
    const  params = { 
      "month":month,
      "user_id":id,
      "year":year
      };
      console.log(params);
    const day_parameter=`month=${encodeURIComponent(params.month)}&user_id=${encodeURIComponent(params.user_id)}&year=${encodeURIComponent(params.year)}`
    let url=`${BASE_URL}${TOTAL_COUNT}${day_parameter}`;
   
    
console.log(params);
const response=instance.get(url);
return response;
}
 export const Getuseabsent_fn=(month,year,id)=>{

      const  params = { 
        "month":month,
        "user_id":id,
        "year":year
        };
        console.log(params);
      const day_parameter=`month=${encodeURIComponent(params.month)}&user_id=${encodeURIComponent(params.user_id)}&year=${encodeURIComponent(params.year)}`
      let url=`${BASE_URL}${USER_ABSENT}${day_parameter}`;
    
      
console.log(params);
  const response=instance.get(url);
  return response;
 }
 export const Getuserlate_fn=(month,year,id)=>{
    
      const  params = { 
        "month":month,
        "user_id":id,
        "year":year
        };
        console.log(params);
      const day_parameter=`month=${encodeURIComponent(params.month)}&user_id=${encodeURIComponent(params.user_id)}&year=${encodeURIComponent(params.year)}`
      let url=`${BASE_URL}${USER_LATE}${day_parameter}`;
      
      
console.log(params);
  const response=instance.get(url);
  return response;
 }

 // In view logs
 export const viewlogs_fn=(date_log,accessToken)=>{
    const headerpunchin = {

   
        'Authorization':accessToken,
         
        'Content-Type': 'application/json',
       
      }
      const  params = {  "date_log": date_log};
      const day_parameter=`date=${encodeURIComponent(params.date_log)}`
      let url=`${BASE_URL}${GET_BY_DATE}${day_parameter}`;
      console.log(headerpunchin);
      
console.log(params);
  const response=instance.get(url,{headers: headerpunchin });
  return response;
 }

 //In leave status
 export const leave_status_fn=async(accessToken,Id)=>{
    const headers = {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
    }
    const params = {
        id:Id ,
    }
    console.log("userid params", params);
    const leave_parameter=`id=${encodeURIComponent(params.id)}`;
    let url = `${BASE_URL}${LEAVE_GET_BY_ID}${leave_parameter}`

   const response= await instance.get(url, { headers: headers });
   return response;
 }

  //In leave status=>Leave cancel
  export const leave_status_Leave_cancel_fn=async(accessToken,Id,statusId)=>{
    const headers = {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
    }
    const params = {
        id:Id ,
        statusId:4
    }
    console.log("userid params", params);
    const leave_parameter=`id=${encodeURIComponent(params.id)}&statusId=${encodeURIComponent(params.statusId)}`;
    let url = `${BASE_URL_IN_AUTH}${LEAVE_CANCEL}${leave_parameter}`

   const response= await instance.post(url, { headers: headers });
   return response;
 }
 export const leave_status_Leave_approve_fn=async(accessToken,Id,statusId)=>{
    const headers = {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
    }
    const params = {
        id:Id ,
        statusId:1
    }
    console.log("userid params", params);
    const leave_parameter=`id=${encodeURIComponent(params.id)}&statusId=${encodeURIComponent(params.statusId)}`;
    let url = `${BASE_URL_IN_AUTH}${LEAVE_CANCEL}${leave_parameter}`

   const response= await instance.post(url, { headers: headers });
   return response;
 }
 export const leave_status_Leave_reject_fn=async(accessToken,Id,reject_reason)=>{
    const headers = {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
    }
    const params = {
        id:Id ,
        rejectReason:reject_reason,
        statusId:2
    }
    console.log("userid params", params);
    const leave_parameter=`id=${encodeURIComponent(params.id)}&rejectReason=${encodeURIComponent(params.rejectReason)}&statusId=${encodeURIComponent(params.statusId)}`;
    let url = `${BASE_URL_IN_AUTH}${LEAVE_CANCEL}${leave_parameter}`

   const response= await instance.post(url, { headers: headers });
   return response;
 }
export const Permission_leaverequest_=async(accessToken, Per_date_string, fromtime, sub, totime, leaveTypeId)=>{
    if(accessToken !==''){
        const headers = {
            'Authorization': accessToken,
            'Content-Type': 'application/json',
        }
        const datainsave =JSON.stringify( {
            "fromDate":Per_date_string,
            "fromTime":fromtime,
            "leaveTypeId": leaveTypeId,
            "subject":sub,
            "toTime":totime
          });
        console.log(datainsave);
        let url =`${BASE_URL_IN_AUTH}${LEAVE_PERMISSION}`;
   const response=  await instance.post(url,datainsave,{headers: headers })
   return response;
    }
}
export const leaverequest_Permission_reshedule=async(accessToken, Per_date_string,fromtime,sub,totime,leaveTypeId,id)=>{
    if(accessToken !==''){
        const headers = {
            'Authorization': accessToken,
            'Content-Type': 'application/json',
        }
        const datainsave =JSON.stringify( {
            "fromDate":Per_date_string,
            "fromTime":fromtime,
            "leaveTypeId":leaveTypeId,
            "id":id,
            "subject":sub,
            "toTime":totime
          });
        console.log(datainsave);
        let url =`${BASE_URL_IN_AUTH}${LEAVE_PERMISSION}`;
   const response=  await instance.post(url,datainsave,{headers: headers })
   return response;
    }
}

export const Punchin_btn=async(accessToken)=>{
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
        
    }
    console.log("punch btn header",headers);
        let url =`${BASE_URL}${PUNCH_BTN}`;
   const response=  await instance.get(url,{headers: headers })
   return response;
    
}
