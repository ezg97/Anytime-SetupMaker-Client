import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import './App.css';

import InfoContext from '../InfoContext';
import AltInfoContext from '../AltInfoContext';

import LandingPage from '../LandingPage/LandingPage';
import Demo from '../Demo/Demo';
import NavBar from '../NavBar/NavBar';
import HomePage from '../HomePage/HomePage';
import OperationsPage from '../OperationsPage/OperationsPage';
import EmployeesPage from '../EmployeesPage/EmployeesPage';
import AddEmployeesPage from '../AddEmployeesPage/AddEmployeesPage';
import AddPositionsPage from '../AddPositionsPage/AddPositionsPage';
import PositionsPage from '../PositionsPage/PositionsPage';

import HoursPage from '../HoursPage/HoursPage';
import SchedulePage from '../SchedulePage/SchedulePage';
import UnknownPage from '../UnknownPage/UnknownPage';

import LoginPage from '../LoginPage/LoginPage';
import SignupPage from '../SignupPage/SignupPage';


import TokenService from '../services/token-service';
import config from '../config';

import AuthApiService from '../services/auth-api-service';

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      business: [],
      hours: [],
      employees: [],
      position: [],
      fetched: 'not updated',
      requests: [{url:`${config.URL}/business/${TokenService.getId()}`, table:'operation'},
                {url:`${config.URL}/business/${TokenService.getId()}`, table:'employee'},
                {url:`${config.URL}/business/${TokenService.getId()}`, table:'position'}]
    };
  }

  /* 
        ---------------------------------
        |            CONTEXT            |
        ---------------------------------
    */
   static contextType = InfoContext;



  checkFetch = () => {
    return new Promise((resolve,reject) => {
        //gotta set this timeout for a second or else
        // the promise will be executed before the fetch
        //completes, thus, the below condition will always be false
        setTimeout(() => {
            if(this.state.fetched === true){
              resolve(true);
            }
        }, 1000);
      });
  }

  componentDidMount() {
    /* if a user is logged in */
    if (TokenService.hasAuthToken()) {
        /*
          Tell the token service to read the JWT, looking at the exp value
          and queue a timeout just before the token expires
        */
        this.fetchDatabase();
        TokenService.queueCallbackBeforeExpiry(() => {
            /* the timoue will call this callback just before the token expires */
            AuthApiService.postRefreshToken();
        });
    }
  }

  componentWillUnmount() {
    /* remove the token from localStorage */
    TokenService.clearAuthToken();
    /*
      and remove the refresh endpoint request
    */
    TokenService.clearCallbackBeforeExpiry();
  }

  logout = () => {
      TokenService.clearAuthToken();
      /* when logging out, clear the callbacks to the refresh api and idle auto logout */
      TokenService.clearCallbackBeforeExpiry();
      this.clearState();
  }

  clearState = () => {
    this.setState({
      business: [],
      hours: [],
      employees: [],
      position: [],
      fetched: 'not updated',
      requests: [],
    });
  }

  fetchDatabase = () => {
    //first update the requests
    this.updateRequests();
    Promise.all(this.state.requests.map(request =>
        fetch(request.url, {headers: {'table':request.table, 'Authorization':`bearer ${TokenService.getAuthToken()}`}})
        .then(data => {
          if (!data.ok){
            throw new Error(data.status);
          }
          return data.json();
        })
      ))
      .then(([hours, employees, position]) => {
        let business = fetch(`${config.URL}/${TokenService.getId()}`, {headers: {'table':'business', 'Authorization':`bearer ${TokenService.getAuthToken()}`}})
        .then(data => {
          if (!data.ok){
            return data.json().then(e => Promise.reject(e));
          }
          return data.json();
        });
        return Promise.all([business, hours, employees, position]);
      })
      .then(([business, hours, employees, position]) => {  
        //fetch has been completed and the state has been updated so set "fetched" to true
        this.setState({business, hours, employees, position, fetched: true});
      })
      .catch(error => {
          this.logout();
      });
  }
  //methods

    //update the requests with the current id, since it's only initialized when the page is loaded.
    updateRequests = () => {
      this.setState({
        requests: [{url:`${config.URL}/business/${TokenService.getId()}`, table:'operation'},
                  {url:`${config.URL}/business/${TokenService.getId()}`, table:'employee'},
                  {url:`${config.URL}/business/${TokenService.getId()}`, table:'position'}],
      });
    }
      
  updateEmployees = () => {
    fetch(`${config.URL}/business/${TokenService.getId()}`,
        {headers: {'table':'employee', 'Authorization':`bearer ${TokenService.getAuthToken()}`}
    })
    .then((employees) => {
      if (!employees.ok) {
        return employees.json().then(e => Promise.reject(e));
      }
      return employees.json();
    })
    .then((employees) => {
      this.setState({employees});
    })
    .catch(error => {
      this.logout();
    });
  }

  updatePositions = () => {
    fetch(`${config.URL}/business/${TokenService.getId()}`, {headers: {'table':'position', 'Authorization':`bearer ${TokenService.getAuthToken()}`}})
    .then((position) => {
      if (!position.ok){
        return position.json().then(e => Promise.reject(e));
      }
      return position.json();
    })
    .then((position) => {
      this.setState({position});
    })
    .catch(error => {
      this.logout();
    });
  }

  updateBusinessDay = () => {
    fetch(`${config.URL}/business/${TokenService.getId()}`, {headers: {'table':'operation', 'Authorization':`bearer ${TokenService.getAuthToken()}`}})
    .then((hours) => {      
      if (!hours.ok)
        return hours.json().then(e => Promise.reject(e));
          
      return hours.json();
    })
    .then((hours) => {
      this.setState({hours});
    })
    .catch(error => {
      this.logout();
    }); 
  }

  //render
  render(){
    if (TokenService.hasAuthToken()) {
      return (
        <InfoContext.Provider value={{businessData: this.state.business,
          employeeData: this.state.employees, 
          dayData: this.state.hours, 
          positionData: this.state.position,
          fetched: this.state.fetched,
          /* METHODS */
          logout: this.logout,
          clearState: this.clearState,
          checkFetch: this.checkFetch,
          updateEmployees: this.updateEmployees,
          updatePositions: this.updatePositions,
          updateBusinessDay: this.updateBusinessDay}}>

          <div className="container">
            {/* NAV BAR */}
            <Switch>
                {/* SIGNED IN */}
                <Route 
                  exact path={['/','/demo','/home','/operations','/employees', '/addEmployees','/positions','/addPositions',
                  '/hours','/schedule']}
                  render={(routeProps) =>
                    <NavBar
                      bool={'true'}
                    />
                  }
                />
            </Switch>

            <main role="main">
              {/* MAIN TEXT SECTION */}
              <Switch>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/demo' component={Demo} />
                <Route exact path='/home' component={HomePage} />
                <Route exact path='/operations' 
                  render={(routeProps) =>
                    <OperationsPage
                      onClickBack={() =>routeProps.history.goBack()} 
                    />}
                 />
                <Route exact path='/employees' 
                  render={(routeProps) =>
                    <EmployeesPage
                      onClickBack={() =>routeProps.history.goBack()} 
                    />}
                />
                <Route exact path='/addEmployees' 
                  render={(routeProps) =>
                    <AddEmployeesPage
                      onClickBack={() =>routeProps.history.goBack()} 
                    />}
                />
                <Route exact path='/positions' 
                    render={(routeProps) =>
                      <PositionsPage
                        onClickBack={() =>routeProps.history.goBack()} 
                      />}
                />    
                <Route exact path='/addPositions' 
                  render={(routeProps) =>
                    <AddPositionsPage
                      onClickBack={() =>routeProps.history.goBack()} 
                    />}
                  />
                <Route exact path='/hours' 
                  render={(routeProps) =>
                    <HoursPage
                      onClickBack={() =>routeProps.history.goBack()} 
                    />}
                  />
                <Route exact path='/schedule' 
                  render={(routeProps) =>
                    <SchedulePage
                      onClickBack={() =>routeProps.history.goBack()} 
                    />}
                  /> 
                <Route path='/' component={UnknownPage} />   
              </Switch>
            </main>
          </div>
      </InfoContext.Provider>
      );
    }
    else {
      return(
        <AltInfoContext.Provider value={{
          fetchDatabase: this.fetchDatabase}}>
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
                  />}
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
              </Switch>
              </main>
          </div>
        </AltInfoContext.Provider>
        );
    }
  }
}
  
  

export default App;
