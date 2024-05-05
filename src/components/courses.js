

import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Drawer, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

export default function Courses() {

    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formikInitialState, setFormikInitialState] = useState({
        courseID: '',
        courseName: '',
        courseDuration: '',
        courseFees: '',
    })
    const [refetch, setRefetch] = useState(false);

    const handleEdit = (row) => {
        setIsUpdate(true);
        setIsFormOpen(true);
        setFormikInitialState({
            courseID: row.courseID || '',
            courseName: row.courseName || '',
            courseDuration: row.courseDuration || '',
            courseFees: row.courseFees || '',
        });

    };

    const handleDelete = async (row) => {
        try {
            console.log("state ", row.courseID)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ courseID: row.courseID })
            });

            if (response.ok) {
                toast("Course Deleted Successfully")
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setRefetch(true);
    };

    const columns = [
        { field: 'courseID', headerName: 'Course ID', width: 90 },
        { field: 'courseName', headerName: 'Course name', width: 150 },
        {
            field: 'courseDuration', headerName: 'Course Duration', width: 150,
            renderCell: (params) => `${params.row.courseDuration} Years`
        },
        {
            field: 'courseFees', headerName: 'Course Fees', width: 150,
            renderCell: (params) => `${params.row.courseFees} INR`

        },
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
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses`, {
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
        courseName: Yup.string().required('Course Name is required'),
        courseDuration: Yup.string().required('Course Duration is required'),
        courseFees: Yup.number().required('Course Fees is required'),
    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("state ", values)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                if (isUpdate) {
                    toast("Course Information Updated Successfully")
                } else {
                    toast("Course Added Successfully")
                }
            } else {
                console.error('Add/Update failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setRefetch(true);
        setIsUpdate(false);
        setSubmitting(false);
        setIsFormOpen(false);
    };
    return <><div className='h-full'>
        <div className='px-6 py-4'>

            <Button onClick={() => {

                setIsFormOpen(true);
            }}>Add Courses</Button>

            <Box sx={{ height: 400, overflowX: 'auto', width: "100%" }}>
                <DataGrid
                    getRowId={(row) => row.courseID}
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
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Box mt={2}>
                                <Field
                                    name="courseName"
                                    label="Course Name"
                                    variant="outlined"
                                    as={TextField}
                                    fullWidth />
                                {errors.courseName && touched.courseName ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.courseName}</div>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Field
                                    name="courseDuration"
                                    label="Course Duration"
                                    variant="outlined"
                                    fullWidth
                                    as={TextField} />
                                {errors.courseDuration && touched.courseDuration ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.courseDuration}</div>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Field
                                    name='courseFees'
                                    label="Course Fees"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    as={TextField}
                                />
                                {errors.courseFees && touched.courseFees ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.courseFees}</div>
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
        </Drawer></>
}