import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Drawer, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';


export default function Admins() {
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formikInitialState, setFormikInitialState] = useState({
        adminID: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        emailID: '',
        password: '',
    })
    const [refetch, setRefetch] = useState(false);

    const handleEdit = (row) => {
        setIsUpdate(true);
        setIsFormOpen(true);
        setFormikInitialState({
            adminID: row.adminID || '',
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            mobileNumber: row.mobileNumber || '',
            emailID: row.emailID || '',
        });

    };

    const handleDelete = async (row) => {
        try {
            console.log("state ", row.adminID)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admins`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ adminID: row.adminID })
            });

            if (response.ok) {
                toast("Admin Deleted Successfully")
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setRefetch(true);
    };

    const columns = [
        { field: 'adminID', headerName: 'Admin ID', width: 90 },
        { field: 'firstName', headerName: 'First name', width: 150 },
        { field: 'lastName', headerName: 'Last name', width: 150 },
        { field: 'mobileNumber', headerName: 'Mobile Number', width: 150 },
        { field: 'emailID', headerName: 'Email ID', width: 200 },
        {
            field: 'edit',
            headerName: 'Action',
            width: 90,
            sortable: false,
            renderCell: (params) => (
                <div className='space-x-4'>
                    <button
                        type="button"
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditIcon htmlColor="#0A1599" />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleDelete(params.row)}
                    >
                        <DeleteIcon htmlColor="#cc0000" />
                    </button>

                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admins`, {
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

    const insertValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        mobileNumber: Yup.string().required('Mobile Number is required'),
        emailID: Yup.string().email('Invalid email address').required('Email ID is required'),
        password:  Yup.string().required('Password is required')  
    });

    const updateValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        mobileNumber: Yup.string().required('Mobile Number is required'),
        emailID: Yup.string().email('Invalid email address').required('Email ID is required'),
    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("state ", values)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                if (isUpdate) {
                    toast("Admin Information Updated Successfully")
                } else {
                    toast("Admin Added Successfully")
                }
                setRefetch(true);
                setIsUpdate(false);
                setSubmitting(false);
                setIsFormOpen(false);
            } else {
                console.error('Add/Update failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return <><div className='h-full'>
        <div className='px-6 py-4'>

            <Button onClick={() => {
                setIsUpdate(false)
                setIsFormOpen(true);
                setFormikInitialState({
                    adminID: '',
                    firstName: '',
                    lastName: '',
                    mobileNumber: '',
                    emailID: '',
                    password: '',
                })
            }}>Add Admins</Button>

            <Box sx={{ height: 400, overflowX: 'auto', width: "100%" }}>
                <DataGrid
                    getRowId={(row) => row.adminID}
                    loading={isLoading}
                    rows={data}
                    columns={columns}
                    pageSize={5}
                    disableRowSelectionOnClick />
            </Box>
        </div>
    </div> <Drawer width="50%" anchor="right" open={isFormOpen} onClose={() => { setIsFormOpen(false); }}>
            <Box p={2}>
                <Typography variant="h5" component="h3">
                    Fill Form
                </Typography>
                <Formik
                    initialValues={formikInitialState}
                    validationSchema={isUpdate ? updateValidationSchema : insertValidationSchema}
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
                                    fullWidth />
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
                                    as={TextField} />
                                {errors.lastName && touched.lastName ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.lastName}</div>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Field
                                    name="mobileNumber"
                                    label="Mobile Number"
                                    variant="outlined"
                                    fullWidth
                                    as={TextField} />
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
                                    as={TextField} />
                                {errors.emailID && touched.emailID ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.emailID}</div>
                                ) : null}
                            </Box>

                            {
                                !isUpdate ? <Box mt={2}>
                                    <Field
                                        name="password"
                                        label="Password"
                                        variant="outlined"
                                        fullWidth
                                        as={TextField} />
                                    {errors.password && touched.password ? (
                                        <div className='text-red-700 text-[13px] ml-1'>{errors.password}</div>
                                    ) : null}
                                </Box> : null
                            }

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
        </Drawer></>
}