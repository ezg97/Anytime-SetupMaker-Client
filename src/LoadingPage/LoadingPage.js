import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';


import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import "./LoadingPage.css"

import Loader from 'react-loader-spinner'

class LoadingPage extends React.Component{ 

    
    render(){


        return(
            
        <div className="loader">
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000} //3 secs

            />
        </div>
        );
    }
}


export default LoadingPage;