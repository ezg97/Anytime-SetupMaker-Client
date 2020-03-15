import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';


import './LoginPage.css';

import TokenService from '../services/token-service'
import AuthApiService from '../services/auth-api-service'

class LoginPage extends React.Component{ 
        /* 
            ---------------------------------
            |            STATE              |
            ---------------------------------
        */
    constructor(props){
        super(props);
        this.state = {
            business_name: '',
            password: '',
            errorClass:'error hide',
            errorMessage: '',
        };
    }   


    //ERROR HANDLING

    clearError = () => {
        this.setState({
            errorClass:"error hide"
        });
    }

    showError = (message) => {
        this.setState({
            errorClass:"error",
            errorMessage: message
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();


        const {business_name, password } = this.state;
        AuthApiService.postLogin({
            business_name: business_name,
            password: password,
        })
        .then( res => {
            this.clearError()

            this.props.pushHome();
         
            window.location.reload(false)

        })
        .catch(err => {
            this.showError('Incorrect Business Name or Password');
        })
    }

    updateBusinessName = (val) => {
        this.setState(
            {business_name: val}
        );
    }

    updatePassword = (val) => {
        this.setState(
            {password: val}
        );
    }

    render(){

        

        return(
            
        <div className="page-container">
            <div className='alt-back'>
                <button className="alt-back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>

            <header className='user-info-header'>
                <h1>Log in</h1>
            </header>

            <form className="user-info-form" onSubmit={e => this.handleSubmit(e)}>

                <section className="section-form">
                    <label htmlFor="business_name">Business Name:</label>
                    {/* Name INPUT */}
                    <input 
                        type="text"
                        className="name-box" 
                        name="business_name" 
                        id="business_name" 
                        value={this.state.business_name}
                        onChange={(e) => this.updateBusinessName(e.target.value)}
                    />
                </section>
                <section className="section-form">
                    <label htmlFor="password">Password:</label>
                    {/* Name INPUT */}
                    <input 
                        type="password"
                        className="name-box" 
                        name="password" 
                        id="password" 
                        value={this.state.password}
                        onChange={(e) => this.updatePassword(e.target.value)}
                    />
                </section>
                

                <button type='submit' className='submit'>Submit</button>

                <section className={this.state.errorClass}>
                    <p>{this.state.errorMessage}</p>
                </section>

            </form>
        </div>
        );
    }
}


export default LoginPage;