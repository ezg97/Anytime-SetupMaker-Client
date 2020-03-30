import React, {Component} from 'react';
import {Route, Switch , NavLink} from 'react-router-dom';

import './App.css'

import InfoContext from '../InfoContext';

import LandingPage from '../LandingPage/LandingPage';
import Demo from '../Demo/Demo';
import NavBar from '../NavBar/NavBar'
import HomePage from '../HomePage/HomePage';
import OperationsPage from '../OperationsPage/OperationsPage';
import EmployeesPage from '../EmployeesPage/EmployeesPage';
import AddEmployeesPage from '../AddEmployeesPage/AddEmployeesPage';
import AddPositionsPage from '../AddPositionsPage/AddPositionsPage';
import PositionsPage from '../PositionsPage/PositionsPage';

import HoursPage from '../HoursPage/HoursPage';
import SchedulePage from '../SchedulePage/SchedulePage'
import UnknownPage from '../UnknownPage/UnknownPage';


import TokenService from '../services/token-service'
import config from '../config'

import AuthApiService from '../services/auth-api-service'
import { getByTestId } from '@testing-library/react';
//da

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      business: [],
      hours: [],
      employees: [],
      position: [],
      schedule: [],
      fetched: 'not updated',
      requests: [
                {   
                    url:`${config.URL}/business/${TokenService.getId()}`,
                    table:'operation',
                },

                {   
                    url:`${config.URL}/business/${TokenService.getId()}`,
                    table:'employee',
                },
                {   
                  url:`${config.URL}/business/${TokenService.getId()}`,
                  table:'position',
              },

                {   
                    url:`${config.URL}/business/${TokenService.getId()}`,
                    table:'schedule',
                },
      ],
    };
  }

  /* 
        ---------------------------------
        |            CONTEXT            |
        ---------------------------------
    */
   static contextType = InfoContext;



  checkFetch = () => {
    return new Promise( (resolve,reject) => {

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


    this.fetchDatabase();

    /* if a user is logged in */
    if (TokenService.hasAuthToken()) {
                /*
          Tell the token service to read the JWT, looking at the exp value
          and queue a timeout just before the token expires
        */

        TokenService.queueCallbackBeforeExpiry(() => {
            /* the timoue will call this callback just before the token expires */
            AuthApiService.postRefreshToken()
        });
    }
  }

  componentWillUnmount() {

    /* remove the token from localStorage */
    TokenService.clearAuthToken()
    /*
      and remove the refresh endpoint request
    */
    TokenService.clearCallbackBeforeExpiry()
  }

  

  fetchDatabase = () => {
    //
    Promise.all(this.state.requests.map(request =>
        fetch(request.url,
          {   
              headers: {  
                          'table':request.table,
                          'Authorization':`bearer ${TokenService.getAuthToken()}`
                      }
          }
        )
        .then(data => {
            if (!data.ok){
                data=[];
                return data;
            }

            return data.json();
        })

      ))
      .then( ([hours, employees, position, schedule]) => {

            let business = fetch(`${config.URL}/${TokenService.getId()}`,
            {
                headers: {
                    'table':'business',
                    'Authorization':`bearer ${TokenService.getAuthToken()}`
                }
            })
            .then(data => {
              
              if (!data.ok){
                  return data.json().then(e => Promise.reject(e));}

              return data.json();
            });

         
            return Promise.all([business, hours, employees, position, schedule]);
      })
      .then( ([business, hours, employees, position, schedule]) => {  
            

            //fetch has been completed and the state has been updated so set "fetched" to true
        
            this.setState({business, hours, employees, position, schedule, fetched: true});

            
      })
      .catch(error => {
            console.error({error});
      });
  }
  //methods
  updateEmployees = () => {
    fetch(`${config.URL}/business/${TokenService.getId()}`,
        {
            headers: {
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`

            }
        })
        .then( (employees) => {
          
          if (!employees.ok){

            //404 not found is the error received when the last item is deleted from the list
            if(employees.status != 404)
              return employees.json().then(e => Promise.reject(e));

            //it was a 404 error so the last position has been deleted, return an empty list
            return [];
          }
          

          return employees.json();
      })
      .then( (employees) => {
          this.setState({employees});
      })
      .catch(error => {
          console.error({error})
      });

  }

  updatePositions = () => {
    fetch(`${config.URL}/business/${TokenService.getId()}`,
        {
            headers: {
                'table':'position',
                'Authorization':`bearer ${TokenService.getAuthToken()}`

            }
        })
        .then( (position) => {
          if (!position.ok){

            //404 not found is the error received when the last item is deleted from the list
            if(position.status != 404)
              return position.json().then(e => Promise.reject(e));

            //it was a 404 error so the last position has been deleted, return an empty list
            return [];
          }
          

          return position.json();
      })
      .then( (position) => {
        console.log('setting the position state: ',position)
          this.setState({position});
      })
      .catch(error => {
        console.log('err??')
          console.error({error})
      });

  }

  updateBusinessDay = () => {
    fetch(`${config.URL}/business/${TokenService.getId()}`,
        {
            headers: {
                'table':'operation',
                'Authorization':`bearer ${TokenService.getAuthToken()}`

            }
        })
        .then( (hours) => {
          
          if (!hours.ok)
              return hours.json().then(e => Promise.reject(e));
          

          return hours.json();
      })
      .then( (hours) => {
          this.setState({hours});
      })
      .catch(error => {
          console.error({error})
      }); 
  }

  updateSchedule = () => {
    fetch(`${config.URL}/business/${TokenService.getId()}`,
        {
            headers: {
                'table':'schedule',
                'Authorization':`bearer ${TokenService.getAuthToken()}`

            }
        })
        .then( (schedule) => {
          
          if (!schedule.ok)
              return schedule.json().then(e => Promise.reject(e));
          

          return schedule.json();
      })
      .then( (schedule) => {
          this.setState({schedule});
      })
      .catch(error => {
          console.error({error})
      });    
  }

  //Sorts a list numerically, with the exception of putting 12 on the top, and returns the sorted list.
  // @param {array} list - contains objects which contain a property called "shift_time".
  numberSort = (list) => {
    return list.sort(function(a, b) {
      //if a = 12, then return less than 0 (aka "a" is first)
      //if a != 12, then if b = 12 then return greater than 0 (aka "b" is first)
      //if b != 12, then perform "a-b" to see which is greater (at this point we're not dealing with 12 so we sort like normal)
      return (a.shift_time===12)? -1 : (b.shift_time===12)? 1 : parseInt(a.shift_time) - parseInt(b.shift_time);
    });
  }

  //Sorts a list alphabetically and returns the sorted list.
  // @param {array} list - contains objects which contain a property called "midday".
  alphaSort = (list) => {
    return list.sort(function(a, b) {
      let textA = a.midday.toUpperCase();
      let textB = b.midday.toUpperCase();
   
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0; 
    });
  }

  //Sorts the hours of the workday.
  sort = (list) => {
    //store in variable "sortedList"
    let sortedList = this.alphaSort(list);

    //USING the sortedList list: splice or separate the list of objects when (if) "PM" is reached.

    //find the index in the list where the object's property "midday" begins storing "PM"
    let indexOfSplit = sortedList.findIndex(obj => {
      if(obj.midday === "PM"){
        return obj;
      }
    });

    //If "PM" located inside the list (aka "-1" was NOT returned)
    if(indexOfSplit>=0){
      
      // Separate the alphabetically sorted list into two halves: 
      //  1) list containing only the AM hours. 
      //  2) list containing only the PM hours.
      let amList = sortedList.slice(0,indexOfSplit);
      let pmList = sortedList.slice(indexOfSplit);

      // Verify that the lists are not empty or not "undefined" before sorting the lists numerically
      if(!(amList===undefined || amList.length == 0)){
        amList = this.numberSort(amList);
      }
      if(!(pmList===undefined || pmList.length == 0)){
        pmList = this.numberSort(pmList);
      }

      // Merge both of the lists together and store them in "sortedList"
      sortedList = [...amList, ...pmList];
    }
    else{
      if(!(sortedList===undefined || sortedList.length == 0)){
        //return the amList sorted because the company is only open during "AM", not "PM"
        return this.numberSort(sortedList);
      }
    }
    
    //return the merged sorted list
    return sortedList;
  }



  //render
  render(){
    

    return (
      <InfoContext.Provider value={{businessData: this.state.business,
        employeeData: this.state.employees, 
        dayData: this.state.hours, 
        positionData: this.state.position,
        scheduleData: this.state.schedule,
        fetched: this.state.fetched,
        /* METHODS */
        checkFetch: this.checkFetch,
        updateEmployees: this.updateEmployees,
        updatePositions: this.updatePositions,
        updateSchedule: this.updateSchedule,
        updateBusinessDay: this.updateBusinessDay}}>

        <div className="container">
          {/* NAV BAR */console.log('state',this.state)}
          <Switch>

              {/* LANDING PAGE */}
              {/* <Route exact path='/'
                render={(routeProps) =>
                  <NavBar
                    bool={'false'}
                  />
                }
              /> */}

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

              {/* <Route exact path='/login' component={LoginPage} />
              
              <Route exact path='/signup' component={SignupPage} /> */}
              
            </Switch>

          </main>

        </div>
    </InfoContext.Provider>
    );
  }
}
  
  

export default App;
