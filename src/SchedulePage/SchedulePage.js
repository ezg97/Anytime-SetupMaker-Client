import React from 'react';
import { withRouter } from 'react-router-dom';

import './SchedulePage.css';


import {InfoContext } from '../InfoContext';


//const { employees } = require('../Employees');
import TokenService from '../services/token-service'
import config from '../config'

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
          in_time: 0,
          out_time: [],
          employees: [],
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
   logout = () => {

    this.context.logout();
    const { history } = this.props;
    history.push('/');
}

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



    positionButtonClicked = (pos_id, list_index, e) => {
        e.stopPropagation();
        let className = e.target.className
        if(className.includes('clicked') ){
            e.currentTarget.className = `pos-requirement-button ${list_index}`;

            this.patchPosition(pos_id, false);
        }
        else{
            e.currentTarget.className += ` clicked`;

            this.patchPosition(pos_id, true);
        }

    }

    
    employeeButtonClicked = (emp_id, list_index, e) => {

        e.stopPropagation();

        let className = e.target.className

        if(className.includes('clicked') ){

            e.currentTarget.className = `emp-requirement-button ${list_index}`;

            this.patchEmployee(emp_id, false);
        }
        else{

            e.currentTarget.className += ` clicked`;

            this.patchEmployee(emp_id, true);
        }

    }

    updateInTime = (val,id, eID) => {

        this.clearAlert();

        let emps = this.state.employees.map( (obj,index) => {
            if(index === id) {
                obj[0] = parseInt(val);
            }
            return obj;
        });

        this.setState({
            employees: emps
        });

        //if closes before it opens AND open AND close are not closed. 
        if( parseInt(val) < emps[id][1] ){

            this.clearAlert();
                        
            //update open
            this.patchEmployeeInTime(eID, parseInt(val));
        }
        //if closes before its open or one is closed while the other isn't.
        else{
            //show error if illegal
            this.showAlert('The opening time must come before the closing time.');
            return;
        }
        
    }

    updateOutTime = (val,id,eID) => {

        this.clearAlert();

        let emps = this.state.employees.map( (obj,index) => {
            if(index === id) {
                obj[1] = parseInt(val);
            }
            return obj;
        });

        this.setState({
            employees: emps
        });


        //if opens before it closes 
        if( this.state.employees[id][0] < parseInt(val) ){

            this.clearAlert();
                        
            //update open
            this.patchEmployeeOutTime(eID, parseInt(val));
        }
        else{
            //show error if illegal
            this.showAlert('Error: The opening time must come before the closing time.');
            return;
        }
        
    }

    patchEmployeeOutTime = (id, out_time) => {
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
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            // this.showAlert('Successfully Changed','success');
            this.context.updateEmployees();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.');
            this.logout();
        });
    }


    patchEmployeeInTime = (id, in_time) => {
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
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            // this.showAlert('Successfully Changed','success');
            this.context.updateEmployees();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.');
            this.logout();
        });
    }

    patchEmployee = (id, emp_required) => {
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
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            // this.showAlert('Successfully Changed','success');
            this.context.updateEmployees();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.');
            this.logout();
        });
    }

   
    patchPosition = (id, pos_required) => {
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
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            // this.showAlert('Successfully Changed','success');
            this.context.updatePositions();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.');
            this.logout();
        });
    }

     /* 
        ---------------------------------
        |       COMPONENT DID MOUNT     |
    -----                               -----------------------------------------------------------------------------------------
    |    I need to know when this the fetch call in App.js has been completed                                                   |
    |    and the values have been stored in context:                                                                            |
    |    1) The state must handle the select/option time, however, I also need to set the default time to match the time        |
    |       database.                                                                                                           |
    |----------------------------------------------------------------------------------------------------------------------------

    */

   async componentDidMount(){
        //must use try/catch for async calls
        try{
            //await the response (aka resolve) from checkFetch
            await this.context.checkFetch();

            let emps = [];

            if(this.context.employeeData.length > 0) {

                emps = this.context.employeeData.map(emp => {
                    if (parseInt(emp.out_time) === 0) {
                        return [emp.in_time, parseInt(this.context.dayData[0].close_time)]
                    }
                    else{
                        return [emp.in_time, emp.out_time]
                    }
                });
            }

            this.setState({
                employees: emps
            });
            
        } catch (err){
            // error occurred
        }

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
                <p className='schedule-text'>Select the positions required for the setup, select the employees required 
                    and chose the work hours for the selected employee(s).</p>
            </header>
            
            <ul className="display-list-positions">

                { (employees.length > 0 && operationHours.length > 0 && positions.length > 0)
                    
                    ? positions.map( (position,index) => 
                        <li key={index} className='list-element'>

                            {(position.pos_required)
                                ? <button className={`pos-requirement-button ${index} clicked`} onClick={(e) => this.positionButtonClicked(position.id,index, e)}></button>
                                : <button className={`pos-requirement-button ${index}`} onClick={(e) => this.positionButtonClicked(position.id,index, e)}></button>
                            }
                            <p>{position.pos_name}</p>
                        </li>
                      )

                    : null
                }

            </ul>

            <section className={this.state.alertClass}>
                    <p>{this.state.alertMessage}</p>
            </section>

            <div className='list-style'>
                    
                <ul className="display-list-employees">

                    { (employees.length > 0 && operationHours.length > 0 && positions.length > 0)
                        ?<li className='text-style'>
                            <h3 className='shift-text'>Shift Time:</h3>
                            <h3 className='shift-text'>Name:</h3>
                        </li>
                        :null
                    }
                    
                    { (employees.length > 0 && operationHours.length > 0 && positions.length > 0)
                        
                        ? employees.map( (employee,index) => 
                            <li key={index} className='list-element'>

                                {/* BUTTON */}
                                {(employee.emp_required)
                                    ? <button className={`emp-requirement-button ${index} clicked`} onClick={(e) => this.employeeButtonClicked(employee.id,index, e)} selected></button>
                                    : <button className={`emp-requirement-button ${index}`} onClick={(e) => this.employeeButtonClicked(employee.id,index, e)}></button>
                                }

                                {/* IN TIME */ }
                                <select value={this.state.employees.length > 0? this.state.employees[index][0] : operationHours.open_time} 
                                className='scheduler-hours' onChange={(e) => this.updateInTime(e.target.value,index,employee.id)}>
                                    {/* If the operation hour list for this company is blank (an empty list) */}
                                    {operationHours.map(businessDay =>  
                                            //iterate through each hour
                                            hoursAM.map( (hour, id) =>
                                                //if hour fits in the hour of operations (can't open the hour the business closes)
                                                (hour.id >= parseInt(businessDay.open_time) && hour.id < parseInt(businessDay.close_time) )
                                                    ?<option key={id} className='option-time' value={hour.id}>{hour.time}</option>
                                                    :null
                                            )             
                                        )
                                        
                                    }
                                    
                                </select>

                                {/* OUT TIME */}
                                <select value={this.state.employees.length > 0? this.state.employees[index][1] : operationHours.close_time} 
                                className='scheduler-hours'  onChange={(e) => this.updateOutTime(e.target.value,index, employee.id)}>
                                    {/* If the operation hour list for this company is blank (an empty list) */}
                                    {operationHours.map(businessDay =>  
                                            //iterate through each hour
                                            hoursPM.map( (hour, id) =>
                                                //if hour fits in the hour of operations (can't close the hour the business opens)
                                                (hour.id > parseInt(businessDay.open_time) && hour.id <= parseInt(businessDay.close_time) )
                                                    //if the hour is the employees "in time"
                                                    //also, if the "out time" for the employee is still defaulted to "0" then it needs to be swapped with the actual close time
                                                   // ?(hour.id === ( parseInt(employee.out_time)===0? this.context.dayData[0].close_time : employee.out_time ) )
                                                    ?<option key={id} className='option-time' value={hour.id}>{hour.time}</option>
                                                    :null
                                            )             
                                        )
                                        
                                    }
                                    
                                </select>

                                {/* NAME */}
                                <p className='emp-name'>{employee.emp_name}</p>

                            </li>
                        )

                        : <p>Employees, Positions, and Operation Hours are all required before a setup can be made</p>
                    }

                </ul>
            </div>

            


          
        </div>
        );
    }
}


export default withRouter(SchedulePage);