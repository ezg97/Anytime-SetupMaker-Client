const { employees } = require('./Employees');
const { dayLabor } = require('./DayLabor');

function scheduleAlgo(){


    let total_labor = 0;

    let avg_FT = 0;
    let avg_PT = 0;
    let emps_FT = 0;
    let emps_PT = 0;
    

    /* 
        Create lists of Fulltime and Partime Employees 
    */
   emps_FT = employees.filter(emp => {
        if(emp.availability === "FT"){
            return emp;
        }
    });

    emps_PT = employees.filter(emp => {
        if(emp.availability === "PT"){
            return emp;
        }
    });


    /* 
        Save the total amount of hours that labor is needed for into the "total_labor" variable.
    */
    dayLabor.map(hour => {
        if(parseInt(hour.sunday) > 0){
            total_labor += parseInt(hour.sunday);
        }
        if(parseInt(hour.monday) > 0){
            total_labor += parseInt(hour.monday);
        }
        if(parseInt(hour.tuesday) > 0){
            total_labor += parseInt(hour.tuesday);
        }
        if(parseInt(hour.wednesday) > 0){
            total_labor += parseInt(hour.wednesday);
        }
        if(parseInt(hour.thursday) > 0){
            total_labor += parseInt(hour.thursday);
        }
        if(parseInt(hour.friday) > 0){
            total_labor += parseInt(hour.friday);
        }
        if(parseInt(hour.saturday) > 0){
            total_labor += parseInt(hour.saturday);
        }
    })


    /* 
        Save each each day's hour labor requirement to it's own list
    */
   let sundayLabor = dayLabor.filter(hour =>{
        if(parseInt(hour.sunday) > 0){
            return {
                'time': hour.time,
                'labor': hour.sunday
            }
        }
    });
    sundayLabor = sundayLabor.map(hour =>{
        if(parseInt(hour.sunday) > 0){
            return {
                'time': hour.time,
                'labor': hour.sunday
            }
        }
    });

    let mondayLabor = dayLabor.filter(hour =>{
        if(parseInt(hour.monday) > 0){
            return {
                'time': hour.time,
                'labor': hour.monday
            }
        }
    });
    mondayLabor = mondayLabor.map(hour =>{
        if(parseInt(hour.monday) > 0){
            return {
                'time': hour.time,
                'labor': hour.monday
            }
        }
    });

    let tuesdayLabor = dayLabor.filter(hour =>{
        if(parseInt(hour.tuesday) > 0){
            return {
                'time': hour.time,
                'labor': hour.tuesday
            }
        }
    });
    tuesdayLabor = tuesdayLabor.map(hour =>{
        if(parseInt(hour.tuesday) > 0){
            return {
                'time': hour.time,
                'labor': hour.tuesday
            }
        }
    });

    let wednesdayLabor = dayLabor.filter(hour =>{
        if(parseInt(hour.wednesday) > 0){
            return {
                'time': hour.time,
                'labor': hour.wednesday
            }
        }
    });
    wednesdayLabor = wednesdayLabor.map(hour =>{
        if(parseInt(hour.wednesday) > 0){
            return {
                'time': hour.time,
                'labor': hour.wednesday
            }
        }
    });

    let thursdayLabor = dayLabor.filter(hour =>{
        if(parseInt(hour.thursday) > 0){
            return {
                'time': hour.time,
                'labor': hour.thursday
            }
        }
    });
    thursdayLabor = thursdayLabor.map(hour =>{
        if(parseInt(hour.thursday) > 0){
            return {
                'time': hour.time,
                'labor': hour.thursday
            }
        }
    });

    let fridayLabor = dayLabor.filter(hour =>{
        if(parseInt(hour.friday) > 0){
            return {
                'time': hour.time,
                'labor': hour.friday
            }
        }
    });
    fridayLabor = fridayLabor.map(hour =>{
        if(parseInt(hour.friday) > 0){
            return {
                'time': hour.time,
                'labor': hour.friday
            }
        }
    });

    let saturdayLabor = dayLabor.filter(hour =>{
        if(parseInt(hour.sunday) > 0){
            return {
                'time': hour.time,
                'labor': hour.saturday
            }
        }
    });
    saturdayLabor = saturdayLabor.map(hour =>{
        if(parseInt(hour.sunday) > 0){
            return {
                'time': hour.time,
                'labor': hour.saturday
            }
        }
    });

    
    /* 
        Average amount of hours available to Full Time employees 
    */
    avg_FT = total_labor/emps_FT.length;


    /* 
       If the average is above 40 hours (overtime), then disperse the extra hours to Part Time employees 
    */
    if(avg_FT>40){
        //The max hours fulltimers will work subtracted from the total hours we need. 
        // Then, divide that by how many part time employees and that's how many hours we need
        // the part time employees to work.
        avg_PT = ( total_labor - (40 * emps_FT.length) ) / emps_PT.length;

        // If the Part Time employees have all received 40hrs, then overtime must be dispersed
        if(avg_PT>40){
            //let total_OT = total_labor - ( (avg_FT * emps_FT.length) + (avg_PT * emps_PT.length) );
            //let avg_OT = total_OT/(emps_FT.length+emps_PT.length);

            //generate schedule, OT for all/same hours for all
            avg_FT = (total_labor/employees.length);
            avg_PT = (total_labor/employees.length);
            generateSchedule(avg_FT, avg_PT)

        }
        else{
            //FullTime employees only have to work 40 hours and part timers pick up the slack
            generateSchedule(40,avg_PT)
        }

    }
    else{
        //disperse hours to FT employees ONLY
        generateSchedule(avg_FT)
    }


    function generateSchedule(avgHrsWeekFT,avgHrsWeekPT=0){
        
        let daysOpen = (sundayLabor.length > 1? 1:0) + (mondayLabor.length > 1? 1:0)
                        + (tuesdayLabor.length > 1? 1:0) + (wednesdayLabor.length > 1? 1:0)
                        + (thursdayLabor.length > 1? 1:0) +(fridayLabor.length > 1? 1:0)
                        + (saturdayLabor.length > 1? 1:0);
    
        let avgHrsDay = Math.ceil(avgHrsWeekFT/daysOpen);
        let avgHrsDayPT = Math.ceil(avgHrsWeekPT/daysOpen);
    
        if(avgHrsWeekPT > 0){
            Array.prototype.push.apply(emps_FT,emps_PT); 
        }
    
        const schedule = emps_FT.map(emp => {    
    
                let startTime = [];
                let endTime = [];
                let boolStart = false;
                let boolContinue = true;
    
                //initialize count
                let count = 0

                let weekLabor = [ sundayLabor, mondayLabor, tuesdayLabor, wednesdayLabor, thursdayLabor, fridayLabor, saturdayLabor ];

                for(let i=0; i<weekLabor.length; i++){
                    boolStart = false;
                    boolContinue = true;
        
                    //initialize count
                    count = 0;

                    weekLabor[i].forEach( (hour,index) => {
                        if(parseInt(hour.labor) > 0 && boolContinue===true){
                            //add to count
                            count++;
        
                            //grab start time
                            if(boolStart===false){
                                startTime[i] = hour.time;
                                boolStart = true;
                            }
                            
                            //decrement hour of labor since it's now been assigned 
                            hour.labor = parseInt(hour.labor) - 1;
        
                            //grab end time
                            if(weekLabor[i][index+1] == undefined? true:false){
                                // 1) if at the end of the list
                                const endHour = incrementHour(hour.time);
                                endTime[i] = endHour;
                                boolContinue = false;
                            }
                            else{
                                if(parseInt(weekLabor[i][index+1].labor) == 0 || (emp.availability == "FT"? avgHrsDay:avgHrsDayPT) ===count){
                                // 2) if next hour doesn't need a worker OR 3) if max hours for day has been worked
                                    const endHour = incrementHour(hour.time);
                                    endTime[i] = endHour;
                                    boolContinue = false;
                                }
                            }
        
                        }
                    })
                }
    
    
                return {
                    'name':emp.name,
                    'sunday': `${startTime[0] == undefined? 'OFF':startTime[0]+'-'+endTime[0]}`,
                    'monday': `${startTime[1] == undefined? 'OFF':startTime[1]+'-'+endTime[1]}`,
                    'tuesday': `${startTime[2] == undefined? 'OFF':startTime[2]+'-'+endTime[2]}`,
                    'wednesday': `${startTime[3] == undefined? 'OFF':startTime[3]+'-'+endTime[3]}`,
                    'thursday': `${startTime[4] == undefined? 'OFF':startTime[4]+'-'+endTime[4]}`,
                    'friday': `${startTime[5] == undefined? 'OFF':startTime[5]+'-'+endTime[5]}`,
                    'saturday': `${startTime[6] == undefined? 'OFF':startTime[6]+'-'+endTime[6]}`
                }
            })
        module.exports = { schedule };
    }
    
}

function incrementHour(time){
    let newTime;

    if(time.includes('AM') ){

        newTime = time.split('AM');

        newTime = parseInt(newTime) + 1;

        if(newTime == 12){
            newTime += "PM";
        }
        else{
            newTime += "AM";
        }
    }
    else{

        newTime = time.split('PM');

        newTime = parseInt(newTime) + 1;

        if(newTime == 12){
            newTime += "AM";
        }
        else{
            newTime += "PM";
        }
    }

    return newTime;
}

scheduleAlgo();
