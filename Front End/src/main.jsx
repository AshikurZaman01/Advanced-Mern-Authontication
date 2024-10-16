import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Roots from './Components/Roots/Roots';
import Home from './Components/Home/Home';
import Register from './Components/Register/Register';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { Toaster } from 'react-hot-toast';
import Login from './Components/Login/Login';
import VerifyOTP from './Components/Register/VerifyOTP';
import ResendOTP from './Components/Register/ResendOTP';
import MainHome from './Components/MainHome/MainHome';
import PrivateRoute from './Components/PrivayeRoute/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots></Roots>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/register",
        element: <Register></Register>
      },
      {
        path: "/verifyOTP",
        element: <VerifyOTP></VerifyOTP>
      },
      {
        path: "/resendOTP",
        element: <ResendOTP></ResendOTP>
      },
      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/mainHome",
        element: <PrivateRoute><MainHome></MainHome></PrivateRoute>
      }

    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
      <Toaster></Toaster>
    </Provider>
  </React.StrictMode >
)
