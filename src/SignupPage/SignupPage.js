import React from 'react';
import { withRouter } from 'react-router-dom';

//Need this to log in the user after signingup
import AuthApiService from '../services/auth-api-service'
import {AltInfoContext } from '../AltInfoContext';

class SignupPage extends React.Component{ 

        /* 
        ---------------------------------
        |            CONTEXT            |
        ---------------------------------
    */
   static contextType = AltInfoContext;


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
            errorClass:'message hide',
            errorMessage: '',
        };
    }   



    //ERROR HANDLING

    clearError = () => {
        this.setState({
            errorClass:"message hide"
        });
    }

    showError = (message) => {
        this.setState({
            errorClass:"message",
            errorMessage: message
        });
    }


    handleSubmit = (event) => {
        event.preventDefault();


        const {business_name, password } = this.state;

        AuthApiService.postUser({
            'user_name': business_name,
            'password': password,
        })
        .then( res => {
            
            //AFTER successfully creating an account, make the call to log in
            AuthApiService.postLogin({
                business_name: business_name,
                password: password,
            })
            .then( res => {
                //user is signed up now

                //clear error
                this.clearError();
                // push to home page now that the user is logged in
                this.props.pushHome();
                // fetch the new info from the database with the new id
                this.context.fetchDatabase()
    
            })
            .catch(err => {
                this.showError('An error occurred while creating your account. Please reload the page');
            })
            
        })
        .catch(err => {
            //For example: when there no tables have been created, the error returned is an object, not a string
            if(typeof(err.error) === "string"){
                this.showError(err.error);
            }
            else{
                this.showError('An error occurred while creating your account. Please reload the page');
            }
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
                <h1>Sign Up</h1>
            </header>

            <form className="user-info-form" onSubmit={e => this.handleSubmit(e)}>

                <section className="section-form">
                    <div className="section-form-inner">

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
                    </div>
                </section>

                <section className="section-form">
                    <div className="section-form-inner">

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
                    </div>
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


export default withRouter(SignupPage);