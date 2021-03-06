import React from 'react';
import {withRouter} from 'react-router-dom';
import './HoursPage.css';
import {InfoContext} from '../InfoContext';
import TokenService from '../services/token-service';
import config from '../config';

const { hoursPM, hoursAM } = require('../Hours');
class HoursPage extends React.Component{ 

    /* 
        ---------------------------------
        |            CONTEXT            |
        ---------------------------------
    */
   static contextType = InfoContext;

    /* 
        ---------------------------------
        |            STATE              |
        ---------------------------------
    */
   constructor(props){
        super(props);
        this.state = {
            index: 0,
            open_time: -1,
            close_time: -1,
            messageClass:'message hide',
            alertMessage: '',
        };
    }

    /* 
        ---------------------------------
        |            METHODS            |
        ---------------------------------
    */
    logout = () => {
        this.context.logout();
        const {history} = this.props;
        history.push('/');
    }

   clearAlert = () => {
        this.setState({
            alertClass:"message hide"
        });
    }

    showAlert = (message, successClass='') => {
        this.setState({
            alertClass: `message ${successClass}`,
            alertMessage: message
        });
    }

    updateOpenTime = (val) => {
        this.clearAlert();
        if(parseInt(val) !== -1){
            this.setState({open_time: parseInt(val)});
        }
        else{
            this.setState({open_time: -1});
        }
    }

    updateCloseTime = (val) => {
        this.clearAlert();
        if(parseInt(val) !== -1){
            this.setState({close_time: parseInt(val)});
        }
        else{
            this.setState({close_time: -1});
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {open_time, close_time } = this.state;
        //if closes before it opens AND open AND close are not closed. OR they are both closed. 
        if(( close_time > open_time && close_time !== -1 && open_time !== -1) || ( open_time === -1 && close_time === -1) ){
            this.clearAlert();
            //if the operation data contains any data
            if((this.context.dayData? this.context.dayData.length : null) > 0 ){
                //iterate through the operation table
                this.context.dayData.forEach(businessDay => {
                    //verify that the day we are accessing matches the day selected 
                        // The variables have been overridden
                        //verify that a change has been made, either to the opening our closing hour
                        if(parseInt(open_time) !== parseInt(businessDay.open_time===""? 0 : businessDay.open_time) || parseInt(close_time) !== parseInt(businessDay.close_time)){
                            this.patchBusinessDay(businessDay.id, open_time, close_time);
                        }
                        else{
                            //show an error noting that no change was made
                            this.showAlert('Error: No change has been made.');
                        }
                });    
            }
            //if no info in database exists, add this to the database
            else{
                this.addBusinessDay(open_time, close_time);  
            }
        }
        //if closes before its open or one is closed while the other isn't.
        else{
            this.showAlert('Error: The opening time must come before the closing time.');
            return;
        }
    }

    addBusinessDay = (open_time, close_time) => {
        fetch(`${config.URL}/all`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'table':'operation',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify({business_id: TokenService.getId(), open_time, close_time})
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status);
                });
            }
            this.showAlert('Successfully Updated','success');
            this.context.updateBusinessDay();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.');
            this.logout();
        });
    }

    patchBusinessDay = (id, open_time, close_time) => {
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'operation',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify({open_time, close_time})
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status);
                });
            }
            this.showAlert('Successfully Updated','success');
            this.context.updateBusinessDay();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.');
            this.logout();
        });
    }

     /* 
        ---------------------------------
        |       COMPONENT DID MOUNT     |
    -----                               -----------------------------------------------------------------------------------------
    |    I need to know when this the fetch call in App.js has been completed                                                   |
    |    and the values have been stored in context:                                                                            |
    |    1) The state must handle the select/option time, however, I also need to set the default time to match the time        |
    |       database.                                                                                                           |
    |----------------------------------------------------------------------------------------------------------------------------

    */
    async componentDidMount(){
        //must use try/catch for async calls
        try{
            //await the response (aka resolve) from checkFetch
            await this.context.checkFetch();
            if(this.context.dayData.length > 0) {
                this.setState({
                    open_time: parseInt(this.context.dayData[0].open_time),
                    close_time: parseInt(this.context.dayData[0].close_time)
                });
            }
        } catch (err){
            // error occurred
        }
    }

     /* 
        ---------------------------------
        |            RENDER             |
        ---------------------------------
    */
    render(){
        let business = this.context.businessData;
        let operationHours = this.context.dayData;
        return(
        <div className="page-container crud">

            <div className='back'>
                <button className="back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>
            
            <header className='header'>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <p>Select the hours of operation</p>
            </header>

            <form className="employee-form"  onSubmit={e => this.handleSubmit(e)}> 
                
                <section className="section-form">
                    <div className="section-form-inner">
                        <label htmlFor="hours">Open:</label>
                        <select value={(operationHours.length > 0? this.state.open_time === -1? operationHours[0].open_time : this.state.open_time : this.state.open_time)}  className='hours' onChange={(e) => this.updateOpenTime(e.target.value)}> 
                            <option value='-1'>Closed</option>

                            {hoursAM.map((hour,id) =>
                                    <option key={id} value={hour.id}>{hour.time}</option>
                                )
                            }
                        </select>
                    </div>
                </section>

                    
                <section className="section-form">
                    <div className="section-form-inner">
                        <label htmlFor="hours">Close:</label>
                        <select value={(operationHours.length > 0? this.state.close_time === -1? operationHours[0].close_time : this.state.close_time : this.state.close_time)} className='hours'  onChange={(e) => this.updateCloseTime(e.target.value)}>
                            <option value='-1'>Closed</option>

                            {hoursPM.map((hour,id) =>
                                    <option key={id} value={hour.id}>{hour.time}</option>
                                )
                            }
                            
                        </select>
                    </div>
                </section>


                <button type='submit' className='submit'>Submit</button>

                <section className={this.state.alertClass}>
                    <p>{this.state.alertMessage}</p>
                </section>

            </form>
                
                

          
        </div>
        );
    }
}


export default withRouter(HoursPage);