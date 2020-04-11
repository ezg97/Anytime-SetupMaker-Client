import React from 'react';
import { withRouter } from 'react-router-dom';

import {InfoContext } from '../InfoContext';

import TokenService from '../services/token-service';
import config from '../config';

import levels from '../Levels';

class PositionsPage extends React.Component{ 


    /* 
        ---------------------------------
        |            STATE              |
        ---------------------------------
    */
    constructor(props){
        super(props);
        this.state = {
          position: '',
          skill: 0,
          importance: 0,
          id: 0,
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
            alertClass: `message ${successClass}`,
            alertMessage: message
        });

    }

        /* Handle Selected Employee:
            -- update the state to the current employee selected  */
    handleSelectedPosition = (val) => {

        this.clearAlert();

        /* Save the name selected to STATE */
        
        if (val !== "") {
            this.setState({position: val});
        }
        else {
            this.setState({position: ''});
        }

        /* Save the skill from the employee selected to STATE 
                note: for some reson !=== and !== did not work for this.*/
        if( !(val === '' )){
            this.context.positionData.forEach( obj => {
                if(obj){
                    if(obj.pos_name === val){ 

                        this.setState({
                            skill: obj.pos_skill,
                            importance: obj.pos_importance,
                            id: obj.id
                        });
                    }
                }
            });
        }
        else{
            this.setState(
                {
                    skill: 0,
                    importance: 0,
                    id: 0
                }
            );
        }
    }

        /* 
            Update Name:
            -- update the state to the current position name TYPED in the INPUT BOX 
        */
    updatePositions = (val) => {
        this.clearAlert();

        this.setState(
            {position: val}
        );
    }

        /* 
            Update skill:
            -- update the state to the current position skill SELECTED in the OPTION BOX 
        */
    updateSkill = (val) => {
        this.clearAlert();

        this.setState(
            {skill: val}
        );
    }

    updateImportance = (val) => {
        this.clearAlert();

        this.setState(
            {importance: val}
        );
    }


    handleDelete = () => {

        this.clearAlert();

        const {id } = this.state;

        //Verify that this position exists before deleting
        this.context.positionData.forEach(obj => {
            if(obj.id === id){ 
                this.deletePosition(id);      
            }
        });
    }


    handleSubmit = (event) => {
        event.preventDefault();

        const {position, skill, importance, id } = this.state;

        //Verify if ANY edits have been made to the position by comparing what's in the 
        // database with what we have in state
        this.context.positionData.forEach(obj => {
            if(obj.id === id){
                if(obj.pos_name !== position || obj.pos_skill !== skill || obj.pos_importance !== importance){
                    this.clearAlert();
                    this.patchPosition(position,skill, importance, id);
                }
                else{
                    this.showAlert("Error: No changes have been made.");
                }
            }
        });
    }
    
    deletePosition = (id) => {
        fetch(`${config.URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'table':'position',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            }
        })
        .then(res => {

            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status);
                });
            }
            
            
            this.context.updatePositions();
            this.handleSelectedPosition('');
            this.showAlert('Successfully Deleted','success');
        })
        .catch(err => {
            this.showAlert("Error: Please try again later.");
            this.logout();
        });
    }

    patchPosition = (name, skill, importance, id) => {
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'position',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { pos_name: name, pos_skill: skill, pos_importance: importance }
            )
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status);
                });
            }
            this.showAlert('Successfully Changed','success');
            this.context.updatePositions();
        })
        .catch(err => {
            this.showAlert('Error: Please try again later.');
            this.logout();
        });
    }


   
    /* 
        ---------------------------------
        |            RENDER             |
        ---------------------------------
    */
    render(){

        let position = this.context.positionData;
        let business = this.context.businessData;

    
        return(
        <div className="page-container crud">
            <div className='back'>
                <button className="back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>
                      
            {/* Header */}
            <header className='header'>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <p>Select a position from the drop down menu, 
                    then edit or delete the position.</p>

            </header>

           {/* FORM */}
            <form className="employee-form" onSubmit={e => this.handleSubmit(e)}>
                    
                <section className="section-form">
                    <div className="section-form-inner">

                        <label htmlFor="employee">Position:</label>
                        {/* Name INPUT */}
                        <select id='select-employees' onChange={(e) => this.handleSelectedPosition(e.target.value)}>
                                <option value="">None</option>

                                {position.map( (obj, id) => 
                                    /* Have to test the value exists before proceeding*/
                                    <option key={id} value={obj? obj.pos_name:null}>{obj? obj.pos_name:null}</option>
                                )}

                        </select>

                    </div>
                </section>

                <section className="section-form">
                    <div className="section-form-inner">
                        <label htmlFor="name">Name:</label>
                        {/* Name INPUT */}
                        <input 
                            type="text"
                            className="name-box" 
                            name="name" 
                            id="name" 
                            value={this.state.position}
                            onChange={(e) => this.updatePositions(e.target.value)}
                        />
                    </div>
                </section>

                <section className="section-form">
                    <div className="section-form-inner">
                        <label htmlFor="importance">Importance:</label>
                        {/* skill SELECTION */}
                        <select value={this.state.importance} id='importance' onChange={(e) => this.updateImportance(e.target.value)}>
                        
                            {position.map( obj => 
                                /* Have to test the value exists before proceeding*/
                                (obj.id === this.state.id)
                                    ? levels.map( (pos, id) => 
                                        (pos.id === parseInt(obj.pos_importance))
                                            ?<option key={id} value={obj? obj.pos_importance:null}>{obj? obj.pos_importance===1? "Low" :
                                                                                                        obj.pos_importance===2? "Medium" :
                                                                                                        obj.pos_importance===3? "High" : null : null}</option>
                                            :<option key={id} value={pos.id}>{pos.level}</option>
                                    )
                                    :null
                            )}
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
                <button type='button' className='submit' onClick={() => this.handleDelete()}>Delete</button>

                <section className={this.state.alertClass}>
                    <p>{this.state.alertMessage}</p>
                </section>

            </form>
                
                

          
        </div>
        );
    }
}


export default withRouter(PositionsPage);