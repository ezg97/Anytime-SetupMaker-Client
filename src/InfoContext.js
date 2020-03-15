import React, { createContext, Component} from 'react';

export const InfoContext = createContext({
    businessData: null,
    employeeData: null, 
    dayData: null,//operation hours
    laborData: null,
    scheduleData: null,
    fetched: null,
    checkFetch: () => {

    },
    updateEmployees: () => {

    },
    updateBusinessDay: () => {

    },
    updateBusinessLabor: () => {

    },

});

export default InfoContext;

/*
export const InfoContext = createContext();

class InfoContextProvider extends React.Component {
    state = {
        businessData: null,
        employeeData: null, dayData: null,
        laborData: null,
        scheduleData: null,
        updateEmployees: () => {

        }
    }

    

    render() {
        return(
            <InfoContext.Provider value={...this.state}>
                {this.props.children}
            </InfoContext.Provider>

        );
    }

}


export default InfoContext;*/