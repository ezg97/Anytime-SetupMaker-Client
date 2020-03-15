import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';


import './ManagementPage.css';



const { business } = require('../Business');

class ManagementPage extends React.Component{ 

    render(){
     
        return(
        <div>
                      
            {/* Header */}
            <header className='header'>
                <h1>{business[0].name}</h1>
                <h2>Management</h2>
            </header>
            
            {/* List of choices */}
            <div className='operations-links'>
                <ul>
                    <li> <NavLink to="/hours">Operation Hours</NavLink> </li>
                    <li> <NavLink to="/labor">Labor Quantity</NavLink> </li>
                </ul>
                

            </div>
          
        </div>
        );
    }
}


export default ManagementPage;