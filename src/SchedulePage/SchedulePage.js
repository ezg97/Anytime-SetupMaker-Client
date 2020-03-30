import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import './SchedulePage.css';


import {InfoContext } from '../InfoContext';


//const { employees } = require('../Employees');
import TokenService from '../services/token-service'
import config from '../config'

import levels from '../Levels';
const { hoursPM, hoursAM } = require('../Hours');



class SchedulePage extends React.Component{ 


    /* 
        ---------------------------------
        |            STATE              |
        ---------------------------------
    */
    constructor(props){
        super(props);
        this.state = {
          in_time: [],
          out_time: [],
          position: '',
          skill: 0,
          importance: 0,
          id: 0,
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



    positionButtonClicked = (pos_id, list_index, e) => {
        console.log('id: ',pos_id,list_index);
        e.stopPropagation();
        let className = e.target.className
        console.log('class name',e.target.className)
        if(className.includes('clicked') ){
            console.log('UNCHECKING' );
            e.currentTarget.className = `pos-requirement-button ${list_index}`;

            this.patchPosition(pos_id, false);
        }
        else{
            console.log('CHECKING');
            e.currentTarget.className += ` clicked`;

            this.patchPosition(pos_id, true);
        }

    }

    
    employeeButtonClicked = (emp_id, list_index, e) => {
        console.log('id: ',emp_id,list_index);

        e.stopPropagation();

        let className = e.target.className
        console.log('class name',e.target.className);

        if(className.includes('clicked') ){
            console.log('UNCHECKING' );

            e.currentTarget.className = `emp-requirement-button ${list_index}`;

            console.log('calling patch')

            this.patchEmployee(emp_id, false);
        }
        else{
            console.log('CHECKING');

            e.currentTarget.className += ` clicked`;

            this.patchEmployee(emp_id, true);
        }

    }

    updateInTime = (val,id,out) => {

        this.clearAlert();

        let inTime=0;

        if(val.includes('AM')){
            inTime = parseInt( val.split('AM') );
            //12AM for opening will result to "12", the below is the solution
            if(inTime===12){
                inTime=0;
            }
        }
        if(val.includes('PM')){
            inTime = 12 + parseInt( val.split('PM') );
            //12pm will perform "12=12 = 24", the below is the solution
            if(inTime === 24){
                inTime = 12;
            }
        }

        console.log('open time val: ',val);
        console.log('open time army: ',inTime);
        console.log('employee id',id);
        console.log('employee out',out);

        if(out==0){
            out=this.context.dayData[0].close_time;
        }

        console.log('employee NEW out',out);

        //verify it's legal

        //if closes before it opens AND open AND close are not closed. 
        if( out > inTime ){

            this.clearAlert();
                        
            //update open
            this.patchEmployeeInTime(id, inTime);
        }
        //if closes before its open or one is closed while the other isn't.
        else{
            //show error if illegal
            this.showAlert('The opening time must come before the closing time.');
            return;
        }
        
    }

    updateOutTime = (val,id,inTime) => {

        this.clearAlert();

        let outTime=0;

        if(val.includes('AM')){
            outTime = parseInt( val.split('AM') );
            //12AM for opening will result to "12", the below is the solution
            if(outTime===12){
                outTime=0;
            }
        }
        if(val.includes('PM')){
            outTime = 12 + parseInt( val.split('PM') );
            //12pm will perform "12=12 = 24", the below is the solution
            if(outTime === 24){
                outTime = 12;
            }
        }

        console.log('open time val: ',val);
        console.log('open time outarmy: ',outTime);
        console.log('employee id',id);
        console.log('employee inTime',inTime);

        if(inTime==0){
            inTime=this.context.dayData[0].open_time;
        }

        console.log('employee NEW in',inTime);

        //verify it's legal

        //if opens before it closes 
        if( inTime < outTime ){

            this.clearAlert();
                        
            //update open
            this.patchEmployeeOutTime(id, outTime);
        }
        else{
            //show error if illegal
            this.showAlert('Error: The opening time must come before the closing time.');
            return;
        }
        
    }

    patchEmployeeOutTime = (id, out_time) => {
        console.log('xxxxxxxxxxxxxxxxxxout_time: ',out_time)
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { out_time }
            )
        })
        .then(res => {
            console.log('got something back, response: ',res)
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            // this.showAlert('Successfully Changed','success');
            this.context.updateEmployees();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.')
        });
    }


    patchEmployeeInTime = (id, in_time) => {
        console.log('xxxxxxxxxxxxxxxxxxin_time: ',in_time)
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { in_time }
            )
        })
        .then(res => {
            console.log('got something back, response: ',res)
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            // this.showAlert('Successfully Changed','success');
            this.context.updateEmployees();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.')
        });
    }

    patchEmployee = (id, emp_required) => {
        console.log('emp_required: ',emp_required)
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { emp_required, pass: '1' }
            )
        })
        .then(res => {
            console.log('got something back, response: ',res)
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            // this.showAlert('Successfully Changed','success');
            this.context.updateEmployees();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.')
        });
    }

   
    patchPosition = (id, pos_required) => {
        console.log('pos_required: ',pos_required)
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'position',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { pos_required, pass: '1' }
            )
        })
        .then(res => {
            console.log('got something back, response: ',res)
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            // this.showAlert('Successfully Changed','success');
            this.context.updatePositions();
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

        let positions = this.context.positionData;
        let employees = this.context.employeeData;
        let business = this.context.businessData;
        let operationHours = this.context.dayData;


    
        return(
        <div className="page-container crud">
            <div className='back'>
                <button className="back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>
                      
            {/* Header */}
            <header className='header'>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <p>Select the positions required for the setup, select the employees required 
                    and chose the work hours for the selected employee.</p>
            </header>
            
            <ul className="display-list-positions">

                { (positions.length>0)
                    
                    ? positions.map( (position,index) => 
                        <li key={index} className='list-element'>

                            {(position.pos_required)
                                ? <button className={`pos-requirement-button ${index} clicked`} onClick={(e) => this.positionButtonClicked(position.id,index, e)}></button>
                                : <button className={`pos-requirement-button ${index}`} onClick={(e) => this.positionButtonClicked(position.id,index, e)}></button>
                            }
                            <p>{position.pos_name}</p>
                        </li>
                      )

                    : <p>No positions found</p>
                }

            </ul>

            <section className={this.state.alertClass}>
                    <p>{this.state.alertMessage}</p>
            </section>

            <div className='list-stle'>
                    
                <ul className="display-list-employees">

                    <li className='text-style'>
                        <h3 className='shift-text'>Shift Time:</h3>
                        <h3 className='shift-text'>Name:</h3>
                    </li>
                    

                    { (employees.length>0)
                        
                        ? employees.map( (employee,index) => 
                            <li key={index} className='list-element'>

                                {/* BUTTON */}
                                {(employee.emp_required)
                                    ? <button className={`emp-requirement-button ${index} clicked`} onClick={(e) => this.employeeButtonClicked(employee.id,index, e)} selected></button>
                                    : <button className={`emp-requirement-button ${index}`} onClick={(e) => this.employeeButtonClicked(employee.id,index, e)}></button>
                                }

                                {/* IN TIME */}
                                <select className='scheduler-hours'  onChange={(e) => this.updateInTime(e.target.value,employee.id,employee.out_time)}>
                                    {/* If the operation hour list for this company is blank (an empty list) */}
                                    {

                                    operationHours.map(businessDay =>  
                                            //iterate through each hour
                                            hoursAM.map(hour =>
                                                //if hour fits in the hour of operations (can't open the hour the business closes)
                                                (hour.id >= parseInt(businessDay.open_time) && hour.id < parseInt(businessDay.close_time) )
                                                    //if the hour is the employees "in time"
                                                    ?(hour.id == parseInt(employee.in_time))
                                                        ?<option value={hour.time} selected>{hour.time}</option>
                                                        :<option value={hour.time}>{hour.time}</option>
                                                    :null
                                            )             
                                        )
                                        
                                    }
                                    
                                </select>

                                {/* OUT TIME */}
                                <select className='scheduler-hours'  onChange={(e) => this.updateOutTime(e.target.value,employee.id,employee.in_time)}>
                                    {/* If the operation hour list for this company is blank (an empty list) */}
                                    {

                                    operationHours.map(businessDay =>  
                                            //iterate through each hour
                                            hoursPM.map(hour =>
                                                //if hour fits in the hour of operations (can't close the hour the business opens)
                                                (hour.id > parseInt(businessDay.open_time) && hour.id <= parseInt(businessDay.close_time) )
                                                    //if the hour is the employees "in time"
                                                    //also, if the "out time" for the employee is still defaulted to "0" then it needs to be swapped with the actual close time
                                                    ?(hour.id == ( parseInt(employee.out_time)===0? this.context.dayData[0].close_time : employee.out_time ) )
                                                        ?<option value={hour.time} selected>{hour.time}</option>
                                                        :<option value={hour.time}>{hour.time}</option>
                                                    :null
                                            )             
                                        )
                                        
                                    }
                                    
                                </select>

                                {/* NAME */}
                                <p className='emp-name'>{employee.emp_name}</p>

                            </li>
                        )

                        : <p>No employees found</p>
                    }

                </ul>
            </div>

            


          
        </div>
        );
    }
}


export default SchedulePage;