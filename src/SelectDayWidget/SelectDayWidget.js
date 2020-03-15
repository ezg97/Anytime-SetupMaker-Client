import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import './SelectDayWidget.css';

const { operationHours } = require('../OperationHours');

class SelectDayWidget extends React.Component{ 

    render(){
        {/* ---------------------------------------------------------
                Not working for some reason, refer to "HoursPage.js"
            --------------------------------------------------------- */}

        return(
        <div>
             {/* List of choices */}
             <select id='select-day'>
                <option value="None">None</option>
                {operationHours.map(businessDay => 
                    /* This is for demonstration purposes only. In production I would make
                        the "None" option the selected choice */
                    (businessDay.day === "Sunday")
                    ?<option value={businessDay.day} selected>{businessDay.day}</option>
                    :<option value={businessDay.day}>{businessDay.day}</option>
                )}
            </select>

        </div>
        );
    }
}

export default SelectDayWidget;