import * as React from 'react';
import { useState } from 'react';
import {  Typography, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from 'react-router-dom';
import Students from '../components/students';
import Faculties from '../components/faculties';
import Courses from '../components/courses';
import Collection from '../components/collections';
import Department from '../components/departments';

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




export default Dashboard;