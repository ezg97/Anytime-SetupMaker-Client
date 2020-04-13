import {createContext} from 'react';

export const InfoContext = createContext({
    businessData: null,
    employeeData: null, 
    positionData: null, 
    dayData: null,
    scheduleData: null,
    fetched: null,
    logout: () => {
    },
    clearState: () => {
    },
    checkFetch: () => {
    },
    updateEmployees: () => {
    },
    updatePositions: () => {
    },
    updateBusinessDay: () => {
    },
    updateSchedule: () => {
    },

});

export default InfoContext;
