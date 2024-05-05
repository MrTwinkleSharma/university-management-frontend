import moment from "moment";


// Assuming dob is a string in the format 'YYYY-MM-DD'
const calculateAge = (dob) => {
    const currentDate = moment();
    const birthDate = moment(dob);
    const age = currentDate.diff(birthDate, 'years');
    return age;
};


export { calculateAge };