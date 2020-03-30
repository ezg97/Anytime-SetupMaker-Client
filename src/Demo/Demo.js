import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import './Demo.css';

import ViewSchedule from '../ViewSchedule/ViewSchedule';
import Test from '../test';

import {InfoContext } from '../InfoContext';


const { hours } = require('../Hours');


class Demo extends React.Component{ 
    
    constructor(props){
        super(props);
        this.state = {
          time: -1,
          messageClass:'message hide',
          alertMessage: '',
        };
      }
    
      /* 
        ---------------------------------
        |            CONTEXT            |
        ---------------------------------
    */
    static contextType = InfoContext;


    
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


    updateTime = (val) => {

        this.clearAlert();

        if(val!= "None"){
            let armyTime=0;


            if(val.includes('AM')){
                armyTime = parseInt( val.split('AM') );
                //12AM for opening will result to "12", the below is the solution
                if(armyTime===12){
                    armyTime=0;
                }
            }
            if(val.includes('PM')){
                armyTime = 12 + parseInt( val.split('PM') );
                //12pm will perform "12=12 = 24", the below is the solution
                if(armyTime === 24){
                    armyTime = 12;
                }
            }

    
            this.setState({
                time: armyTime
            })
        }
        else{
            this.setState({
                time: -1
            })
        }
        
    }
      
 
    render(){

        let positions = this.context.positionData;
        let employees = this.context.employeeData;
        let business = this.context.businessData;
        let operationHours = this.context.dayData;
        
        return(
            

        <div className="page-container crud">
             {/* 1) HEADER*/}
            <header className='header'>
                <h1>Daily Setup.</h1>
            </header>

             {/* 2) THIS WILL LET YOU SELECT THE DAY OF THE SCHEDULE YOU WANT TO SEE*/}
             <select className='hours' onChange={(e) => this.updateTime(e.target.value)}>
                    <option value="None" selected>None</option>

                    {operationHours === undefined? null : operationHours.map(businessDay =>  
                        //iterate through each hour
                        hours.map(hour =>
                            //if hour fits in the hour of operations (can't close the hour the business opens)
                            (hour.id >= parseInt(businessDay.open_time) && hour.id <= parseInt(businessDay.close_time) )
                                //if the hour is the employees "in time"
                                //also, if the "out time" for the employee is still defaulted to "0" then it needs to be swapped with the actual close time
                                
                                ?<option value={hour.time}>{hour.time}</option>
                                :null
                        )             
                    )}            
                </select>

           

            {/* 3) THIS COMPONENT WILL DISPLAY THE SCHEDULE*/console.log('TIME: ',this.state.time != -1)}
            {(this.state.time != -1)
                ?<Switch>
                    <Route exact path='/Demo'
                    render={(routeProps) =>
                        <ViewSchedule
                            selectedHour={this.state.time}
                        />
                    } />

                </Switch>
                :<Switch>
                    <Route exact path='/Demo'
                    render={(routeProps) =>
                        <ViewSchedule
                            selectedHour={'None'}
                        />
                    } />
                </Switch>
            }
          
            
        </div>
        );
    }
}


export default Demo;