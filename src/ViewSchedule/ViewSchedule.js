import React from 'react';
import { NavLink } from 'react-router-dom';

import { Container, Row, Col } from 'react-grid-system';

import './ViewSchedule.css';

import {InfoContext } from '../InfoContext';

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
            setup: []
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
        console.log('- - - mounted');
        //must use try/catch for async calls
        try{
            //console.log(' --- START AWAIT')
            //await the response (aka resolve) from checkFetch
            let fetched = await this.context.checkFetch();
            console.log('- - - fetched');
            console.log('fetch: ',fetched)

            //console.log('ITEMS HAVE BEEN FETCHED: ',fetched,this.context.employeeData)

            //Finally can pass the context to the function
            let newSetup = logic.setupAlgo(this.context.employeeData, this.context.positionData, this.context.dayData);
            console.log('- - - received');


            console.log('SETUP: ', newSetup)

            this.setState({
                setup: newSetup
            });

        } catch (err){
            // console.log('ERROR in PROMISE: ',err)
        }

        

    }
    
    render(){

        let selectedHour = this.props.selectedHour;
        let business = this.context.businessData;  
        let operationHours = this.context.dayData;      
       

        return(
            
        <div className='grid-container'>

            {(selectedHour !== 'None')
            ?<Container className="grid" fluid style={{ lineHeight: '32px'}}>
                <Row className='column'>
                    <Col>Position:</Col> 
                    <Col>Employee:</Col>
                   
                </Row>

                <br />

                {this.state.setup.map((hour,id) => 
                    (id + parseInt(operationHours[0].open_time) === parseInt(selectedHour))
                        ?hour.map(obj =>
                            <Row className='row' key={id}>
                                <Col>{obj.pos}</Col>
                                <Col>{obj.emp}</Col>
                            </Row>  
                            
                        )
                        :null
                       
                )}
                    
                
            </Container>
            :<div className='alt-message'>
                <h2>No hour selected.</h2>
            </div>}
        </div>
        );
    }
}


export default ViewSchedule;