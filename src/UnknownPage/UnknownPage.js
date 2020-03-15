import React from 'react';
import { NavLink } from 'react-router-dom';

import './UnknownPage.css'

class UnknownPage extends React.Component{ 
    
    render(){

        return(
            
        <div className="container not-found">
            <header>
                <h1>This page doesn't exist.</h1>
            </header>

            <section>
                <h2><span>Are you lost?</span> <NavLink to="/">Click here to return return home</NavLink></h2>
            </section>
        </div>
        );
    }
}


export default UnknownPage;