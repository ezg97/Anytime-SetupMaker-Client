import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import {InfoContext } from '../InfoContext';
import config from '../config'

import { withRouter } from 'react-router-dom';
import TokenService from '../services/token-service'


class AddPositionsPage extends React.Component{ 


    /* 
        ---------------------------------
        |            STATE              |
        ---------------------------------
    */
    constructor(props){
        super(props);
        this.state = {
          position: '',
          skill: 1,
          importance: 1,
          //Verify if ANY edits have been made to the employee by comparing what's in the 
        // database with what we have in state
          positionExists: false,
          messageClass:'message hide',
          alertMessage: '',
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
        |            METHODS            |
        ---------------------------------
    */
   logout = () => {

    this.context.logout();
    const { history } = this.props;
    history.push('/');
}

   clearAlert = () => {
        this.setState({
            alertClass:"message hide"
        });
    }

    showAlert = (message, successClass='') => {
        this.setState({
            alertClass: "message"+" "+successClass,
            alertMessage: message
        });
    }

        /* 
            Update Name:
            -- update the state to the current employee name TYPED in the INPUT BOX 
        */
    updatePosition = (val) => {
        let matched = false;
        console.log('update text: ',val);
        this.context.positionData.forEach(position => {
            if(position.pos_name.toLowerCase() === val.toLowerCase()){
                this.updatePositionExists(true);
                matched = true;
                this.showAlert('Error: This Position already exists.');
                
            }
        });

        if(matched === false){
            this.clearAlert()
            this.updatePositionExists(false);
        }
       
        this.setState(
            {position: val}
        );
    }

        /* 
            Update Availability:
            -- update the state to the current employee availability SELECTED in the OPTION BOX 
        */
    updateSkill = (val) => {
        this.setState(
            {skill: parseInt(val)}
        )
    }

    updateImportance = (val) => {
        this.setState(
            {importance: parseInt(val)}
        )
    }

    updatePositionExists = (bool) => {
        if(bool===true){
            this.setState({
                positionExists: true
            });
        }
        else{
            this.setState({
                positionExists: false
            });
        }

    }

    handleSubmit = (event) => {
        event.preventDefault();

        const {position, skill, importance } = this.state;

        console.log('wanna submit this: ',this.state)

        if(this.state.positionExists === false){
            this.postPosition(position,skill, importance);
        }
        // This would be redundant, except it's needed for after the user submits a new user succesfully
        // if they make no changes to the user and click submit twice, then the "success" message will
        // still be showing, thi.s else block will update the message to be an error
        else{
            this.showAlert('Error: This Position already exists.');
        }
    }

    postPosition = (name, pos_skill, pos_importance) => {
        console.log('skill:',typeof(skill),'importance: ',typeof('importance'))
        fetch(`${config.URL}/all`, {  
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'table':'position',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { business_id: parseInt(TokenService.getId()), pos_name: name, pos_importance, pos_skill }
            )
        })
        .then(res => {
            console.log('res', res)
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            //show the user this action was successful
            this.showAlert('Successfully Added','success');
            //reset the "does user exist" boolean to true, since the user now exists since it was just added
            // or else subsequent submit clicks will create a duplicate user
            this.updatePositionExists(true);

            //now that an employee has been added to the database, make a new call to get all the employees again
            this.context.updatePositions();
        })
        .catch(err => {
            this.showAlert("Error: Please try again later.");
            console.log('logging out why?',err);
           // this.logout();
        });
    }


   
    /* 
        ---------------------------------
        |            RENDER             |
        ---------------------------------
    */
    render(){

        let positions = this.context.positionData;
        let business = this.context.businessData;

    
        return(
        <div className="page-container crud">

            <div className='back'>
                <button className="back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>
                      
            {/* Header */console.log('state: ',this.state)}
            <header className='header'>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <p>Enter the name, skill preference, and importance of the position.</p>
       

            </header>

           {/* FORM */}
            <form className="employee-form" onSubmit={e => this.handleSubmit(e)}>

                <section className="section-form">
                    <div className="section-form-inner">
                        <label htmlFor="name">Position:</label>
                        {/* Name INPUT */}
                        <input 
                            type="text"
                            className="name-box" 
                            name="name" 
                            id="name" 
                            placeholder="Register"
                            value={this.state.position}
                            onChange={(e) => this.updatePosition(e.target.value)}
                        />
                    </div>
                </section>

                <section className="section-form">
                    <div className="section-form-inner">
                        <label htmlFor="importance">Importance:</label>
                        {/* Availability SELECTION */}
                        <select id='importance' onChange={(e) => this.updateImportance(e.target.value)}>
                            
                            <option value={1} selected>Low</option>
                            <option value={2}>Medium</option>    
                            <option value={3}>High</option>              
                        </select>
                    </div>
                </section>

                <section className="section-form">
                    <div className="section-form-inner">
                        <label htmlFor="quantity">Skill:</label>
                        <input type="number" className='quantity-box' name="quantity" id="quantity" 
                        value={this.state.skill} onChange={(e) => this.updateSkill(e.target.value)}
                        min="1" max="10"/>
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


export default withRouter(AddPositionsPage);