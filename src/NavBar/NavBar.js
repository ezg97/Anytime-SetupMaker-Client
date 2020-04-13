import React from 'react';
import {withRouter, NavLink } from 'react-router-dom';
import './NavBar.css';
import {InfoContext} from '../InfoContext';
class NavBar extends React.Component{ 
  
   static contextType = InfoContext;
   

    logout = () => {
        this.context.logout();
        const {history} = this.props;
        history.push('/');
    }
    
    render(){
        let bool = this.props.bool;
        return(
        <nav className="app_nav">
            {(bool === 'false')

            /* IF NOT SIGNED IN */
            ?<ul className='navbar'>
              <li className='site'> <NavLink to="/">Anytime SetupMaker</NavLink> </li>
              <li className='options'>  
                    <NavLink to="/signup">Sign Up</NavLink> 
                    <i className='line'>|</i>
                    <NavLink to="/login">Log In</NavLink>
              </li>
            </ul>

            /* IF SIGNED IN */
            :<ul className='navbar'>
                <li className='site'> <NavLink to="/home">Anytime SetupMaker</NavLink> </li>
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