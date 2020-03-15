import React from 'react';
import { withRouter, Route, Switch, NavLink } from 'react-router-dom';


import './NavBar.css';

import TokenService from '../services/token-service'
import AuthApiService from '../services/auth-api-service'

class NavBar extends React.Component{ 
       /* 
            ---------------------------------
            |            STATE              |
            ---------------------------------
        */
    constructor(props){
        super(props);
    }   

    logout = () => {
        const { history } = this.props
        history.push('/')

        TokenService.clearAuthToken()
        /* when logging out, clear the callbacks to the refresh api and idle auto logout */
        TokenService.clearCallbackBeforeExpiry()

        
        this.forceUpdate()
        window.location.reload(false)

    }
    
    render(){

        let bool = this.props.bool;

        return(
            
        <nav className="app_nav">
            {(bool === 'false')

            /* IF NOT SIGNED IN */
            ?<ul className='navbar navLink'>
              <li> <NavLink to="/demo">Anytime Scheduler</NavLink> </li>
              <li> <NavLink to="/login">Log In</NavLink> </li>
            </ul>

            /* IF SIGNED IN */
            :<ul className='navbar navLink'>
                <li> <NavLink to="/home">Anytime Scheduler</NavLink> </li>
                <li className='logos'>
                    <span className='home'> <NavLink to="/home">&#8962;</NavLink> </span>
                    <span className='log-out' onClick={() => this.logout()}> <NavLink to="/">&#10162;</NavLink> </span>
                </li>
            </ul>
            }
        </nav>
        );
    }
}


export default withRouter(NavBar);