export const maindata_array=(response)=>{
    let responsedata = response.data.data;
    console.log("response data", responsedata);
    let myArray = [];
    const length = responsedata.length;

    for (let i = 0; i < length; i++) {
      if (responsedata[i].isPresent == 1) {
        let data = {};
        let key = responsedata[i].createdAt;
        data[key] = { marked: true, dotColor: 'green' }
        myArray.push(data);
        // console.log("at is present", responsedata[i]);


      } else if (responsedata[i].isPresent == 0) {

        let data = {};
        // console.log("at is absent", responsedata[i]);
        let key = responsedata[i].createdAt;
        data[key] = { marked: true, dotColor: 'red' }
        myArray.push(data);
      }

    }

    //console.log("myArray==>", myArray);
    const alldate = Object.assign({}, ...myArray);
    //console.log(alldate);
   return alldate;
}