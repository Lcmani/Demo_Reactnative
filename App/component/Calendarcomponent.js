import React from "react";
import { Dimensions } from "react-native";
import { Calendar, CalendarList} from "react-native-calendars";
const HEIGHT = Dimensions.get('window').height;

const Calendarcomponent=(props)=>{
    return(
        <Calendar

          hideExtraDays={true}

          // style={{
          //   //height: HEIGHT - 450,
          //   //flex:0.5

          // }}


          theme={{

            backgroundColor: 'white',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'black',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: 'black',
            indicatorColor: 'black',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,


          }}
          //disabledByDefault={true}
          onDayPress={props.ondayPress}
          maxDate={props.maxdate}
          markingType={'custom'}
         // markingType={'multi-dot'}
          //disabledDaysIndexes={[0,6]}
          dayComponent={props.dayComponent}

          markedDates={props.markedDates}
          onMonthChange={props.onmonthchange}
          onPressArrowLeft={props.leftarrow}

        />

    );
}

export default Calendarcomponent;