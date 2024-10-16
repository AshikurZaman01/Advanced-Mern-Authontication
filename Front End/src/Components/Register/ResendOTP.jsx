import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resentOTP } from '../../Redux/userSlice';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const ResendOTP = () => {

    const dispatch = useDispatch();
    const { isLoading, error, successMessage } = useSelector((state) => state.userSlice);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleResetOTP = async (e) => {
        e.preventDefault();

        // Call the API to resend OTP
        try {
            const response = await dispatch(resentOTP({ email })).unwrap();
            if (response.success) {
                toast.success(response.message);
                navigate('/verifyOTP');
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Resend OTP</h1>

                <form className="space-y-6" onSubmit={handleResetOTP}>
                    <div>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                        >
                            {isLoading ? <FaSpinner className='animate-spin mx-auto'></FaSpinner> : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResendOTP;
