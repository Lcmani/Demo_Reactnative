import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshtoken_fn } from "./Apifunctions";
import { setData } from "./Devicestorage";

export const Refresh_fullcode =(accessToken,refreshToken)=>{
    
        refreshtoken_fn(accessToken,refreshToken)
        .then((res)=>{
          console.log('response in refresh',res);
          AsyncStorage.removeItem("accesstoken");
          AsyncStorage.removeItem("refreshtoken");
          setData("accesstoken",res.accessToken)
          setData("refreshtoken",res.refreshToken)
          console.log('New access token in calendar',accessToken);
          console.log('New refreshtoken in calendar',refreshToken);
          return res;
      
        })
        .catch((err)=>{
                props.navigation.navigate("Signin");
                console.log(err);
        })
    

}