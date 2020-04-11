import React from 'react';
import './EmployeesPage.css';
import {InfoContext } from '../InfoContext';
import TokenService from '../services/token-service';
import config from '../config';
import { withRouter } from 'react-router-dom';



class EmployeesPage extends React.Component{ 


    /* 
        ---------------------------------
        |            STATE              |
        ---------------------------------
    */
    constructor(props){
        super(props);
        this.state = {
          emp: '',
          skill: 0,
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
    handleSelectedEmployee = (val) => {

        this.clearAlert();

        /* Save the name selected to STATE */
        if(val !== ""){
            this.setState({emp: val});
        }
        else{
            this.setState({emp: ''});
        }

        /* Save the availability from the employee selected to STATE 
                note: for some reson !=== and !== did not work for this.*/
        if( !(val === '')){
            this.context.employeeData.forEach( employee => {
                if(employee){
                    if(employee.emp_name === val){ 

                        this.setState({
                            skill: employee.emp_skill,
                            id: employee.id
                        });
                    }
                }
            });
        }
        else{
            this.setState(
                {
                    skill: "",
                    id: 0
                }
            );
        }
    }

        /* 
            Update Name:
            -- update the state to the current employee name TYPED in the INPUT BOX 
        */
    updateName = (val) => {
        this.clearAlert();

        this.setState(
            {emp: val}
        );
    }

        /* 
            Update Availability:
            -- update the state to the current employee availability SELECTED in the OPTION BOX 
        */
    updateSkill = (val) => {
        this.clearAlert();

        this.setState(
            {skill: val}
        );
    }


    handleDelete = () => {

        this.clearAlert();

        const {id } = this.state;

        //Verify that this employee exists before deleting
        this.context.employeeData.forEach(employee => {
            if(employee.id === id){ 
                this.deleteEmployee(id);                
            }
        })
    }


    handleSubmit = (event) => {
        event.preventDefault();

        const {emp, skill, id } = this.state;

        //Verify if ANY edits have been made to the employee by comparing what's in the 
        // database with what we have in state
        this.context.employeeData.forEach(employee => {
            if(employee.id === id){
                if(employee.emp_name !== emp || employee.emp_skill !== skill){
                    this.clearAlert();
                    this.patchEmployee(emp, skill, id);
                }
                else{
                    this.showAlert("Error: No changes have been made.");
                }
            }
        })
    }
    
    deleteEmployee = (id) => {
        fetch(`${config.URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            }
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status);
                });
            }

            this.context.updateEmployees();

            this.handleSelectedEmployee('None');
            this.showAlert('Successfully Deleted','success');

        })
        .catch(err => {
            this.showAlert("Error: Please try again later.");
            this.logout();
        });
    }

    patchEmployee = (name, emp_skill, id) => {
        fetch(`${config.URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'table':'employee',
                'Authorization':`bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify( 
                { emp_name: name, emp_skill  }
            )
        })
        .then(res => {
            if( !res.ok ){
                return res.json().then(err => {
                    throw new Error(err.status)
                })
            }
            this.showAlert('Successfully Changed','success');
            this.context.updateEmployees();
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

        let employees = this.context.employeeData;
        let business = this.context.businessData;
    
        return(
        <div className="page-container crud">
            <div className='back'>
                <button className="back-button" onClick={this.props.onClickBack}>&#x202D;&#10094;</button>
            </div>
                      
            {/* Header */}
            <header className='header'>
                <h1>{business.length>0? business[0].business_name:null}</h1>
                <p>Select an employee from the drop down menu, 
                    then edit or delete the employee.</p>

            </header>

           {/* FORM */}
            <form className="employee-form" onSubmit={e => this.handleSubmit(e)}>

                <section className="section-form">
                    <div className="section-form-inner"> 
                        <label htmlFor="employee">Employee:</label>
                        {/* Name INPUT */}
                        <select id='select-employees' onChange={(e) => this.handleSelectedEmployee(e.target.value)}>
                                <option value="">None</option>

                                {employees.map( (employee, id) => 
                                    /* Have to test the value exists before proceeding*/
                                    <option key={id} value={employee? employee.emp_name:null}>{employee? employee.emp_name:null}</option>
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
                            value={this.state.emp}
                            onChange={(e) => this.updateName(e.target.value)}
                        />
                    </div>
                </section>

                {/* skill SELECTION */}
                <section className="section-form">
                    <div className="section-form-inner">
                        <label htmlFor="quantity">Skill:</label>
                        <input type="number" className='quantity-box' name="quantity" id="quantity" 
                        value={this.state.skill} onChange={(e) => this.updateSkill(e.target.value)}
                        min="1" max="100"/>
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


export default withRouter(EmployeesPage);