import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Drawer, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';


export default function Department() {

    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formikInitialState, setFormikInitialState] = useState({
        departmentID: '',
        departmentName: '',
        headOfDepartment: '',
    })
    const [refetch, setRefetch] = useState(false);

    const handleEdit = (row) => {
        setIsUpdate(true);
        setIsFormOpen(true);
        setFormikInitialState({
            departmentID: row.departmentID || '',
            departmentName: row.departmentName || '',
            headOfDepartment: row.headOfDepartment || '',
        });

    };

    const handleDelete = async (row) => {
        try {
            console.log("state ", row.departmentID)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/departments`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ departmentID: row.departmentID })
            });

            if (response.ok) {
                toast("Department Deleted Successfully")
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setRefetch(true);
    };

    const columns = [
        { field: 'departmentID', headerName: 'Department ID', width: 150 },
        { field: 'departmentName', headerName: 'Department Name', width: 150 },
        { field: 'headOfDepartment', headerName: 'Head of Department', width: 150 },
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
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/departments`, {
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
        departmentName: Yup.string().required('Department Name is required'),
        headOfDepartment: Yup.string().required('Head of Department is required'),
    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("state ", values)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/departments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                if (isUpdate) {
                    toast("Department Information Updated Successfully")
                } else {
                    toast("Department Added Successfully")
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
            }}>Add Department</Button>

            <Box sx={{ height: 400, overflowX: 'auto', width: "100%" }}>
                <DataGrid
                    getRowId={(row) => row.departmentID}
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
                    {({ errors, touched, isSubmitting, setFormikState }) => (
                        <Form>
                            <Box mt={2}>
                                <Field
                                    name="departmentName"
                                    label="Department Name"
                                    variant="outlined"
                                    as={TextField}
                                    fullWidth />
                                {errors.departmentName && touched.departmentName ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.departmentName}</div>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Field
                                    name="headOfDepartment"
                                    label="Head Of Department"
                                    variant="outlined"
                                    fullWidth
                                    as={TextField} />
                                {errors.headOfDepartment && touched.headOfDepartment ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.headOfDepartment}</div>
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