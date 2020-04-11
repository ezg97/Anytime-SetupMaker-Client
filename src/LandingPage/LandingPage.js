import React from 'react';
import { Route } from 'react-router-dom';

import './LandingPage.css';
import LoadingPage from '../LoadingPage/LoadingPage';

import TokenService from '../services/token-service';



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
                                <h3>Advanced Setups</h3>
                            </header>
    
                            <p>Take advantage of cutting edge algorithms that will ensure the best 
                                employees are in the best positions at all times due to a ranking system</p>
                        </section>
    
    
                        {/* SECTION TWO*/}
                        <section className='info-landing'>
    
                            <header>
                                <h3>Full Control</h3>
                            </header>
    
                            <p>You have full control of the positions available, the employees 
                                working and their shifts, how far in advance you'd like 
                                to generate setups and more</p>
                        </section>
    
                        {/* SECTION THREE*/}
                        <section className='info-landing'>
    
                            <header>
                                <h3>Accessibility</h3>
                            </header>
    
                            <p>You have full, unlimited access to view the generated setups
                                from any device, at anytime, unlimited times</p>
                        </section>
                    </div>

                </div>
                );
        }
    }
}


export default LandingPage;