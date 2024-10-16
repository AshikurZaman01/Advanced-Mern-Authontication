import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { resentOTP, verifyOTP } from "../../Redux/userSlice";

const VerifyOTP = () => {
    const dispatch = useDispatch();
    const { isLoading, error, successMessage } = useSelector((state) => state.userSlice);
    const navigate = useNavigate();

    const inputRefs = useRef([]);
    const [otp, setOtp] = useState(Array(6).fill(""));

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move focus to next input or previous input based on value
            if (value.length === 1 && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            } else if (value.length === 0 && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async (otp) => {
        try {
            const response = await dispatch(verifyOTP({ otp })).unwrap();
            toast.success(response.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.message || "An error occurred during verification");
        }
    };

    const handleResendOtp = async () => {
        // Add your resend OTP logic here
        setOtp(Array(6).fill(""));
        inputRefs.current[0].focus();
        navigate('/resendOTP')
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
                <h2 className="text-2xl font-semibold text-gray-800 text-center">Verify OTP</h2>
                <p className="text-gray-600 text-center mt-2 mb-4">
                    Enter the OTP sent to your email/phone
                </p>
                <div className="flex justify-center gap-2 mb-4">
                    {otp.map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="w-10 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            value={otp[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => inputRefs.current[index] = el}
                        />
                    ))}
                </div>
                <button
                    className={`w-full py-2 rounded-md transition duration-200 ${isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    onClick={() => handleVerify(otp.join(""))}
                    disabled={otp.includes("") || isLoading}
                >
                    {isLoading ? (
                        <FaSpinner className="animate-spin mx-auto" />
                    ) : (
                        'Verify OTP'
                    )}
                </button>
                <p className="text-gray-600 text-center mt-4">
                    Didn’t receive the code?{' '}
                    <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={handleResendOtp}
                    >
                        Resend OTP
                    </span>
                </p>
            </div>
        </div>
    );
};

export default VerifyOTP;
