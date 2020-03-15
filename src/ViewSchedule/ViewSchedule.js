import React from 'react';
import { NavLink } from 'react-router-dom';

import { Container, Row, Col } from 'react-grid-system';

import './ViewSchedule.css';

import {InfoContext } from '../InfoContext';

import TokenService from '../services/token-service'


const logic = require('../test');



class ViewSchedule extends React.Component{ 


    /* 
        ---------------------------------
        |            STATE              |
        ---------------------------------
    */
   constructor(props){
        super(props);
        this.state = {
            schedule: []
        };
    }


    /* 
        ---------------------------------
        |            CONTEXT            |
        ---------------------------------
    */
    static contextType = InfoContext;



    /* 
        ---------------------------------
        |       COMPONENT DID MOUNT     |
    -----                               -----------------------------------------------------------------------------------------
    |    I need to know when this components parent's fetch                                                                     |
    |    call has been completed because:                                                                                       |
    |    1) the function I want to call will update the state, thus causing an infinite render loop if called inside render     |
    |    AND                                                                                                                    |
    |    2) the reason why I need to verify the fetch call has been made is because I'm passing the data from the fetch call    |
    |    (via context) into the function as parameters                                                                          |
    |                                                                                                                           |
    |----------------------------------------------------------------------------------------------------------------------------

    */
    async componentDidMount(){

        //must use try/catch for async calls
        try{
            //console.log(' --- START AWAIT')
            //await the response (aka resolve) from checkFetch
            let fetched = await this.context.checkFetch();

            //console.log('ITEMS HAVE BEEN FETCHED: ',fetched,this.context.employeeData)

            //Finally can pass the context to the function
            let newSchedule = logic.scheduleAlgo(this.context.employeeData, this.context.laborData, this.context.dayData);


            this.setState({
                schedule: newSchedule
            });

        } catch (err){
            //console.log('ERROR in PROMISE: ',err)
        }

    }
    
    render(){

        let selectedDay = this.props.selectedDay;

        let businesses = this.context.businessData;        
       

        return(
            
        <div className='grid-container'>
            {(selectedDay != 'None')
            ?<Container className="grid" fluid style={{ lineHeight: '32px'}}>
                <Row className='column'>
                    <Col>Employee:</Col>
                    <Col>{selectedDay}:</Col>
                   
                </Row>
                <br />
                {this.state.schedule.map(employee => 
                    (employee)
                        ?<Row className='row'>
                                <Col>{employee.name}</Col>
                                <Col>{selectedDay==="Sun"?
                                        employee.sunday:selectedDay==="Mon"?
                                        employee.monday:selectedDay==="Tues"?
                                        employee.tuesday:selectedDay==="Wed"?
                                        employee.wednesday:selectedDay==="Thurs"?
                                        employee.thursday:selectedDay==="Fri"?
                                        employee.friday:selectedDay==="Sat"?
                                        employee.saturday:null
                                    }</Col>
                        </Row>
                        :null)
                }
                    
                
            </Container>
            :<div className='alt-message'>
                <h2>No day selected.</h2>
            </div>}
        </div>
        );
    }
}


export default ViewSchedule;