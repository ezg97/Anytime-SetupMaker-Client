//cut out the last 12AM because you can't start when the day just ends
const hoursAM = [
    { 
        time: '12AM',
        id: 0
    },
    { 
        time: "1AM",
        id: 1
    },
    { 
        time: '2AM',
        id: 2
    },
    {  
        time: '3AM',
        id: 3
    },
    { 
        time: '4AM',
        id: 4
    },
    { 
        time: '5AM',
        id: 5
    },
    { 
        time: '6AM',
        id: 6
    },
    { 
        time: '7AM',
        id: 7
    },
    { 
        time: "8AM",
        id: 8
    },
    { 
        time: '9AM',
        id: 9
    },
    {  
        time: '10AM',
        id: 10
    },
    { 
        time: '11AM',
        id: 11
    },
    { 
        time: '12PM',
        id: 12
    },
    { 
        time: '1PM',
        id: 13
    },
    { 
        time: '2PM',
        id: 14
    },
    { 
        time: "3PM",
        id: 15
    },
    { 
        time: '4PM',
        id: 16
    },
    {  
        time: '5PM',
        id: 17
    },
    { 
        time: '6PM',
        id: 18
    },
    { 
        time: '7PM',
        id: 19
    },
    { 
        time: '8PM',
        id: 20
    },
    { 
        time: '9PM',
        id: 21
    },
    { 
        time: "10PM",
        id: 22
    },
    { 
        time: '11PM',
        id: 23
    },
]

//cut out the first 12AM because you can't close before you can even open
const hoursPM = [
    { 
        time: "1AM",
        id: 1
    },
    { 
        time: '2AM',
        id: 2
    },
    {  
        time: '3AM',
        id: 3
    },
    { 
        time: '4AM',
        id: 4
    },
    { 
        time: '5AM',
        id: 5
    },
    { 
        time: '6AM',
        id: 6
    },
    { 
        time: '7AM',
        id: 7
    },
    { 
        time: "8AM",
        id: 8
    },
    { 
        time: '9AM',
        id: 9
    },
    {  
        time: '10AM',
        id: 10
    },
    { 
        time: '11AM',
        id: 11
    },
    { 
        time: '12PM',
        id: 12
    },
    { 
        time: '1PM',
        id: 13
    },
    { 
        time: '2PM',
        id: 14
    },
    { 
        time: "3PM",
        id: 15
    },
    { 
        time: '4PM',
        id: 16
    },
    {  
        time: '5PM',
        id: 17
    },
    { 
        time: '6PM',
        id: 18
    },
    { 
        time: '7PM',
        id: 19
    },
    { 
        time: '8PM',
        id: 20
    },
    { 
        time: '9PM',
        id: 21
    },
    { 
        time: "10PM",
        id: 22
    },
    { 
        time: '11PM',
        id: 23
    },
    { 
        time: '12AM',
        id: 24
    },
]

const hours = [
    { 
        time: '12AM',
        id: 0
    },
    { 
        time: "1AM",
        id: 1
    },
    { 
        time: '2AM',
        id: 2
    },
    {  
        time: '3AM',
        id: 3
    },
    { 
        time: '4AM',
        id: 4
    },
    { 
        time: '5AM',
        id: 5
    },
    { 
        time: '6AM',
        id: 6
    },
    { 
        time: '7AM',
        id: 7
    },
    { 
        time: "8AM",
        id: 8
    },
    { 
        time: '9AM',
        id: 9
    },
    {  
        time: '10AM',
        id: 10
    },
    { 
        time: '11AM',
        id: 11
    },
    { 
        time: '12PM',
        id: 12
    },
    { 
        time: '1PM',
        id: 13
    },
    { 
        time: '2PM',
        id: 14
    },
    { 
        time: "3PM",
        id: 15
    },
    { 
        time: '4PM',
        id: 16
    },
    {  
        time: '5PM',
        id: 17
    },
    { 
        time: '6PM',
        id: 18
    },
    { 
        time: '7PM',
        id: 19
    },
    { 
        time: '8PM',
        id: 20
    },
    { 
        time: '9PM',
        id: 21
    },
    { 
        time: "10PM",
        id: 22
    },
    { 
        time: '11PM',
        id: 23
    },
    { 
        time: '12AM',
        id: 24
    },
]

module.exports = { hoursAM, hoursPM, hours }