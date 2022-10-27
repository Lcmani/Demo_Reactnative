import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "react-native-axios";
import jwtDecode from "jwt-decode";

export const Refreshfunction = async (accessToken) => {

        if (accessToken !== '') {
                let decode = jwtDecode(accessToken);
                var email = (decode.email);
                const getData = async (key) => {
                        // get Data from Storage
                        try {
                                const data = await AsyncStorage.getItem(key);
                                if (data !== null) {
                                        console.log(data);
                                        return data;
                                }
                        } catch (error) {
                                console.log(error);
                        }
                };
                await getData("refreshToken")
                        .then(data => data)
                        .then(value => {

                                console.log("Refresh Value:  " + value)
                                let oldrefresh = value;
                                apifn(oldrefresh,accessToken);
                        })
                        .catch(err => console.log(err))
               


        }




}

export  const apifn = async (oldrefresh,accessToken) => {
        if (accessToken !== '') {
                let decode = jwtDecode(accessToken);
                var email = (decode.email);
        let url = `http://135.181.194.241:8090/attendance-auth-service/unnamed-auth-service/user/refreshToken`;
        const body = JSON.stringify({

                "email": email,
                "refreshToken": oldrefresh

        });
        console.log("body in refresh token function", body);

        const response = await axios.post(url, body);
        console.log("response in refreshfunction", response);
        return response;
}
}