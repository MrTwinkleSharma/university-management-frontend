import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Drawer, Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from 'react-router-dom';
// Assuming dob is a string in the format 'YYYY-MM-DD'
const calculateAge = (dob) => {
    const currentDate = moment();
    const birthDate = moment(dob);
    const age = currentDate.diff(birthDate, 'years');
    return age;
};

const TABS = {
    STUDENT: 1,
    FACULTIES: 2,
    COURSES: 3,
    COLLECTION: 4,
    DEPARTMENT: 5,
}

function Dashboard() {
    const navigator = useNavigate();
    const [tab, setTab] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigator("/authenticate")
    }
    const handleTabSwitch = (tab) => {
        setTab(tab)
    }
    return (
        <div className="h-screen">
            <div className="grid grid-cols-5 gap-1">
                <div className="col-span-1">
                    <Paper className='h-full p-4' elevation={10}>
                        <div className="h-full grid grid-rows-6 gap-1">
                            <div className="row-span-1">
                                <Typography variant="h3" component="h2">
                                    Dashboard
                                </Typography>
                            </div>
                            <div className="row-span-4">
                                <div
                                    onClick={() => { handleTabSwitch(TABS.STUDENT) }}
                                    className='text-lg flex space-x-2 items-center hover:bg-blue-100 hover:rounded-md px-2 py-1 hover:cursor-pointer'
                                >
                                    <SchoolIcon />
                                    <p>Students</p>
                                </div>
                                <div
                                    onClick={() => { handleTabSwitch(TABS.FACULTIES) }}
                                    className='text-lg flex space-x-2 items-center hover:bg-blue-100 hover:rounded-md px-2 py-1 hover:cursor-pointer'
                                >
                                    <SupervisedUserCircleIcon />
                                    <p>Faculties</p>
                                </div>
                                <div
                                    onClick={() => { handleTabSwitch(TABS.COURSES) }}
                                    className='text-lg flex space-x-2 items-center hover:bg-blue-100 hover:rounded-md px-2 py-1 hover:cursor-pointer'
                                >
                                    <AutoStoriesIcon />
                                    <p>Courses</p>
                                </div>
                                <div
                                    onClick={() => { handleTabSwitch(TABS.DEPARTMENT) }}
                                    className='text-lg flex space-x-2 items-center hover:bg-blue-100 hover:rounded-md px-2 py-1 hover:cursor-pointer'
                                >
                                    <AccountBalanceIcon />
                                    <p>Department</p>
                                </div>
                                <div
                                    onClick={() => { handleTabSwitch(TABS.COLLECTION) }}
                                    className='text-lg flex space-x-2 items-center hover:bg-blue-100 hover:rounded-md px-2 py-1 hover:cursor-pointer'
                                >
                                    <CurrencyRupeeIcon />
                                    <p>Collection</p>
                                </div>
                            </div>
                            <div className="row-span-1 self-end">
                                <button
                                    className='flex space-x-2 border-2 rounded-lg px-2 py-1'
                                    type="button"
                                    onClick={handleLogout}
                                >
                                    <LogoutIcon htmlColor="#0A1599" />
                                    <p className='text-[#0A1599] text-md'> Logout </p>
                                </button>
                            </div>
                        </div>
                    </Paper>
                </div>
                <div className="col-span-4 h-screen">
                    {
                        tab === TABS.STUDENT ?
                            <Students />
                            : tab === TABS.FACULTIES ?
                                <Faculties /> :
                                tab === TABS.COURSES ?
                                    <Courses /> :
                                    tab === TABS.DEPARTMENT ?
                                        <Department /> :
                                        tab === TABS.COLLECTION ?
                                            <Collection /> :
                                            <div className='flex text-3xl w-full h-full'> <p className='m-auto'> Welcome to College Management System </p> </div>
                    }
                </div>
            </div>

        </div>
    );
}

function Students() {

    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formikInitialState, setFormikInitialState] = useState({
        studentID: '',
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
    })
    const [refetch, setRefetch] = useState(false);

    const handleEdit = (row) => {
        setIsUpdate(true);
        setIsFormOpen(true);
        setFormikInitialState({
            studentID: row.studentID || '',
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            dateOfBirth: row.dateOfBirth || '',
            courseName: row.courseName || '',
            mobileNumber: row.mobileNumber || '',
            emailID: row.emailID || '',
            address: row.address || '',
            joiningDate: row.joiningDate || '',
            admissionYear: row.admissionYear || '',
            feesCollected: row.feesCollected || '',
        });

    };

    const handleDelete = async (row) => {
        try {
            console.log("state ", row.studentID)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/students`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ studentID: row.studentID })
            });

            if (response.ok) {
                toast("Student Deleted Successfully")
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setRefetch(true);
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
                if (isUpdate) {
                    toast("Student Information Updated Successfully")
                } else {
                    toast("Student Added Successfully")
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
            }}>Add Students</Button>

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
                                    name='dateOfBirth'
                                    label="Date Of Birth"
                                    variant="outlined"
                                    type="date"
                                    fullWidth
                                    as={TextField}
                                    InputLabelProps={{ shrink: true }} />
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
                                    as={TextField} />
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
                            <Box mt={2}>
                                <Field
                                    name="address"
                                    label="Address"
                                    variant="outlined"
                                    fullWidth
                                    as={TextField} />
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
                                    as={TextField} />
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
                                    as={TextField} />
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
                                    as={TextField} />
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
        </Drawer></>
}

function Faculties() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [formikInitialState, setFormikInitialState] = useState({
        facultyID: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        departmentID: '',
        mobileNumber: '',
        emailID: '',
        address: '',
        joiningDate: '',
        specialization: '',
    })
    const [refetch, setRefetch] = useState(false);

    const handleEdit = (row) => {
        setIsUpdate(true);
        setIsFormOpen(true);
        setFormikInitialState({
            facultyID: row.facultyID || '',
            firstName: row.firstName || '',
            lastName: row.lastName || '',
            dateOfBirth: row.dateOfBirth || '',
            departmentID: row.departmentID || '',
            mobileNumber: row.mobileNumber || '',
            emailID: row.emailID || '',
            address: row.address || '',
            joiningDate: row.joiningDate || '',
            specialization: row.specialization || '',
        });

    };

    const handleDelete = async (row) => {
        try {
            console.log("state ", row.facultyID)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/faculties`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ facultyID: row.facultyID })
            });

            if (response.ok) {
                toast("Faculty Deleted Successfully")
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setRefetch(true);
    };

    const columns = [
        { field: 'facultyID', headerName: 'Faculty ID', width: 90 },
        { field: 'firstName', headerName: 'First name', width: 150 },
        { field: 'lastName', headerName: 'Last name', width: 150 },
        { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150 },
        {
            field: 'age', headerName: 'Age', width: 150,
            renderCell: (params) => calculateAge(params.row.dateOfBirth),
        },

        { field: 'departmentID', headerName: 'Department ID', width: 150 },
        { field: 'mobileNumber', headerName: 'Mobile Number', width: 150 },
        { field: 'emailID', headerName: 'Email ID', width: 200 },
        { field: 'address', headerName: 'Address', width: 200 },
        { field: 'joiningDate', headerName: 'Joining Date', width: 150 },
        { field: 'specialization', headerName: 'Specialization', width: 150 },
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
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/faculties`, {
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
        departmentID: Yup.string().required('Department Name is required'),
        mobileNumber: Yup.string().required('Mobile Number is required'),
        emailID: Yup.string().email('Invalid email address').required('Email ID is required'),
        address: Yup.string().required('Address is required'),
        joiningDate: Yup.date().required('Joining Date is required'),
        specialization: Yup.string().required('Specialization is required'),
    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            console.log("state ", values)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/faculties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                if (isUpdate) {
                    toast("Faculty Information Updated Successfully")
                } else {
                    toast("Faculty Added Successfully")
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
            }}>Add Faculty</Button>

            <Box sx={{ height: 400, overflowX: 'auto', width: "100%" }}>
                <DataGrid
                    getRowId={(row) => row.facultyID}
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
                                    name='dateOfBirth'
                                    label="Date Of Birth"
                                    variant="outlined"
                                    type="date"
                                    fullWidth
                                    as={TextField}
                                    InputLabelProps={{ shrink: true }} />
                                {errors.dateOfBirth && touched.dateOfBirth ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.dateOfBirth}</div>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Field
                                    name="departmentID"
                                    label="Department ID"
                                    variant="outlined"
                                    fullWidth
                                    as={TextField} />
                                {errors.departmentID && touched.departmentID ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.departmentID}</div>
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
                            <Box mt={2}>
                                <Field
                                    name="address"
                                    label="Address"
                                    variant="outlined"
                                    fullWidth
                                    as={TextField} />
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
                                    as={TextField} />
                                {errors.joiningDate && touched.joiningDate ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.joiningDate}</div>
                                ) : null}
                            </Box>
                            <Box mt={2}>
                                <Field
                                    name="specialization"
                                    label="Specialization"
                                    variant="outlined"
                                    fullWidth
                                    as={TextField} />
                                {errors.specialization && touched.specialization ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.specialization}</div>
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

function Courses() {

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

function Collection() {

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

function Department() {

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

export default Dashboard;