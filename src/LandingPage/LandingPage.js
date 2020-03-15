import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import './LandingPage.css';
import LoadingPage from '../LoadingPage/LoadingPage';

import TokenService from '../services/token-service'



class LandingPage extends React.Component{ 
    constructor(props){
        super(props);
      }
    
    render(){
        
        if(TokenService.hasAuthToken()){
            return(
                <div className="container">
                    <Route exact path='/' component={LoadingPage} />
                </div>
            ); 
        }

        else{
            return(
                <div className='page-container'>
                    <header className='landing header'>
                    
                        <h1>Work made easy.</h1>
                        {/*<button className='signup-button' type='button' onClick={() => this.handleSignUp()}>Sign up!</button>*/}
                        <NavLink to='/signup'>Sign Up</NavLink>

                        <p> <span className="demo-info">Demo account's log in info:<br></br>Business name: <b>Fake Company Inc</b><br></br>Password: <b>Password5!</b></span> </p>
                    </header>
                    {/*
                    <div className='exterior-box hidden'>
                        <div className='signup-box'>
    
                            <header>
                                <h3>Anytime Scheduler is in Beta</h3>
                            </header>
    
                            <p>Please try again by 3/1/2020</p>
                            <button onClick={() => toggleSignup(e)} type="button" className='signup-box-button'>Ok</button>
    
                        </div>
                    </div>
                    */}
                    <div className='section-info'>
                    {/* SECTION ONE*/}
                        <section className='info'>
    
                            <header>
                                <h3>Instant Scheduling</h3>
                            </header>
    
                            <p>Generate schedules for employees and managers to veiw 
                                for any department, at any time, unlimited times!</p>
                        </section>
    
    
                        {/* SECTION TWO*/}
                        <section className='info'>
    
                            <header>
                                <h3>Full Control</h3>
                            </header>
    
                            <p>You have full control of the hour of operations of the 
                                business, how many employees to staff per hour of each 
                                day, and how far in advance you'd like to generate schedules.</p>
                        </section>
    
                        {/* SECTION THREE*/}
                        <section className='info'>
    
                            <header>
                                <h3>Accessibility</h3>
                            </header>
    
                            <p>You have full, unlimited access, to view the generated schedule
                                from any device</p>
                        </section>
                    </div>
                </div>
                );
        }
    }
}


export default LandingPage;