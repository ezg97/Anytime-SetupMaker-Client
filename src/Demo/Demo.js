import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './Demo.css';

import ViewSchedule from '../ViewSchedule/ViewSchedule';

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
            alertClass: `message ${successClass}`,
            alertMessage: message
        });

    }


    updateTime = (val) => {

        this.clearAlert();

        if (parseInt(val) !== -1) {
            this.setState({
                time: parseInt(val)
            });
        }
        else{
            this.setState({
                time: -1
            });
        }
        
    }
      
 
    render(){

        let operationHours = this.context.dayData;
        
        return(
            

        <div className="page-container display schedule">
             {/* 1) HEADER*/}
            <header className='header'>
                <h1>Daily Setup.</h1>
            </header>

             {/* 2) THIS WILL LET YOU SELECT THE DAY OF THE SCHEDULE YOU WANT TO SEE*/}
             <select value={this.state.time} id='mySelect' onChange={(e) => this.updateTime(e.target.value)}>
                    <option value={-1}>None</option>

                    {operationHours === undefined? null : operationHours.map (businessDay =>  
                        //iterate through each hour
                        hours.map( (hour,id) =>
                            //if hour fits in the hour of operations (can't close the hour the business opens)
                            (hour.id >= parseInt(businessDay.open_time) && hour.id <= parseInt(businessDay.close_time) )
                                //if the hour is the employees "in time"
                                //also, if the "out time" for the employee is still defaulted to "0" then it needs to be swapped with the actual close time
                                ?<option key={id} value={hour.id}>{hour.time}</option>
                                :null
                        )             
                    )}            
                </select>

           

            {/* 3) THIS COMPONENT WILL DISPLAY THE SCHEDULE*/}
            {(this.state.time !== -1)
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