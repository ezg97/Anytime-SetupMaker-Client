import React from 'react';
import { Route } from 'react-router-dom';

import './LandingPage.css';
import LoadingPage from '../LoadingPage/LoadingPage';

import TokenService from '../services/token-service'



class LandingPage extends React.Component{ 
    
    
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
                <div id='landing-bg' className='page-container display'>
                   
                    <header className='header landing-header'>
                    
                        <h1>Work made easy</h1>
                    </header>
                    
                    <div className='section-info'>
                        {/* SECTION ONE*/}
                        <section className='info-landing'>
    
                            <header>
                                <h3>Instant Scheduling</h3>
                            </header>
    
                            <p>Generate schedules for employees and managers to veiw 
                                for any department, at any time, unlimited times</p>
                        </section>
    
    
                        {/* SECTION TWO*/}
                        <section className='info-landing'>
    
                            <header>
                                <h3>Full Control</h3>
                            </header>
    
                            <p>You have full control of the hour of operations of the 
                                business, how many employees to staff per hour of each 
                                day, and how far in advance you'd like to generate schedules</p>
                        </section>
    
                        {/* SECTION THREE*/}
                        <section className='info-landing'>
    
                            <header>
                                <h3>Accessibility</h3>
                            </header>
    
                            <p>You have full, unlimited access to view the generated schedule
                                from any device</p>
                        </section>
                    </div>

                </div>
                );
        }
    }
}


export default LandingPage;