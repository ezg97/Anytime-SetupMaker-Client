import React from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';

import NavBar from '../NavBar/NavBar'
import LandingPage from '../LandingPage/LandingPage';

import LoginPage from '../LoginPage/LoginPage';
import SignupPage from '../SignupPage/SignupPage';
import UnknownPage from '../UnknownPage/UnknownPage';

import LoadingPage from '../LoadingPage/LoadingPage';


import "./AltApp.css"




class AltApp extends React.Component{ 

    
    render(){



        return(
        <div className="container">

        

            {/* LANDING PAGE */}
            <Route exact path='/'
                render={(routeProps) =>
                    <NavBar
                        bool={'false'}
                    />
                }
            />
            <main role="main">

                {/* MAIN TEXT SECTION */}
                <Switch>
                    <Route exact path='/' 
                        render={(routeProps) =>
                            <LandingPage
                                LoggingInBool={false} 
                            />
                        }
                    />
                
                <Route exact path='/login' 
                render={(routeProps) =>
                  <LoginPage
                    onClickBack={() =>routeProps.history.goBack()} 
                    pushHome={() => routeProps.history.push('/')}
                  />}
                />

                <Route exact path='/signup' 
                render={(routeProps) =>
                  <SignupPage
                    onClickBack={() =>routeProps.history.goBack()} 
                    pushHome={() => routeProps.history.push('/')}
                  />}
                />

                <Route path='/' component={UnknownPage} />
                {/* <Route exact path='/login' component={LoginPage} /> */}
                
                {/* <Route exact path='/signup' component={SignupPage} /> */}
                
                {/* <Route exact path='/home' component={LoadingPage} /> */}

                </Switch>

            </main>
        </div>
        );
    }
}


export default AltApp;