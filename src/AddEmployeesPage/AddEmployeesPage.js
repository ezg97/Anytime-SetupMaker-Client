import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import './AddEmployeesPage.css';

import {InfoContext } from '../InfoContext';
import config from '../config'

//const { employees } = require('../Employees');
import TokenService from '../services/token-service'


class AddEmployeesPage extends React.Component{ 


    /* 
        ---------------------------------
        |            STATE              |
        ---------------------------------
    */
    constructor(props){
        super(props);
        this.state = {
          emp: '',
          availability: 'FT',
          //Verify if ANY edits have been made to the employee by comparing what's in the 
        // database with what we have in state
          employeeExists: false,
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

        /* 
            Update Name:
            -- update the state to the current employee name TYPED in the INPUT BOX 
        */
    updateName = (val) => {
        let matched = false;

        this.context.employeeData.forEach(employee => {
            if(employee.emp_name.toLowerCase() === val.toLowerCase()){
                this.updateEmployeeExists(true);
                matched = true;
                this.showAlert('Error: This Employee already exists.');
                
            }
        });

        if(matched === false){
            this.clearAlert()
            this.updateEmployeeExists(false);
        }
       
        this.setState(
            {emp: val}
        );
    }

        /* 
            Update Availability:
            -- update the state to the current employee availability SELECTED in the OPTION BOX 
        */
    updateAvailability = (val) => {
        this.setState(
            {availability: val}
        )
    }

    updateEmployeeExists = (bool) => {
        if(bool===true){
            this.setState({
                employeeExists: true
            });
        }
        else{
            this.setState({
                employeeExists: false
            });
        }

    }

    handleSubmit = (event) => {
        event.preventDefault();

        const {emp, availability } = this.state;

        if(this.state.employeeExists === false){
            this.postEmployee(emp,availability);
        }
        // This would be redundant, except it's needed for after the user submits a new user succesfully
        // if they make no changes to the user and click submit twice, then the "success" message will
        // still be showing, this else block will update the message to be an error
        else{
            this.showAlert('Error: This Employee already exists.');
        }
    }

    postEmployee = (name, availability) => {
        fetch(`${config.URL}/all`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { business_id: TokenService.getId(), emp_name: name, emp_availability: availability }
            )
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            //show the user this action was successful
            this.showAlert('Successfully Added','success');
            //reset the "does user exist" boolean to true, since the user now exists since it was just added
            // or else subsequent submit clicks will create a duplicate user
            this.updateEmployeeExists(true);

            //now that an employee has been added to the database, make a new call to get all the employees again
            this.context.updateEmployees();
        })
        .catch(err => {
            this.showAlert("Error: Please try again later.")
        });
    }


   
    /* 
        ---------------------------------
        |            RENDER             |
        ---------------------------------
    */
    render(){

        let employees = this.context.employeeData;
        let business = this.context.businessData;

    
        return(
        <div className="page-container crud">

            <div className='back'>
                <button className="back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>
                      
            {/* Header */}
            <header className='header'>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <p>Enter the full name and availability of a new employee.</p>
       

            </header>

           {/* FORM */}
            <form className="employee-form" onSubmit={e => this.handleSubmit(e)}>

                <section className="section-form">
                    <label htmlFor="name">Name:</label>
                    {/* Name INPUT */}
                    <input 
                        type="text"
                        className="name-box" 
                        name="name" 
                        id="name" 
                        placeholder="John Doe"
                        value={this.state.emp}
                        onChange={(e) => this.updateName(e.target.value)}
                    />
                </section>

                <section className="section-form">

                    <label htmlFor="availability">Availability:</label>
                    {/* Availability SELECTION */}
                    <select id='availability' onChange={(e) => this.updateAvailability(e.target.value)}>
                        
                        <option value="FT" selected>Full Time</option>
                        <option value="PT">Part Time</option>        
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


export default AddEmployeesPage;