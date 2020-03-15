import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import './EmployeesPage.css';

import {InfoContext } from '../InfoContext';


//const { employees } = require('../Employees');
import TokenService from '../services/token-service'
import config from '../config'


class EmployeesPage extends React.Component{ 


    /* 
        ---------------------------------
        |            STATE              |
        ---------------------------------
    */
    constructor(props){
        super(props);
        this.state = {
          emp: '',
          availability: '',
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



        /* Handle Selected Employee:
            -- update the state to the current employee selected  */
    handleSelectedEmployee = (val) => {

        this.clearAlert();

        {/* Save the name selected to STATE */}
        if(val != "None"){
            this.setState({emp: val});
        }
        else{
            this.setState({emp: ''});
        }

        {/* Save the availability from the employee selected to STATE 
                note: for some reson !== and != did not work for this.*/}
        if( !(val == '' || val =='None')){
            this.context.employeeData.forEach( employee => {
                if(employee){
                    if(employee.emp_name == val){ 

                        this.setState({
                            availability: employee.emp_availability,
                            id: employee.id
                        });
                    }
                }
            });
        }
        else{
            this.setState(
                {
                    availability: "",
                    id: 0
                }
            );
        }
    }

        /* 
            Update Name:
            -- update the state to the current employee name TYPED in the INPUT BOX 
        */
    updateName = (val) => {
        this.clearAlert();

        this.setState(
            {emp: val}
        );
    }

        /* 
            Update Availability:
            -- update the state to the current employee availability SELECTED in the OPTION BOX 
        */
    updateAvailability = (val) => {
        this.clearAlert();

        this.setState(
            {availability: val}
        )
    }


    handleDelete = () => {

        this.clearAlert();

        const {id } = this.state;

        //Verify that this employee exists before deleting
        this.context.employeeData.forEach(employee => {
            if(employee.id === id){ 
                this.deleteEmployee(id);
                // this.setState({
                //     emp:'',
                //     availability: '',
                // });
                
            }
        })
    }


    handleSubmit = (event) => {
        event.preventDefault();

        const {emp, availability, id } = this.state;

        //Verify if ANY edits have been made to the employee by comparing what's in the 
        // database with what we have in state
        this.context.employeeData.forEach(employee => {
            if(employee.id === id){
                if(employee.emp_name != emp || employee.emp_availability != availability){
                    this.clearAlert();
                    this.patchEmployee(emp,availability, id);
                }
                else{
                    this.showAlert("Error: No changes have been made.");
                }
            }
        })
    }
    
    deleteEmployee = (id) => {
        fetch(`${config.URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            }
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            this.showAlert('Successfully Deleted','success');
            this.context.updateEmployees();
        })
        .catch(err => {
            this.showAlert("Error: Please try again later.")
        });
    }

    patchEmployee = (name, availability, id) => {
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { emp_name: name, emp_availability: availability }
            )
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            this.showAlert('Successfully Changed','success');
            this.context.updateEmployees();
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
                <p>Select an employee from the drop down menu, 
                    then edit or delete the employee.</p>

            </header>
            
            {/* Name selection */}
            <select id='select-employees' onChange={(e) => this.handleSelectedEmployee(e.target.value)}>
                    <option value="None" selected>None</option>

                    {employees.map(employee => 
                        /* Have to test the value exists before proceeding*/
                        <option value={employee? employee.emp_name:null}>{employee? employee.emp_name:null}</option>
                    )}

            </select>

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
                        value={this.state.emp}
                        onChange={(e) => this.updateName(e.target.value)}
                    />
                </section>

                <section className="section-form">

                    <label htmlFor="availability">Availability:</label>
                    {/* Availability SELECTION */}
                    <select id='availability' onChange={(e) => this.updateAvailability(e.target.value)}>
                     
                        {(this.state.availability == "")
                            ?<>
                            <option value="" selected></option>
                            </>
                            :(this.state.availability == "FT")
                                ?<>
                                    <option value="FT" selected>Full Time</option>
                                    <option value="PT">Part Time</option>
                                </>
                                :<>
                                    <option value="FT">Full Time</option>
                                    <option value="PT" selected>Part Time</option>
                                </>
                        }
                    </select>

                </section>

                <button type='submit' className='submit'>Submit</button>
                <button type='button' className='submit' onClick={() => this.handleDelete()}>Delete</button>

                <section className={this.state.alertClass}>
                    <p>{this.state.alertMessage}</p>
                </section>

            </form>
                
                

          
        </div>
        );
    }
}


export default EmployeesPage;