import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import AltApp from './AltApp/AltApp';
import './index.css';
import { BrowserRouter } from "react-router-dom";

import TokenService from './services/token-service'

if(TokenService.hasAuthToken()){
    ReactDOM.render(
        <BrowserRouter>    
            <App />
        </BrowserRouter>, 
        document.getElementById('root')
    );
}
else{
    ReactDOM.render(
        <BrowserRouter>    
            <AltApp />
        </BrowserRouter>, 
        document.getElementById('root')
    );
}

