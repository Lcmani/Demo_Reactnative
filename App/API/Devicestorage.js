import AsyncStorage from '@react-native-async-storage/async-storage';
 export const getData = async (key) => {
    // get Data from Storage
    try {
            const data = await AsyncStorage.getItem(key);
            if (data !== null&&data!==undefined) {
                 //  console.log(data);
                    return data;
            }
    } catch (error) {
            console.log(error);
    }
};
export const setData = async (key,data) => {
        // set Data from Storage
        try {
                 await AsyncStorage.setItem(key,data);
        
        } catch (error) {
                console.log(error);
        }
    };

    