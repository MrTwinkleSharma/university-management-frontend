import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Drawer, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

// Assuming dob is a string in the format 'YYYY-MM-DD'
const calculateAge = (dob) => {
    const currentDate = moment();
    const birthDate = moment(dob);
    const age = currentDate.diff(birthDate, 'years');
    return age;
};

function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const [initialFormValues, setInitialFormValues] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        courseName: '',
        mobileNumber: '',
        emailID: '',
        address: '',
        joiningDate: '',
        admissionYear: '',
        feesCollected: '',
    });
    const [refetch, setRefetch] = useState(false);

    const handleEdit = (row) => {
        setIsUpdate(true);
        setInitialFormValues(row);
        setIsFormOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInitialFormValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const columns = [
        { field: 'studentID', headerName: 'Student ID', width: 90 },
        { field: 'firstName', headerName: 'First name', width: 150 },
        { field: 'lastName', headerName: 'Last name', width: 150 },
        { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150 },
        {
            field: 'age', headerName: 'Age', width: 150,
            renderCell: (params) => calculateAge(params.row.dateOfBirth),
        },

        { field: 'courseName', headerName: 'Course Name', width: 150 },
        { field: 'mobileNumber', headerName: 'Mobile Number', width: 150 },
        { field: 'emailID', headerName: 'Email ID', width: 200 },
        { field: 'address', headerName: 'Address', width: 200 },
        { field: 'joiningDate', headerName: 'Joining Date', width: 150 },
        { field: 'admissionYear', headerName: 'Admission Year', width: 150 },
        { field: 'feesCollected', headerName: 'Fees Collected', width: 150 },
        {
            field: 'edit',
            headerName: 'Action',
            width: 90,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    onClick={() => handleEdit(params.row)}
                >
                    Edit
                </Button>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/students`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const responseData = await response.json();
                setData(responseData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }

            setRefetch(false);
        };

        fetchData();
    }, [refetch]);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        dateOfBirth: Yup.date().required('Date of Birth is required'),
        courseName: Yup.string().required('Course Name is required'),
        mobileNumber: Yup.string().required('Mobile Number is required'),
        emailID: Yup.string().email('Invalid email address').required('Email ID is required'),
        address: Yup.string().required('Address is required'),
        joiningDate: Yup.date().required('Joining Date is required'),
        admissionYear: Yup.date().required('Admission Year is required'),
        feesCollected: Yup.number().required('Fees Collected is required').positive('Fees Collected must be positive').min(100, "Fees Collected should be minimum 100").max(1000000, "Fees Collected should not exceed 1000000"),
     });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("state ", values)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                console.log('Add successful');
            } else {
                console.error('Add failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setRefetch(true);
        setIsUpdate(false);
        setInitialFormValues({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            courseName: '',
            mobileNumber: '',
            emailID: '',
            address: '',
            joiningDate: '',
            admissionYear: '',
            feesCollected: '',
        });
        setSubmitting(false);
        setIsFormOpen(false);
    };

    return (
        <div className="h-screen bg-cover bg-[url('college_building.jpg')]">
            <div className='h-full'>
                <div className='bg-white rounded-xl drop-shadow-2xl shadow-2xl m-auto p-16'>
                    <Typography variant="h3" component="h2">
                        Dashboard
                    </Typography>
                    <Button onClick={() => {
                        setInitialFormValues({
                            firstName: '',
                            lastName: '',
                            dateOfBirth: '',
                            courseName: '',
                            mobileNumber: '',
                            emailID: '',
                            address: '',
                            joiningDate: '',
                            admissionYear: '',
                            feesCollected: '',
                        });
                        setIsFormOpen(true)
                    }}>Add Students</Button>

                    <Box sx={{ height: 400, overflowX: 'auto', width: "100%" }}>
                        <DataGrid
                            getRowId={(row) => row.studentID}
                            loading={isLoading}
                            rows={data}
                            columns={columns}
                            pageSize={5}
                            disableRowSelectionOnClick
                        />
                    </Box>
                </div>
            </div>

            <Drawer  width="50%" anchor="right" open={isFormOpen} onClose={() => { setIsFormOpen(false) }}>
                <Box p={2}>
                    <Typography variant="h5" component="h3">
                        Fill Form
                    </Typography>
                    <Formik
                        initialValues={initialFormValues}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <Box mt={2}>
                                    <Field
                                        name="firstName"
                                        label="First Name"
                                        variant="outlined"
                                        as={TextField}
                                        fullWidth
                                        value={initialFormValues.firstName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.firstName && touched.firstName ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.firstName}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name="lastName"
                                        label="Last Name"
                                        variant="outlined"
                                        fullWidth
                                        as={TextField}
                                        value={initialFormValues.lastName}
                                        onChange={handleInputChange}
                                    />
                                        {errors.lastName && touched.lastName ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.lastName}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name='dateOfBirth'
                                        label="Date Of Birth"
                                        variant="outlined"
                                        type="date"
                                        fullWidth
                                        as={TextField}
                                        InputLabelProps={{ shrink: true }}
                                        value={initialFormValues.dateOfBirth}
                                        onChange={handleInputChange}
                                    />
                                          {errors.dateOfBirth && touched.dateOfBirth ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.dateOfBirth}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name="courseName"
                                        label="Course Name"
                                        variant="outlined"
                                        fullWidth
                                        as={TextField}
                                        value={initialFormValues.courseName}
                                        onChange={handleInputChange}
                                    />
                                         {errors.courseName && touched.courseName ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.courseName}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name="mobileNumber"
                                        label="Mobile Number"
                                        variant="outlined"
                                        fullWidth
                                        as={TextField}
                                        value={initialFormValues.mobileNumber}
                                        onChange={handleInputChange}
                                    />
                                        {errors.mobileNumber && touched.mobileNumber ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.mobileNumber}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name="emailID"
                                        label="Email ID"
                                        variant="outlined"
                                        fullWidth
                                        as={TextField}
                                        value={initialFormValues.emailID}
                                        onChange={handleInputChange}
                                    />
                                        {errors.emailID && touched.emailID ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.emailID}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name="address"
                                        label="Address"
                                        variant="outlined"
                                        fullWidth
                                        as={TextField}
                                        value={initialFormValues.address}
                                        onChange={handleInputChange}
                                    />
                                     {errors.address && touched.address ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.address}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name="joiningDate"
                                        type="date"
                                        label="Joining Date"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        as={TextField}
                                        value={initialFormValues.joiningDate}
                                        onChange={handleInputChange}
                                    />
                                      {errors.joiningDate && touched.joiningDate ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.joiningDate}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name="admissionYear"
                                        type="date"
                                        label="Admission Year"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        as={TextField}
                                        value={initialFormValues.admissionYear}
                                        onChange={handleInputChange}
                                    />
                                       {errors.admissionYear && touched.admissionYear ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.admissionYear}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Field
                                        name="feesCollected"
                                        type="number"
                                        label="Fees Collected"
                                        variant="outlined"
                                        fullWidth
                                        as={TextField}
                                        value={initialFormValues.feesCollected}
                                        onChange={handleInputChange}
                                    />
                                       {errors.feesCollected && touched.feesCollected ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.feesCollected}</div>
                                    ) : null}
                                </Box>
                                <Box mt={2}>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        variant="contained"
                                        color="primary"
                                    >
                                        {isUpdate ? 'Update' : 'Add'}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Drawer>
        </div>
    );
}

export default Dashboard;
