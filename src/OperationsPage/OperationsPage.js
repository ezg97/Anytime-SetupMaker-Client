import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import {InfoContext } from '../InfoContext';

import './OperationsPage.css';



const { business } = require('../Business');

class OperationsPage extends React.Component{ 
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
            employee: 'employee',
            employeeChildren: 'children hide',
        };
    }

    handleEmployees = () => {

        if(this.state.employee.includes('hide')){
            this.setState({
                employee: 'employee',
                employeeChildren: 'children hide'
            })
        }
        else{
            this.setState({
                employee: 'employee hide',
                employeeChildren: 'children'
            })
        }
    }

    clearClick = () => {
        this.setState({
            employee: 'employee',
            employeeChildren: 'children hide'
        })
    }

    render(){
        let business = this.context.businessData;

        return(
        <div className='page-container'>
                      
            {/* Header */}
            <header className='header' onClick={() => this.clearClick()}>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <h2>Operations</h2>
            </header>
            
            {/* List of choices */}
            <div className='operations-links'>
                <ul className="navLink">
                    <li className={this.state.employeeChildren}> 
                        <NavLink to="/addEmployees">Add Employees</NavLink> 
                        <NavLink to="/employees">Edit/Delete Employees</NavLink> 
                    </li>

                    <li className={this.state.employee}> 
                        <a href='#' onClick={() => this.handleEmployees()}>Employees</a> 
                    </li>

                    <li onClick={() => this.clearClick()}> <NavLink to="/hours">Operation Hours</NavLink> </li>
                    <li onClick={() => this.clearClick()}> <NavLink to="/labor">Labor Quantity</NavLink> </li>
                    {/*<li> <NavLink to="/account">Account Settings</NavLink> </li>*/}
                </ul>
                

            </div>
          
        </div>
        );
    }
}


export default OperationsPage;