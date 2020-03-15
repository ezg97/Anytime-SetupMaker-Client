import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import { Container, Row, Col } from 'react-grid-system';
import TokenService from '../services/token-service'
import LoadingPage from '../LoadingPage/LoadingPage';
import {InfoContext } from '../InfoContext';


import './HomePage.css';



const { business } = require('../Business');

class HomePage extends React.Component{ 
    /* 
        ---------------------------------
        |            CONTEXT            |
        ---------------------------------
    */
   static contextType = InfoContext;


    render(){

        let business = this.context.businessData;
        
        //oposite from the condition used in the LandingPage Render
        if(!TokenService.hasAuthToken()){
            return(
                <div className="container">
                    <Route exact path='/' component={LoadingPage} />
                </div>
            ); 
        }
        else{
            return(
                <div className="page-container">
                              
                    {/* Header */}
                    <header className='header'>
                        <h1>{business.length>0? business[0].business_name:null}</h1>
                    </header>
                    
        
                    {/* Scheduling */}
                    <div className='operations-links'>
                        <ul className="navLink">
                            <li> <NavLink to="/demo">Generate/View Schedule</NavLink> </li>
                            <li> <NavLink to="/operations">Operations</NavLink> </li>
                        </ul>
                    </div>
                    
                </div>
            );
        }
        
    }
}


export default HomePage;