import { TextField, Box, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const MODE = {
    LOGIN: 0,
    SIGNUP: 1,
    RESET_PASSWORD: 2,
}
function Login({ handleModeChange }) {
    const navigator = useNavigate();

    const handleLoginSubmit = async (values, { setSubmitting }) => {
        console.log("values ", values);
        // Send data to backend (replace this with your actual API call)
        try {
            // Example of sending data to backend using fetch
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/authenticate/login`,
                values,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("response ", response);
            const { data } = response;
            if (data.success) {
                const { token } = data;

                // Save token to localStorage
                localStorage.setItem('token', token);
                navigator("/dashboard")
                toast("Logged In Succesfully")
            } else {
                toast(data.message)
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setSubmitting(false);
    };

    const loginValidationSchema = Yup.object().shape({
        emailID: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required')
    });
    return <div className='bg-white rounded-xl drop-shadow-2xl shadow-2xl m-auto  w-[35%] p-16'>
        <Typography variant="h3" component="h2" className=''>
            Login
        </Typography>
        <Formik
            initialValues={{
                emailID: '',
                password: '',
            }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLoginSubmit}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <Box className='my-10'>
                        <Field
                            className='w-full'
                            name="emailID"
                            type="email"
                            as={TextField}
                            label="Email"
                            variant="standard"
                        />
                        {errors.emailID && touched.emailID ? (
                            <div className='text-red-700 text-[13px] ml-1'>{errors.emailID}</div>
                        ) : null}
                    </Box>
                    <Box className='mb-32'>
                        <Field
                            className='w-full'
                            name="password"
                            type="password"
                            as={TextField}
                            label="Password"
                            variant="standard"
                        />
                        {errors.password && touched.password ? (
                            <div className='text-red-700 text-[13px] ml-1'>{errors.password}</div>
                        ) : null}
                    </Box>

                    <div className='mb-10'>
                        <div >
                            Forgot Password? <span className='underline text-blue-600 cursor-pointer' onClick={() => { handleModeChange(MODE.RESET_PASSWORD) }} > Click to Reset </span>
                        </div>
                        <div>
                            Don't have an account? <span className='underline text-blue-600 cursor-pointer' onClick={() => { handleModeChange(MODE.SIGNUP) }}> Click to Sign Up </span>
                        </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} variant='contained'>Submit</Button>
                </Form>
            )}
        </Formik>
    </div>
}
function Signup({ handleModeChange }) {
    const signupValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        mobileNumber: Yup.number()
            .typeError("That doesn't look like a phone number")
            .positive("A phone number can't start with a minus")
            .integer("A phone number can't include a decimal point")
            .required('A phone number is required'),
        emailID: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const handleSignupSubmit = async (values, { setSubmitting }) => {
        console.log("values ", values);
        // Send data to backend (replace this with your actual API call)
        try {
            // Example of sending data to backend using fetch
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authenticate/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                if (!responseData.success) {
                    return toast(responseData.message)
                }
                toast("Signed Up Successfully! Redirecting to Login in 3 Seconds...")
                setTimeout(() => {
                    handleModeChange(MODE.LOGIN)
                }, 3000)
                console.log('Signup successful');
            } else {
                // Handle error response
                console.error('Signup failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setSubmitting(false);
    };

    return <div className='bg-white rounded-xl drop-shadow-2xl shadow-2xl m-auto  w-[35%] p-16'>
        <Typography variant="h3" component="h2" className=''>
            Sign Up
        </Typography>
        <Formik
            initialValues={{
                emailID: '',
                password: '',
                firstName: '',
                lastName: '',
                mobileNumber: '',
            }}
            validationSchema={signupValidationSchema}
            onSubmit={handleSignupSubmit}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <Box className='my-10'>
                        <Field
                            className='w-full'
                            name="firstName"
                            type="text"
                            as={TextField}
                            label="First Name"
                            variant="standard"
                        />
                        {errors.firstName && touched.firstName ? (
                            <div className='text-red-700 text-[13px] ml-1'>{errors.firstName}</div>
                        ) : null}
                    </Box>
                    <Box className='my-10'>
                        <Field
                            className='w-full'
                            name="lastName"
                            type="text"
                            as={TextField}
                            label="Last Name"
                            variant="standard"
                        />
                        {errors.lastName && touched.lastName ? (
                            <div className='text-red-700 text-[13px] ml-1'>{errors.lastName}</div>
                        ) : null}
                    </Box>
                    <Box className='my-10'>
                        <Field
                            className='w-full'
                            name="emailID"
                            type="email"
                            as={TextField}
                            label="Email"
                            variant="standard"
                        />
                        {errors.emailID && touched.emailID ? (
                            <div className='text-red-700 text-[13px] ml-1'>{errors.emailID}</div>
                        ) : null}
                    </Box>

                    <Box className='my-10'>
                        <Field
                            className='w-full'
                            name="mobileNumber"
                            type="text"
                            as={TextField}
                            label="Mobile Number"
                            variant="standard"
                        />
                        {errors.mobileNumber && touched.mobileNumber ? (
                            <div className='text-red-700 text-[13px] ml-1'>{errors.mobileNumber}</div>
                        ) : null}
                    </Box>
                    <Box className='mb-32'>
                        <Field
                            className='w-full'
                            name="password"
                            type="password"
                            as={TextField}
                            label="Password"
                            variant="standard"
                        />
                        {errors.password && touched.password ? (
                            <div className='text-red-700 text-[13px] ml-1'>{errors.password}</div>
                        ) : null}
                    </Box>

                    <div className='mb-10'>
                        <div>
                            Go back to Login? <span className='underline text-blue-600 cursor-pointer' onClick={() => { handleModeChange(MODE.LOGIN) }}> Click to Login </span>
                        </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} variant='contained'>Submit</Button>
                </Form>
            )}
        </Formik>
    </div>
}

function ResetPassword({ handleModeChange }) {
    const [verified, setVerified] = useState(false);
    const resetPasswordValidationSchema = Yup.object().shape({
        emailID: Yup.string().email('Invalid email address').required('Email is required'),
    });
    const handleResetPasswordVerifySubmit = async (values, { setSubmitting }) => {
        console.log("values ", values);
        // Send data to backend (replace this with your actual API call)
        try {
            // Example of sending data to backend using fetch
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authenticate/verifyEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            const responseData = await response.json();
            if (response.ok) {
                if (responseData.success) {
                    setVerified(true);
                    toast("Email Verified! Enter New Password");
                    console.log('Verify Email successful');
                } else {
                    toast("Email Does not Exist");
                }
            } else {
                // Handle error response
                toast("Internal Server Error");
                console.error('Verify Password failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setSubmitting(false);
    };
    const handleResetPasswordSubmit = async (values, { setSubmitting }) => {
        console.log("values ", values);
        // Send data to backend (replace this with your actual API call)
        try {
            // Example of sending data to backend using fetch
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authenticate/resetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            if (response.ok) {
                toast("Password Reset Successfully! Redirecting to Login in 3 Seconds...")
                setTimeout(() => {
                    handleModeChange(MODE.LOGIN)
                }, 3000)
            } else {
                // Handle error response
                toast("Internal Server Error");
                console.error('Verify Password failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setSubmitting(false);
    };
    return <div className='bg-white rounded-xl drop-shadow-2xl shadow-2xl m-auto  w-[35%] p-16'>
        <Typography variant="h3" component="h2" className=''>
            Reset Password
        </Typography>
        <Formik
            initialValues={{
                emailID: '',
            }}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={(values, object) => { verified ? handleResetPasswordSubmit(values, object) : handleResetPasswordVerifySubmit(values, object) }}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <Box className='my-10'>
                        <Field
                            className='w-full'
                            name="emailID"
                            type="email"
                            as={TextField}
                            label="Email"
                            variant="standard"
                        />
                        {errors.emailID && touched.emailID ? (
                            <div className='text-red-700 text-[13px] ml-1'>{errors.emailID}</div>
                        ) : null}
                    </Box>
                    {
                        verified ?
                            <Box className='mb-32'>
                                <Field
                                    className='w-full'
                                    name="password"
                                    type="password"
                                    as={TextField}
                                    label="New Password"
                                    variant="standard"
                                />
                                {errors.password && touched.password ? (
                                    <div className='text-red-700 text-[13px] ml-1'>{errors.password}</div>
                                ) : null}
                            </Box>
                            : null
                    }
                    <div className='mb-10'>
                        <div>
                            Go back to Login? <span className='underline text-blue-600 cursor-pointer' onClick={() => { handleModeChange(MODE.LOGIN) }}> Click to Login </span>
                        </div>
                        <div>
                            Don't have an account? <span className='underline text-blue-600 cursor-pointer' onClick={() => { handleModeChange(MODE.SIGNUP) }}> Click to Sign Up </span>
                        </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} variant='contained'>{verified ? "Reset Password" : "Verify Email"}</Button>
                </Form>
            )}
        </Formik>
    </div>
}

function Authenticate() {
    const [mode, setMode] = useState(MODE.LOGIN);
    const handleModeChange = (newMode) => {
        setMode(newMode);
    };
    return (
        <div className="h-screen bg-cover bg-[url('college_building.jpg')]" >
            <div className='flex flex-col items-center justify-center h-full'>
                {
                    mode === MODE.LOGIN ?
                        <Login
                            handleModeChange={handleModeChange}
                        />
                        : mode === MODE.SIGNUP ?
                            <Signup
                                handleModeChange={handleModeChange}
                            />
                            : mode === MODE.RESET_PASSWORD ?
                                <ResetPassword
                                    handleModeChange={handleModeChange}
                                />
                                : null
                }
            </div>
        </div>
    );
}

export default Authenticate;
