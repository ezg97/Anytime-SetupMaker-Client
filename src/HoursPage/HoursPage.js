import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import './HoursPage.css';

import {InfoContext } from '../InfoContext';

import TokenService from '../services/token-service'
import config from '../config'


const { SelectDayWidget } = require('../SelectDayWidget/SelectDayWidget');
const { hours } = require('../Hours');
const { days } = require('../Days');



class HoursPage extends React.Component{ 

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
            day: '',
            open_time: '0',
            close_time: '0',
            dayExists: false,
            messageClass:'message hide',
            alertMessage: '',
        };
    }


    


    /* 
        ---------------------------------
        |            METHODS            |
        ---------------------------------
    */

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


    handleSelectedDay = (val) => {
        this.clearAlert();

        let updateHour = false;

        //if the data is an empty list (because it's a new account)
        if(this.context.dayData.length>0){
            this.context.dayData.forEach(obj => {
                //if the database table contains info on the slected day
                if(obj.day===val){
                    this.setState({
                        index: obj.id,
                        day: val,
                    });
             
                    this.updateOpenTime(obj.open_time);
                    this.updateCloseTime(obj.close_time);

                    updateHour = true;
                }
               
            });
            //executed if the database contains info, but not on the selected day
            if(updateHour === false){
                this.updateCloseTime('0');
                this.updateOpenTime('0');
                this.setState({
                    day: val,
                });
            }
        }
        //if no data exists yet (new account)
        else{
            this.setState({
                day: val
            });
        }

        if(val === "None"){
            this.setState({day: ''});
        }
    }

    updateOpenTime = (val) => {
        this.clearAlert();

        if(val != "0"){
            this.setState({open_time: val});
        }
        else{
            this.setState({open_time: '0'});
        }
    }

    updateCloseTime = (val) => {
        this.clearAlert();

        if(val != "0"){
            this.setState({close_time: val});
        }
        else{
            this.setState({close_time: '0'});
        }
    }

    updateDayExists = (bool) => {
        if(bool===true){
            this.setState({
                dayExists: true
            });
        }
        else{
            this.setState({
                dayExists: false
            });
        }

    }


    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.day===''){
            this.showAlert('Error: Must select a day.');
            return;
        }
        

        const {day, open_time, close_time } = this.state;

        let openHour = ( parseInt(open_time.split('AM'))  || parseInt( open_time.split('PM')) );
        let closeHour = ( parseInt(close_time.split('AM')) || parseInt(close_time.split('PM')) );

        let openMidday = open_time.includes('AM')? 'AM':'PM';
        let closeMidday = close_time.includes('AM')? 'AM':'PM';

        //set the day to be existing, so that if the opening and closing hours flags an error, it won't update
        let dayExists=true;
        this.updateDayExists(true);


        if( 
            ( openHour < closeHour && openMidday === 'AM' && closeMidday === 'AM' && closeHour !== 12 )
            ||
            ( openHour < closeHour && openMidday === 'PM' && closeMidday === 'PM' && closeHour !== 12 && openHour !== 0)
            ||
            ( openHour > closeHour && openMidday === 'PM' && closeMidday === 'PM' && openHour === 12 && closeHour !== 0 )
            ||
            ( openMidday === 'AM' && closeMidday === "PM" && closeHour !== 0 )
            ||
            ( open_time === '0' && close_time === '0' )
        ){

            // The hours are acceptable, however we will set to false as default and if the day 
            // does exist, then it will be overrided to true
            dayExists = false;
            this.updateDayExists(false);

            this.clearAlert();


            //if the operation data contains any data
            if( (this.context.dayData? this.context.dayData.length : null) > 0 ){

                //iterate through the operation table
                this.context.dayData.forEach(businessDay => {

                    //verify that the day we are accessing matches the day selected
                    if(day === businessDay.day){
                        
                        // The variables have been overridden
                        dayExists=true;
                        this.updateDayExists(true);
                        //verify that a change has been made, either to the opening our closing hour
                        if(open_time != businessDay.open_time || close_time != businessDay.close_time){

                            this.patchBusinessDay(businessDay.id, day, open_time, close_time);
                        }
                        else{
                            //show an error noting that no change was made
                            this.showAlert('Error: No change has been made.');
                        }
                    }
                   
                }); 
            }
            
        
            // 1)  If the list (dayData) is empty, then that means this is a new account so instead of patching, we need to create
            // 2)  If the selected day does not exist in the operation table, then this will create any unadded selected day

            if(dayExists === false){
                this.addBusinessDay(day, open_time, close_time);
            }
        }
        else{
            this.showAlert('Error: The opening time must come before the closing time.');
            return;
        }
    }

    addBusinessDay = (day, open_time, close_time) => {
        fetch(`${config.URL}/all`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'table':'operation',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { business_id: TokenService.getId(), day, open_time, close_time}
            )
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            this.showAlert('Successfully Updated','success');
            this.context.updateBusinessDay();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.')
        });
    }

    patchBusinessDay = (id, day, open_time, close_time) => {
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'operation',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { day, open_time, close_time}
            )
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            this.showAlert('Successfully Updated','success');
            this.context.updateBusinessDay();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.')
        });
    }

     /* 
        ---------------------------------
        |            RENDER             |
        ---------------------------------
    */
    render(){

        let business = this.context.businessData;
        let operationHours = this.context.dayData;

        return(
        <div className="page-container crud">

            <div className='back'>
                <button className="back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>
            
            <header className='header'>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <p>Select the day from the drop down menu, 
                    then select the hours of operation</p>
            </header>

           {/* 
            <Switch>
                <Route exact path='/hours'
                  render={(routeProps) =>
                    <SelectDayWidget
                        selectedDay={'Sun'}
                    />
                } />

            </Switch>
 
            Both iterations not working for some reason? For this reaason I'm not 
            putting the select option in a component even tho it is going to be reused.
            <SelectDayWidget />
            
            <Switch>
                <Route path='/hours' component={SelectDayWidget} />
            </Switch>

            {/* List of choices */}
            <select id='select-day' onChange={(e) => this.handleSelectedDay(e.target.value)}>
                <option value="None" selected>None</option>
                {days.map(businessDay => 
                    <option value={businessDay}>{businessDay}</option>
                )}
            </select>
            
           {/* FORM */}
            <form className="labor-form"  onSubmit={e => this.handleSubmit(e)}> 
                
                <section className="section-form">
                    <label htmlFor="hours">Open:</label>
                    <select id='hours' onChange={(e) => this.updateOpenTime(e.target.value)}> 
                        <option value='0'>Closed</option>

                        {/* If the operation hour list for this company is blank (an empty list) */}
                        {( (operationHours? operationHours.length : null)>0 )

                            ?operationHours.map(businessDay =>  
                                
                                //if the selected day matches a day stored in the operation table
                                (this.state.day === businessDay.day)
                                    //iterate through each hour
                                    ?hours.map(hour =>
                                        //if the current hour matches the opening time hour, then show it
                                        (hour.time === businessDay.open_time)
                                            ?<option value={hour.time} selected>{hour.time}</option>
                                            :<option value={hour.time}>{hour.time}</option>
                                    )
                                    //if the selected day does NOT match any day stored in the operation table
                                    :hours.map(hour =>
                                        <option value={hour.time}>{hour.time}</option>
                                    )
                            )
                            :hours.map(hour =>
                                <option value={hour.time}>{hour.time}</option>
                            )
                        }
                    </select>
                </section>

                    
                <section className="section-form">

                    <label htmlFor="hours">Close:</label>
                    <select id='hours'  onChange={(e) => this.updateCloseTime(e.target.value)}>
                        <option value='0'>Closed</option>


                        {/* If the operation hour list for this company is blank (an empty list) */}
                        {( (operationHours? operationHours.length : null)>0 )

                            ?operationHours.map(businessDay =>  
                                
                                //if the selected day matches a day stored in the operation table
                                (this.state.day === businessDay.day)
                                    //iterate through each hour
                                    ?hours.map(hour =>
                                        //if the current hour matches the closing time hour, then show it
                                        (hour.time === businessDay.close_time)
                                            ?<option value={hour.time} selected>{hour.time}</option>
                                            :<option value={hour.time}>{hour.time}</option>
                                    )
                                    //if the selected day does NOT match any day stored in the operation table
                                    :hours.map(hour =>
                                        <option value={hour.time}>{hour.time}</option>
                                    )
                            )
                            :hours.map(hour =>
                                <option value={hour.time}>{hour.time}</option>
                            )
                        }
                        {/* {operationHours.map(businessDay =>  
                             This is for demonstration purposes only. In production I would make
                                the "None" option the selected choice 
                                (this.state.day === businessDay.day)
                                    ?hours.map(hour =>
                                        (hour.time === businessDay.close_time)
                                            ?<option value={hour.time} selected>{hour.time}</option>
                                            :<option value={hour.time}>{hour.time}</option>
                                    // :<option value={0}>Closed</option>
                                    )
                                    :null
                        )} */}
                    </select>

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


export default HoursPage;