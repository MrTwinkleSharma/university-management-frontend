import './App.css';
import ErrorPage from './error-page';
import About from './pages/about';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Login from './pages/login';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import moment from 'moment';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,

  },
  {
    path: '/authenticate',
    element: <Login />,
    errorElement: <ErrorPage />,

  },
  {
    path: '/home',
    element: <Home />,
    errorElement: <ErrorPage />,

  },
  {
    path: "/about",
    element: <About />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  }

])
function App() {
  return (<>
    <ToastContainer
      position='bottom-right'
    />
    <RouterProvider router={router} />
  </>

  );
}

export default App;
