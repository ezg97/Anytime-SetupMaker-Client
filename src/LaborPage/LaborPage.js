import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import './LaborPage.css';

import {InfoContext } from '../InfoContext';

import TokenService from '../services/token-service'
import config from '../config'


const { hours } = require('../Hours');
const { days } = require('../Days');



class LaborPage extends React.Component{ 
    /* 
        ---------------------------------
        |            CONTEXT            |
        ---------------------------------
    */
   static contextType = InfoContext;

   /* 
       ---------------------------------
       |            STATE              |
       ---------------------------------
   */
  constructor(props){
       super(props);
       this.state = {
           index: 0,
           shift_time: '0',
           day: '',
           labor_quantity: 0,
           messageClass:'message hide',
           alertMessage: '',
       };
   }



   clearAlert = () => {
        this.setState({
            alertClass:"message hide"
        });
    }

    showAlert = (message, successClass='') => {
        this.setState({
            alertClass: "message"+" "+successClass,
            alertMessage: message
        });
    }

    /* 
        ------------------------------------------------
        |            METHODS: API calls                |
        ------------------------------------------------
    */
   handleSubmit = (event) => {
        event.preventDefault();

        const {shift_time, day, labor_quantity } = this.state;
        let newShiftTime='';
        let midday='';

        if(shift_time.includes('AM')){
            newShiftTime = shift_time.split('AM');
            newShiftTime = parseInt( newShiftTime );

            midday = 'AM';
        }
        if(shift_time.includes('PM')){
            newShiftTime = shift_time.split('PM');
            newShiftTime = parseInt( newShiftTime );

            midday = 'PM';
        }
    
        let emptyWeek = {business_id: TokenService.getId(), 'shift_time': newShiftTime, midday, monday:0,tuesday:0,wednesday:0,thursday:0,friday:0,saturday:0,sunday:0}

        //Verify if ANY edits have been made to the employee by comparing what's in the 
        // database with what we have in state
        let existingHour = false;
        this.context.laborData.forEach(hourData => {
            //if the object's hour time matches the hour that's been selected then...
        
            if(hourData.shift_time+hourData.midday===shift_time){
                //check to see if the time in the database conflicts with the time submitted by the client
                existingHour = true;
                if(hourData[day.toLowerCase()] != labor_quantity){
                    this.patchBusinessLabor(hourData.id, day, labor_quantity, hourData);
                    
                    this.clearAlert();
                }
                else{
                    this.showAlert('Error: No change was made.');
                }
            } 
        });

        if(existingHour === false && shift_time!='' && shift_time!=0){
            
            this.addBusinessLabor({ ...emptyWeek, [`${day.toLowerCase()}`]:labor_quantity })
            //this.patchBusinessLabor(day, labor_quantity, );
            this.clearAlert();
        }
        
        
    }

    addBusinessLabor = (newWeek) => {
        fetch(`${config.URL}/all`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'table':'shr',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { ...newWeek    }
            )
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            //show the user this action was successful
            this.showAlert('Successfully Updated','success');
            this.context.updateBusinessLabor();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.')        
        });
    }

    patchBusinessLabor = (id, day, labor_quantity, hourData) => {
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'shr',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { ...hourData, [`${day.toLowerCase()}`]:labor_quantity}
            )
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            //show the user this action was successful
            this.showAlert('Successfully Updated','success');
            this.context.updateBusinessLabor();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.')
        });
    }






   /* 
        ------------------------------------------------
        |            METHODS: updating data            |
        ------------------------------------------------
    */

    //When the day is selected: the day, hour, and labor quantity all must be updated on the page.
    // @param {string} val - contains the day selected
    handleSelectedDay = (val) => {


        this.clearAlert();
        //this variable will represent the id in this method and at the end be used to update the id in state
        let tempId=-1;

        //iterate through the Operation hours (list of objects) to find the index of the day
        // then store the index in state
        this.context.dayData.forEach( (obj, i) => {
            //when the selected day equals the day stored in the iterated object
            if(val===obj.day){
                //store id in the temporary id (since storing it in state wouldn't work since it's asynchronous)
                //The id is needed to access the correct info for the shift_time
                tempId=i;
            }
        });
        
        //if tempId is not equal to "-1" then and id of the selected day was found in the operation table
        //aka the day exists in the operation table
        if(tempId != -1){
            //update the state with the data that reflects the new day that has been selected
            this.setState({
                //Operation hours are in a list of objects. 
                // Accessing the proper index of the list by subtracting 1 from the id.
                // Select the opening time for that day because switching to a day should show the first time available
                shift_time: this.context.dayData? this.context.dayData[tempId].open_time:null,
                //switch day to whatever day was selected
                day: val,
                
                //Labor requirements are in a list of objects.
                // Accessing the first hour of labor recorded
                // Selecting the column of the date selected
                //Also, if the shr table is empty
                labor_quantity: this.context.laborData.length>0? this.context.laborData[0][val.toLowerCase()] : 0,
            });

            //Now, update the id that's stored in state
            this.updateId(tempId);
            //Update the shift time that's stored in state, also pass the day selected because
            //since seting state is an async function, the updated "state.day" can't be accessed yet
            this.updateShiftTime(this.context.dayData[tempId].open_time, val);
        }
        //New account, no shift times or labor
        else{
            this.setState({
                shift_time:'0',
                labor_quantity: 0,
                day: val,
            })
        }

        //set "day" to "none" if no day was selected
        if(val === "None"){
            this.setState({day: ''});
        }

        
    }

    //Updates the shift_time in state and also the labor quantity.
    // @param {string} shift_time - contains the shift_time selected
    // @param {string} day - contains the day of the week selected (wouldn't be necessary, except that this method is also called while state is being set so we can't depend on state in this method)

    updateShiftTime = (shift_time, day) => {
        this.clearAlert();

        if(shift_time != "0"){
            this.setState({shift_time: shift_time});
        }
        else{
            this.setState({shift_time: '0'});
        }
        let hourExists = false;
        //iterate through the Labor requirements are in a list of objects.
        this.context.laborData.forEach(hourData => {
            //if the object's hour time matches the hour that's been selected then...
         
            if(hourData.shift_time+hourData.midday===shift_time){
               
                //... update the state to reflect the labor quantity for that hour
                this.setState({
                    //accessing the correct object and selecting the key (which is a day) to get the value (labor quantity)
                    labor_quantity: hourData[day.toLowerCase()]
                })
                //set to True because the hour does indeed exist in the labor table
                hourExists=true;
            }
        });

        //if hourExists equals false, then that means the hour has not been added to the Labor requirements
        if(hourExists === false){
            this.setState({
                labor_quantity: 0,
            })
        }
    }

    updateLaborQuantity = (val) => {
        this.clearAlert();

        if(val != "0"){
            this.setState({labor_quantity: val});
        }
        else{
            this.setState({labor_quantity: 0});
        }
    }

    updateId = (id) => {
        this.setState({
            index: id
        })
    }

    /*
    Given the beginning and ending of the hours of operation for a day, the method will return an 
    object containing the full hours of operation for the day.

    @param {string} open_time - contains the openning time (eg. "6AM")
    @param {string} close_time - contains the closing time (eg. "10PM")

    @return {objet} tempHours - contains the hours for the day (computed using the params)
    */
    getDaysHours = (open_time, close_time) => {
   
        //call the "updateId" method and pass it the current Id


        let bool = false;
        let tempHours = hours.filter(hour => {
            if(hour.time === open_time){
                bool=true;
            }
            if(hour.time === close_time){
                bool=false;
            }
            if(bool === true || hour.time === close_time){
                return hour.time;
            }
        });
        

        return tempHours;
    }



    render(){
     
        let business = this.context.businessData;
        let operationHours = this.context.dayData;
        let laborData = this.context.laborData;
        let employees = this.context.employeeData;

        return(
        <div className="page-container crud">

            <div className='back'>
                <button className="back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>
                      
            {/* Header */}
            <header className='header'>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <p>Select the day from the drop down menu, 
                    then select an hour, then enter 
                    the labor for that hour</p>
            </header>
           
            <select id='select-labor' onChange={(e) => this.handleSelectedDay(e.target.value)}>
                <option value="None" selected>None</option>
                {/* Displays the list of 7 days */}
                {days.map(businessDay => 
                    <option value={businessDay}>{businessDay}</option>
                )}
            </select>

           
            <form className="labor-form" onSubmit={e => this.handleSubmit(e)}>

                <section className="section-form">
                    <label htmlFor="hours">Hour:</label>
                    
                    <select id='hours' onChange={(e) => this.updateShiftTime(e.target.value,this.state.day)}> 
                        <option value='0'>Closed</option>

                        {operationHours.map(businessDay =>  
                            /* This is for demonstration purposes only. In production I would make
                                the "None" option the selected choice */
                                (this.state.day === businessDay.day)
                                    ?this.getDaysHours(businessDay.open_time, businessDay.close_time).map(hour =>
                                        (hour.time === businessDay.open_time)
                                            ?<option value={hour.time} selected>{hour.time}</option>
                                            :<option value={hour.time}>{hour.time}</option>
                                    // :<option value={0}>Closed</option>
                                    )
                                    :null
                        )}
                    </select>

                </section>
                    {/* <select id='hours'>
                        {dayLabor.map(businessHour => 
                            /* This is for demonstration purposes only. In production I would make
                                the "None" option the selected choice *
                            (businessHour.time === "5AM")
                            ?<option value={businessHour.time} selected>{businessHour.time}</option>
                            :<option value={businessHour.time}>{businessHour.time}</option>
                        )}
                    </select>
                </section> */}

                <section className="section-form">
                    <label htmlFor="quantity">Labor Quantity:</label>
                    <input type="number" className='quantity-box' name="quantity" id="quantity" 
                    value={this.state.labor_quantity} onChange={(e) => this.updateLaborQuantity(e.target.value)}
                    min="0" max={employees.length}/>
                </section>


                <button type='submit' className='submit'>Submit</button>

                <section className={this.state.alertClass}>
                    <p>{this.state.alertMessage}</p>
                </section>

            </form>
                
                

          
        </div>
        );
    }
}


export default LaborPage;