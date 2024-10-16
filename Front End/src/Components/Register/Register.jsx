import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import { registerUser } from "../../Redux/userSlice";
import { FaSpinner } from 'react-icons/fa';

const Register = () => {

    const dispatch = useDispatch();
    const { isLoading, error, successMessage } = useSelector((state) => state.userSlice)
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(registerUser(user)).unwrap();
            toast.success(response.message);
            navigate('/verifyOTP');

            // Reset the user state after successful registration
            setUser({
                username: "",
                email: "",
                password: "",
            });
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Register'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link to={'/login'} className="text-blue-500 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
