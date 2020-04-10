
export function setupAlgo(employees, position, operationHours) {

    console.log('start setupAlgo - - -');

    //initiate as an empty list
    let reqPos = [];
    let reqEmp = [];
    let tempEmpList = [];
    let setupList = [];
    let highLevel = [];
    let mediumLevel = [];
    let lowLevel = [];


    if (employees !== [] && position !== [] && operationHours !== []) {
        // Filter out any position or employee that is not required for this setup
        reqPos = position.filter( pos => pos.pos_required === true);
        reqEmp = employees.filter( emp => emp.emp_required === true );

        // Sort the positions in importance (most to least important) AND
        // Sort the employees in skill (most to least skill)
        reqPos.sort( (a,b) => ( b.pos_importance - a.pos_importance && b.pos_skill - a.pos_skill ));
        reqEmp.sort( (a,b) => ( b.emp_skill - a.emp_skill));

        for (let i = parseInt(operationHours[0].open_time); i < parseInt(operationHours[0].close_time); i++) {
            
            // create temporary deep copy of employee list
            tempEmpList = [...reqEmp];

            //filter for only employees working currently at this hour (i)
            // - 1) is the employees time within the hour of operations
            // - 2) if the employees time was never set and is at default (0), then it's time IS the full hour of operations
            // - 3) if the "in time" wasn't set (default at 0 aka begging of hour of operations), but the "out time" was
            // - 4) if the "in time" was set, but the "out time" wasn't (default at 0 aka end of hour of operations)
            tempEmpList = tempEmpList.filter(obj => {
                if ( (i >= parseInt(obj.in_time) && i <= parseInt(obj.out_time)) || (parseInt(obj.in_time)===0 && parseInt(obj.out_time) === 0) || 
                     (parseInt(obj.in_time) === 0 && i <= parseInt(obj.out_time)) || i >= (parseInt(obj.in_time) && parseInt(obj.out_time) === 0) )
                {
                    return true;
                }
                return false;
            });

            //filter for list of high level employees (7-10)
            highLevel = tempEmpList.filter(obj => {
                if (parseInt(obj.emp_skill) >= 70) {
                    return true;
                }
                return false;

            });
            //filter for list of medium level employees (4-6)
            mediumLevel = tempEmpList.filter(obj => {
                if (parseInt(obj.emp_skill) >= 40 && parseInt(obj.emp_skill) < 70 ) {
                    return true;
                }
                return false;

            });
            //filter for list of low level employes (1-3)
            lowLevel = tempEmpList.filter(obj => {
                if (parseInt(obj.emp_skill) >= 1 && parseInt(obj.emp_skill) < 40) {
                    return true;
                }
                return false;

            });
            
             //add empty list, which will represent the hour time, to the setupList... i - parseInt(operationHours[0].open_time) starts at 0 and iterates up
            setupList[i - parseInt(operationHours[0].open_time)] = [];

            //iterate through position
            reqPos.forEach(obj => {
                //if pos_skill needs high level AND there are high level employees:
                if (parseInt(obj.pos_importance) === 3 && highLevel.length > 0) {
                    //store in setupList. Take the name of the first person in the "highLevel" group bc it's been sorted so the best is at the top
                    setupList[i - parseInt(operationHours[0].open_time)].push({'emp': highLevel[0].emp_name, 'pos': obj.pos_name});
                    //delete from the employee list (temp list that is reacreated each hour):  delete the first employee bc that's who was taken
                    highLevel.splice(0,1);
                }
                //if pos_skill needs med level OR there are NO high level employees AND there are medium level employees:
                else if ((parseInt(obj.pos_importance) === 2 || highLevel.length === 0) && mediumLevel.length > 0) {
                    //iterate through med lvl employees and pick the best
                    if (mediumLevel.length>0) {
                        //store in setupList. Take the name of the first person in the "mediumLevel" group bc it's been sorted so the best is at the top
                        setupList[i - parseInt(operationHours[0].open_time)].push({'emp': mediumLevel[0].emp_name, 'pos': obj.pos_name});
                        //delete from the employee list (temp list that is reacreated each hour):  delete the first employee bc that's who was taken
                        mediumLevel.splice(0,1);
                    }

                }
                //if pos_skill needs med level OR there are NO high level employees OR there are NO medium level employees AND there are low level employees::
                else if ((parseInt(obj.pos_importance) === 1 || highLevel.length === 0 || mediumLevel.length === 0) && lowLevel.length > 0) {
                    //iterate through low lvl employees and pick the best
                    if (lowLevel.length>0) {
                        //store in setupList. Take the name of the first person in the "lowLevel" group bc it's been sorted so the best is at the top
                        setupList[i - parseInt(operationHours[0].open_time)].push({'emp': lowLevel[0].emp_name, 'pos': obj.pos_name});
                        //delete from the employee list (temp list that is reacreated each hour):  delete the first employee bc that's who was taken
                        lowLevel.splice(0,1);
                    }
                }   
            });
        }

        return setupList;
    }

}
            