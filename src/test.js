    

const { hours } = require('./Hours');

    function scheduleAlgo(employees, dayLabor, operationHours){

            let total_labor = 0;
            let max_labor = 0;
            let longest_shift = 0;
            let shift_length = 0;

            let opnBool = false;

            let avg_FT = 0;
            let avg_PT = 0;
            let emps_FT = 0;
            let emps_PT = 0;
            

            /* 
                Create lists of Fulltime and Partime Employees 
            */
            emps_FT = employees.filter(emp => {
                if(emp.emp_availability === "FT"){
                    return emp;
                }
            });

            emps_PT = employees.filter(emp => {
                if(emp.emp_availability === "PT"){
                    return emp;
                }
            });

            

            operationHours.map(day => {
                opnBool = false;
                shift_length = 0;

                hours.map( hour => {
                    if(day.open_time === hour.time){
                        opnBool = true;
                    }

                    if(opnBool){
                        shift_length += 1
                    }

                    if(day.close_time === hour.time){
                        opnBool = false;
                    }

                    
                });

                if(shift_length > longest_shift){
                    longest_shift = shift_length;
                }
                
            })
            /* 
                Save the total amount of hours that labor is needed for into the "total_labor" variable.
            */
            dayLabor.map(hour => {
                if(parseInt(hour.sunday) > 0){
                    total_labor += parseInt(hour.sunday);
                    if(parseInt(hour.sunday) > max_labor){
                        max_labor = parseInt(hour.sunday);
                    }
                }
                if(parseInt(hour.monday) > 0){
                    total_labor += parseInt(hour.monday);
                    if(parseInt(hour.monday) > max_labor){
                        max_labor = parseInt(hour.monday);
                    }
                }
                if(parseInt(hour.tuesday) > 0){
                    total_labor += parseInt(hour.tuesday);
                    if(parseInt(hour.tuesday) > max_labor){
                        max_labor = parseInt(hour.tuesday);
                    }
                }
                if(parseInt(hour.wednesday) > 0){
                    total_labor += parseInt(hour.wednesday);
                    if(parseInt(hour.wednesday) > max_labor){
                        max_labor = parseInt(hour.wednesday);
                    }
                }
                if(parseInt(hour.thursday) > 0){
                    total_labor += parseInt(hour.thursday);
                    if(parseInt(hour.thursday) > max_labor){
                        max_labor = parseInt(hour.thursday);
                    }
                }
                if(parseInt(hour.friday) > 0){
                    total_labor += parseInt(hour.friday);
                    if(parseInt(hour.friday) > max_labor){
                        max_labor = parseInt(hour.friday);
                    }
                }
                if(parseInt(hour.saturday) > 0){
                    total_labor += parseInt(hour.saturday);
                    if(parseInt(hour.saturday) > max_labor){
                        max_labor = parseInt(hour.saturday);
                    }
                }
            })

     
            /* 
                Save each each day's hour labor requirement to it's own list
            */
            let sundayLabor=0;
            let mondayLabor=0;
            let tuesdayLabor=0;
            let wednesdayLabor=0;
            let thursdayLabor=0;
            let fridayLabor=0;
            let saturdayLabor=0;





           let open_time = 0;
           let close_time = 0;

           let openHour = 0;
           let closeHour = 0;

           let openMidday = 0;
           let closeMidday = 0;

           let openBool = 0;
           let closeBool= 0;


            //This id will access the correct object from the list "operationHours"
            let dayId = -1;

            operationHours.forEach( (obj, id) => {
                if(obj.day === "Sunday"){
                    dayId=id;
                }
            })
            
            if(dayId>=0){

                open_time = operationHours[dayId].open_time;
                close_time = operationHours[dayId].close_time;

                openHour = ( parseInt(open_time.split('AM'))  || parseInt( open_time.split('PM')) );
                closeHour = ( parseInt(close_time.split('AM')) || parseInt(close_time.split('PM')) );

                openMidday = open_time.includes('AM')? 'AM':'PM';
                closeMidday = close_time.includes('AM')? 'AM':'PM';

                openBool = false;
                closeBool= false;

            
                //only include "shift time" and "labor"
                let sunday = dayLabor.filter(hour =>{
                
            
                    //if the current hour has surpassed the "open hour". aka, checking if it's open yet
                    if( (hour.shift_time >= openHour && hour.midday === openMidday && hour.shift_time != 12)
                        ||
                        (hour.shift_time === 12 && openHour === 12)
                        ||
                        (openBool === true)){
                        //if it isn't closed, then continue the "openBool" value as true 
                        if(closeBool===false){
                            openBool=true;
                        }
                                            
                        // if the current hour hasn't surpassed the "closing hour". aka, checking it hasn't closed yet
                        if( (hour.shift_time < closeHour && hour.midday === closeMidday && hour.shift_time != 12 && closeHour !=12)
                            ||
                            //If the current time is in the AM and the closing time is in the PM then it's impossible for the current time to have surpassed the closing time
                            (hour.midday==="AM" && closeMidday==="PM")
                            ||
                            (hour.shift_time === 12 && closeHour != 12))
                            {

                                return {
                                    'shift_time': hour.shift_time+hour.midday,
                                    'labor': hour.monday
                                }
                        }
                        else{
                            // no longer open and now it is closed
                            openBool=false
                            closeBool=true;
                        }
                    }
                    
                });

                sundayLabor = sunday.map(hour =>{
                    return {
                        'shift_time': hour.shift_time+hour.midday,
                        //I have no clue why adding 1 is necessary but without it the labor was continuosly 1 number less
                        'labor': hour.sunday,
                    }
                
            });
        }


            //-------------- Monday

            //This id will access the correct object from the list "operationHours"
            dayId = -1;

            operationHours.forEach( (obj, id) => {
                if(obj.day === "Monday"){
                    dayId=id;
                }
            })
            
            if(dayId>=0){
            
                open_time = operationHours[dayId].open_time;
                close_time = operationHours[dayId].close_time;

                openHour = ( parseInt(open_time.split('AM'))  || parseInt( open_time.split('PM')) );
                closeHour = ( parseInt(close_time.split('AM')) || parseInt(close_time.split('PM')) );

                openMidday = open_time.includes('AM')? 'AM':'PM';
                closeMidday = close_time.includes('AM')? 'AM':'PM';

                openBool = false;
                closeBool= false;

                //if hour.time => open and hour.midday == open.midday and hour.time != 12
                    //or
                    //if hour.time === 12 and open.time === 12 
                    //or
                    //if hour.time ==12 and openBool == true
                        //inside if loop

                        //if hour <= close and midday == midday and hour != 12
                        //or
                        //if hour.time === 12 and close.time === 12 
                        //or
                        //if hour.time ==12 and openBool == true

                        //{
                            // 'shift_time': hour.shift_time+hour.midday,
                            // 'labor': parseInt(hour.sunday)
                        //}

                        //else
                            
                            //if(closeBool === false ){
                                //closeBool = true //bc now it's finally closed
                                
                            //}

                    
                    
                    // if hour.time ===12 and hour.midday === PM and open

                let monday = dayLabor.filter(hour =>{
                    //if the current hour has surpassed the "open hour". aka, checking if it's open yet
                    if( (hour.shift_time >= openHour && hour.midday === openMidday && hour.shift_time != 12)
                        ||
                        (hour.shift_time === 12 && openHour === 12)
                        ||
                        (openBool === true)){
                        //if it isn't closed, then continue the "openBool" value as true 
                        if(closeBool===false){
                            openBool=true;
                        }
                                            
                        // if the current hour hasn't surpassed the "closing hour". aka, checking it hasn't closed yet
                        if( (hour.shift_time < closeHour && hour.midday === closeMidday && hour.shift_time != 12 && closeHour !=12)
                            ||
                            //If the current time is in the AM and the closing time is in the PM then it's impossible for the current time to have surpassed the closing time
                            (hour.midday==="AM" && closeMidday==="PM")
                            ||
                            (hour.shift_time === 12 && closeHour != 12))
                            {

                                return {
                                    'shift_time': hour.shift_time+hour.midday,
                                    'labor': hour.monday
                                }
                        }
                        else{
                            // no longer open and now it is closed

                            openBool=false
                            closeBool=true;
                        }
                    }
                });

                mondayLabor = monday.map(hour =>{
                    
                    return {
                        'shift_time': hour.shift_time+hour.midday,
                        'labor': hour.monday,
                        
                    }
                });

            }

            // TUES

            //This id will access the correct object from the list "operationHours"
            dayId = -1;

            operationHours.forEach( (obj, id) => {
                if(obj.day === "Tuesday"){
                    dayId=id;
                }
            })
            
            if(dayId>=0){

                open_time = operationHours[dayId].open_time;
                close_time = operationHours[dayId].close_time;

                openHour = ( parseInt(open_time.split('AM'))  || parseInt( open_time.split('PM')) );
                closeHour = ( parseInt(close_time.split('AM')) || parseInt(close_time.split('PM')) );

                openMidday = open_time.includes('AM')? 'AM':'PM';
                closeMidday = close_time.includes('AM')? 'AM':'PM';

                openBool = false;
                closeBool= false;

                let tuesday = dayLabor.filter(hour =>{
                    //if the current hour has surpassed the "open hour". aka, checking if it's open yet
                    if( (hour.shift_time >= openHour && hour.midday === openMidday && hour.shift_time != 12)
                        ||
                        (hour.shift_time === 12 && openHour === 12)
                        ||
                        (openBool === true)){
                        //if it isn't closed, then continue the "openBool" value as true 
                        if(closeBool===false){
                            openBool=true;
                        }
                                            
                        // if the current hour hasn't surpassed the "closing hour". aka, checking it hasn't closed yet
                        if( (hour.shift_time < closeHour && hour.midday === closeMidday && hour.shift_time != 12 && closeHour !=12)
                            ||
                            //If the current time is in the AM and the closing time is in the PM then it's impossible for the current time to have surpassed the closing time
                            (hour.midday==="AM" && closeMidday==="PM")
                            ||
                            (hour.shift_time === 12 && closeHour != 12))
                            {

                                return {
                                    'shift_time': hour.shift_time+hour.midday,
                                    'labor': hour.monday
                                }
                        }
                        else{
                            // no longer open and now it is closed
                            openBool=false
                            closeBool=true;
                        }
                    }
                
                });

                tuesdayLabor = tuesday.map(hour =>{
                    return {
                        'shift_time': hour.shift_time+hour.midday,
                        //I have no clue why adding 1 is necessary but without it the labor was continuosly 1 number less
                        'labor': hour.tuesday,
                    }
                
                });

            }

            //------------------- WED

            //This id will access the correct object from the list "operationHours"
            dayId = -1;

            operationHours.forEach( (obj, id) => {
                if(obj.day === "Wednesday"){
                    dayId=id;
                }
            })
            
            if(dayId>=0){
            
                open_time = operationHours[dayId].open_time;
                close_time = operationHours[dayId].close_time;

                openHour = ( parseInt(open_time.split('AM'))  || parseInt( open_time.split('PM')) );
                closeHour = ( parseInt(close_time.split('AM')) || parseInt(close_time.split('PM')) );

                openMidday = open_time.includes('AM')? 'AM':'PM';
                closeMidday = close_time.includes('AM')? 'AM':'PM';

                openBool = false;
                closeBool= false;

                let wednesday = dayLabor.filter(hour =>{
                    // if(parseInt(hour.wednesday) > 0){
                    //     return {
                    //         'shift_time': hour.shift_time+hour.midday,
                    //         'labor': hour.wednesday
                    //     }
                    // }
                    //if the current hour has surpassed the "open hour". aka, checking if it's open yet
                    if( (hour.shift_time >= openHour && hour.midday === openMidday && hour.shift_time != 12)
                        ||
                        (hour.shift_time === 12 && openHour === 12)
                        ||
                        (openBool === true)){
                        //if it isn't closed, then continue the "openBool" value as true 
                        if(closeBool===false){
                            openBool=true;
                        }
                                            
                        // if the current hour hasn't surpassed the "closing hour". aka, checking it hasn't closed yet
                        if( (hour.shift_time < closeHour && hour.midday === closeMidday && hour.shift_time != 12 && closeHour !=12)
                            ||
                            //If the current time is in the AM and the closing time is in the PM then it's impossible for the current time to have surpassed the closing time
                            (hour.midday==="AM" && closeMidday==="PM")
                            ||
                            (hour.shift_time === 12 && closeHour != 12))
                            {

                                return {
                                    'shift_time': hour.shift_time+hour.midday,
                                    'labor': hour.monday
                                }
                        }
                        else{
                            // no longer open and now it is closed
                            openBool=false
                            closeBool=true;
                        }
                    }
                });

                wednesdayLabor = wednesday.map(hour =>{
                    return {
                        'shift_time': hour.shift_time+hour.midday,
                        //I have no clue why adding 1 is necessary but without it the labor was continuosly 1 number less
                        'labor': hour.wednesday,
                    }
                });
            }

            //THURS

            //This id will access the correct object from the list "operationHours"
            dayId = -1;

            operationHours.forEach( (obj, id) => {
                if(obj.day === "Thursday"){
                    dayId=id;
                }
            })
            
            if(dayId>=0){

                open_time = operationHours[dayId].open_time;
                close_time = operationHours[dayId].close_time;

                openHour = ( parseInt(open_time.split('AM'))  || parseInt( open_time.split('PM')) );
                closeHour = ( parseInt(close_time.split('AM')) || parseInt(close_time.split('PM')) );

                openMidday = open_time.includes('AM')? 'AM':'PM';
                closeMidday = close_time.includes('AM')? 'AM':'PM';

                openBool = false;
                closeBool= false;

                let thursday = dayLabor.filter(hour =>{
                    // if(parseInt(hour.thursday) > 0){
                    //     return {
                    //         'shift_time': hour.shift_time+hour.midday,
                    //         'labor': hour.thursday
                    //     }
                    // }
                    //if the current hour has surpassed the "open hour". aka, checking if it's open yet
                    if( (hour.shift_time >= openHour && hour.midday === openMidday && hour.shift_time != 12)
                        ||
                        (hour.shift_time === 12 && openHour === 12)
                        ||
                        (openBool === true)){
                        //if it isn't closed, then continue the "openBool" value as true 
                        if(closeBool===false){
                            openBool=true;
                        }
                                            
                        // if the current hour hasn't surpassed the "closing hour". aka, checking it hasn't closed yet
                        if( (hour.shift_time < closeHour && hour.midday === closeMidday && hour.shift_time != 12 && closeHour !=12)
                            ||
                            //If the current time is in the AM and the closing time is in the PM then it's impossible for the current time to have surpassed the closing time
                            (hour.midday==="AM" && closeMidday==="PM")
                            ||
                            (hour.shift_time === 12 && closeHour != 12))
                            {

                                return {
                                    'shift_time': hour.shift_time+hour.midday,
                                    'labor': hour.monday
                                }
                        }
                        else{
                            // no longer open and now it is closed
                            openBool=false
                            closeBool=true;
                        }
                    }
                });

                thursdayLabor = thursday.map(hour =>{
                    return {
                        'shift_time': hour.shift_time+hour.midday,
                        //I have no clue why adding 1 is necessary but without it the labor was continuosly 1 number less
                        'labor': hour.thursday,
                    }
                
                });
            }

            // FRIDAY

            //This id will access the correct object from the list "operationHours"
            dayId = -1;

            operationHours.forEach( (obj, id) => {
                if(obj.day === "Friday"){
                    dayId=id;
                }
            })
            
            if(dayId>=0){

                open_time = operationHours[dayId].open_time;
                close_time = operationHours[dayId].close_time;

                openHour = ( parseInt(open_time.split('AM'))  || parseInt( open_time.split('PM')) );
                closeHour = ( parseInt(close_time.split('AM')) || parseInt(close_time.split('PM')) );

                openMidday = open_time.includes('AM')? 'AM':'PM';
                closeMidday = close_time.includes('AM')? 'AM':'PM';

                openBool = false;
                closeBool= false;

                let friday = dayLabor.filter(hour =>{
                    // if(parseInt(hour.friday) > 0){
                    //     return {
                    //         'shift_time': hour.shift_time+hour.midday,
                    //         'labor': hour.friday
                    //     }
                    // }
                    //if the current hour has surpassed the "open hour". aka, checking if it's open yet
                    if( (hour.shift_time >= openHour && hour.midday === openMidday && hour.shift_time != 12)
                        ||
                        (hour.shift_time === 12 && openHour === 12)
                        ||
                        (openBool === true)){
                        //if it isn't closed, then continue the "openBool" value as true 
                        if(closeBool===false){
                            openBool=true;
                        }
                                            
                        // if the current hour hasn't surpassed the "closing hour". aka, checking it hasn't closed yet
                        if( (hour.shift_time < closeHour && hour.midday === closeMidday && hour.shift_time != 12 && closeHour !=12)
                            ||
                            //If the current time is in the AM and the closing time is in the PM then it's impossible for the current time to have surpassed the closing time
                            (hour.midday==="AM" && closeMidday==="PM")
                            ||
                            (hour.shift_time === 12 && closeHour != 12))
                            {

                                return {
                                    'shift_time': hour.shift_time+hour.midday,
                                    'labor': hour.monday
                                }
                        }
                        else{
                            // no longer open and now it is closed
                            openBool=false
                            closeBool=true;
                        }
                    }
                });

                fridayLabor = friday.map(hour =>{
                    return {
                        'shift_time': hour.shift_time+hour.midday,
                        //I have no clue why adding 1 is necessary but without it the labor was continuosly 1 number less
                        'labor': hour.friday,
                    }
                
                });
            }

            // SAT

            //This id will access the correct object from the list "operationHours"
            dayId = -1;

            operationHours.forEach( (obj, id) => {
                if(obj.day === "Saturday"){
                    dayId=id;
                }
            })
            
            if(dayId>=0){
                open_time = operationHours[dayId].open_time;
                close_time = operationHours[dayId].close_time;

                openHour = ( parseInt(open_time.split('AM'))  || parseInt( open_time.split('PM')) );
                closeHour = ( parseInt(close_time.split('AM')) || parseInt(close_time.split('PM')) );

                openMidday = open_time.includes('AM')? 'AM':'PM';
                closeMidday = close_time.includes('AM')? 'AM':'PM';

                openBool = false;
                closeBool= false;

                let saturday = dayLabor.filter(hour =>{
                    // if(parseInt(hour.sunday) > 0){
                    //     return {
                    //         'shift_time': hour.shift_time+hour.midday,
                    //         'labor': hour.saturday
                    //     }
                    // }
                    //if the current hour has surpassed the "open hour". aka, checking if it's open yet
                    if( (hour.shift_time >= openHour && hour.midday === openMidday && hour.shift_time != 12)
                        ||
                        (hour.shift_time === 12 && openHour === 12)
                        ||
                        (openBool === true)){
                        //if it isn't closed, then continue the "openBool" value as true 
                        if(closeBool===false){
                            openBool=true;
                        }
                                            
                        // if the current hour hasn't surpassed the "closing hour". aka, checking it hasn't closed yet
                        if( (hour.shift_time < closeHour && hour.midday === closeMidday && hour.shift_time != 12 && closeHour !=12)
                            ||
                            //If the current time is in the AM and the closing time is in the PM then it's impossible for the current time to have surpassed the closing time
                            (hour.midday==="AM" && closeMidday==="PM")
                            ||
                            (hour.shift_time === 12 && closeHour != 12))
                            {

                                return {
                                    'shift_time': hour.shift_time+hour.midday,
                                    'labor': hour.monday
                                }
                        }
                        else{
                            // no longer open and now it is closed
                            openBool=false
                            closeBool=true;
                        }
                    }
                });

                saturdayLabor = saturday.map(hour =>{
                    return {
                        'shift_time': hour.shift_time+hour.midday,
                        'labor': hour.saturday,
                    }
                
                });
            }

            /* 
                Average amount of hours emp_available to Full Time employees 
            */
            // console.log('calc',total_labor,emps_FT.length)
            // console.log('longest shift',longest_shift)
            avg_FT = total_labor/emps_FT.length;
            /* 
            If the average is above 40 hours (overtime), then disperse the extra hours to Part Time employees 
            */
            if(avg_FT>40 || max_labor > emps_FT.length || longest_shift > 10){
                // console.log('first if')
                //The max hours fulltimers will work subtracted from the total hours we need. 
                // Then, divide that by how many part time employees and that's how many hours we need
                // the part time employees to work.
                if(avg_FT>40){
                    avg_PT = ( total_labor - (40 * emps_FT.length) ) / emps_PT.length;
                }
                else{
                    avg_PT = 5;
                }

                // If the Part Time employees have all received 40hrs, then overtime must be dispersed
                if(avg_PT>40){
                    // console.log('second if')
                    //let total_OT = total_labor - ( (avg_FT * emps_FT.length) + (avg_PT * emps_PT.length) );
                    //let avg_OT = total_OT/(emps_FT.length+emps_PT.length);

                    //generate schedule, OT for all/same hours for all
                    avg_FT = (total_labor/employees.length);
                    avg_PT = (total_labor/employees.length);
                    return generateSchedule(avg_FT, avg_PT)

                }
                else{
                    //FullTime employees only have to work 40 hours and part timers pick up the slack
                    // console.log('second else', avg_PT)
                    if(avg_PT == 0){
                        return generateSchedule(40,avg_PT)
                    }
                    else{
                        return generateSchedule(40,avg_PT)
                    }

                }

            }
            else{
                //disperse hours to FT employees ONLY
                // console.log('first else')
                return generateSchedule(avg_FT)
            }

            //default 
            function generateSchedule(avgHrsWeekFT,avgHrsWeekPT=0){
                
                let daysOpen = (sundayLabor.length > 1? 1:0) + (mondayLabor.length > 1? 1:0)
                                + (tuesdayLabor.length > 1? 1:0) + (wednesdayLabor.length > 1? 1:0)
                                + (thursdayLabor.length > 1? 1:0) +(fridayLabor.length > 1? 1:0)
                                + (saturdayLabor.length > 1? 1:0);



                let avgHrsDay = Math.ceil(avgHrsWeekFT/daysOpen);
                let avgHrsDayPT = Math.ceil(avgHrsWeekPT/daysOpen);

                // console.log('avgHrsWeekPT: ', avgHrsWeekPT)
            
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

                        // If the list does not contain any objects (aka hour of operation) then save it as an empty list
                        // the empty lists will just be skipped over and marked as off
                        let weekLabor = 
                        [   sundayLabor.length>0? sundayLabor:[], 
                            mondayLabor.length>0? mondayLabor:[], 
                            tuesdayLabor.length>0? tuesdayLabor:[], 
                            wednesdayLabor.length>0? wednesdayLabor:[], 
                            thursdayLabor.length>0? thursdayLabor:[], 
                            fridayLabor.length>0? fridayLabor:[], 
                            saturdayLabor.length>0? saturdayLabor:[] 
                        ];

                        // console.log('week labor: ',weekLabor)

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
                                        startTime[i] = hour.shift_time;
                                        boolStart = true;
                                    }
                                    
                                    //decrement hour of labor since it's now been assigned 
                                    hour.labor = parseInt(hour.labor) - 1;
                
                                    //grab end time
                                    if(weekLabor[i][index+1] == undefined? true:false){
                                        // 1) if at the end of the list
                                        
                                        const endHour = incrementHour(hour.shift_time);
                                        endTime[i] = endHour;
                                        boolContinue = false;
                                    }
                                    else{
                                        // if(parseInt(weekLabor[i][index+1].labor) == 0 || (emp.emp_availability == "FT"? avgHrsDay:avgHrsDayPT) ===count){
                                        if(parseInt(weekLabor[i][index+1].labor) == 0 || 10 ===count){

                                        // 2) if next hour doesn't need a worker OR 3) if max hours for day has been worked
                                            const endHour = incrementHour(hour.shift_time);
                                            endTime[i] = endHour;
                                            boolContinue = false;
                                        }
                                    }
                
                                }
                            })
                        }
            
            
                        return {
                            'name':emp.emp_name,
                            'sunday': `${startTime[0] == undefined? 'OFF':startTime[0]+'-'+endTime[0]}`,
                            'monday': `${startTime[1] == undefined? 'OFF':startTime[1]+'-'+endTime[1]}`,
                            'tuesday': `${startTime[2] == undefined? 'OFF':startTime[2]+'-'+endTime[2]}`,
                            'wednesday': `${startTime[3] == undefined? 'OFF':startTime[3]+'-'+endTime[3]}`,
                            'thursday': `${startTime[4] == undefined? 'OFF':startTime[4]+'-'+endTime[4]}`,
                            'friday': `${startTime[5] == undefined? 'OFF':startTime[5]+'-'+endTime[5]}`,
                            'saturday': `${startTime[6] == undefined? 'OFF':startTime[6]+'-'+endTime[6]}`
                        }
                    })
                return schedule;
            }
            
    }

    function incrementHour(time){
            let newTime=0;


            if( time.includes('AM') ){

                newTime = parseInt( time.split('AM') );
                // console.log('beginning in AM..... ',newTime)



                if(newTime === 12){
                    newTime = 1;
                }
                else{
                    newTime = newTime+1;
                }

                if(newTime == 12){
                    newTime += "PM";
                }
                else{
                    newTime += "AM";
                }
            }
            else{
                newTime = parseInt( time.split('PM') );
                // console.log('beginning in PM..... ',newTime)


                if(newTime === 12){
                    newTime = 1;
                }
                else{
                    newTime = newTime+1;
                }

                if(newTime == 12){
                    newTime += "AM";
                }
                else{
                    newTime += "PM";
                }
            }

            // console.log('this is the new time: ',newTime)

            return newTime;
    }



   module.exports = { scheduleAlgo }