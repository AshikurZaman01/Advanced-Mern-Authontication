import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../Redux/userSlice';
import { FaSpinner } from 'react-icons/fa';

const Login = () => {

    const dispatch = useDispatch();
    const { isLoading, error, successMessage } = useSelector((state) => state.userSlice)
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(loginUser(user)).unwrap();

            // Access the payload directly
            if (response.success) {
                navigate('/mainHome');
                toast.success(response.message);
            } else {
                toast.error(response.message || 'Login failed');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'An error occurred during login');
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login to Your Account</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                            />
                            <span className="ml-2">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 focus:bg-blue-700 transition-colors"
                    >
                        {isLoading ? <FaSpinner className='animate-spin mx-auto' /> : 'Login'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link to={'/register'} className="text-blue-500 hover:text-blue-700">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
