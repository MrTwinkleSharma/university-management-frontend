import { TextField, Box, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";

function Login() {
    const initialValues = {
        email: '',
        password: ''
    };
    const navigator = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log("values ", values);
        // Send data to backend (replace this with your actual API call)
        try {
            // Example of sending data to backend using fetch
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                const data = await response.json();
                const { token } = data;

                // Save token to localStorage
                localStorage.setItem('token', token);
                navigator("/dashboard")
                // Redirect or navigate to another page if needed
                console.log('Login successful');
            } else {
                // Handle error response
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    return (
        <div className="h-screen bg-cover bg-[url('college_building.jpg')]" >
            <div className='flex flex-col items-center justify-center h-full'>
                <div className='bg-white rounded-xl drop-shadow-2xl shadow-2xl m-auto h-[55%] w-[35%] p-16'>
                    <Typography variant="h3" component="h2" className=''>
                        Login
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <Box className='my-10'>
                                    <Field className='w-full' name="email" type="email" as={TextField} label="Email" variant="standard" />
                                </Box>
                                <Box className='mb-32'>
                                    <Field className='w-full' name="password" type="password" as={TextField} label="Password" variant="standard" />
                                </Box>
                                <Button type="submit" disabled={isSubmitting} variant='contained'>Submit</Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default Login;
