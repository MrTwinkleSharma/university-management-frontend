
import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Drawer, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import moment from 'moment';

export default function Collection() {

    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formikInitialState, setFormikInitialState] = useState({
        collectionID: '',
        studentID: '',
        timestamp: '',
        amount: '',
        comment: '',
    })
    const [refetch, setRefetch] = useState(false);

    const handleEdit = (row) => {
        setIsUpdate(true);
        setIsFormOpen(true);
        setFormikInitialState({
            collectionID: row.collectionID || '',
            studentID: row.studentID || '',
            timestamp: row.timestamp || '',
            amount: row.amount || '',
            comment: row.comment || '',
        });

    };

    const handleDelete = async (row) => {
        try {
            console.log("state ", row.collectionID)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/collections`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ collectionID: row.collectionID })
            });

            if (response.ok) {
                toast("Collection Deleted Successfully")
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setRefetch(true);
    };

    const columns = [
        { field: 'collectionID', headerName: 'Collection ID', width: 150 },
        { field: 'studentID', headerName: 'Student ID', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 150,
        renderCell: (params) => `${params.row.amount} INR`

         },
        { field: 'comment', headerName: 'Comment', width: 150 },
        { field: 'timestamp', headerName: 'Timestamp', width: 150 },
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
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/collections`, {
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
        studentID: Yup.string().required('Student ID is required'),
        amount: Yup.number().required('Amount is required'),
    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("state ", values)
            values.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/collections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                if (isUpdate) {
                    toast("Collection Information Updated Successfully")
                } else {
                    toast("Collection Added Successfully")
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
            }}>Add Collection</Button>

            <Box sx={{ height: 400, overflowX: 'auto', width: "100%" }}>
                <DataGrid
                    getRowId={(row) => row.studentID}
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
                                    name="studentID"
                                    label="Student ID"
                                    variant="outlined"
                                    as={TextField}
                                    fullWidth />
                                {errors.studentID && touched.studentID ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.studentID}</div>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Field
                                    name="comment"
                                    label="Comment"
                                    variant="outlined"
                                    as={TextField}
                                    fullWidth />
                                {errors.comment && touched.comment ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.comment}</div>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Field
                                    name="amount"
                                    label="Amount"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    as={TextField} />
                                {errors.amount && touched.amount ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.amount}</div>
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