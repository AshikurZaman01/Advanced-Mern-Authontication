import toast from "react-hot-toast";
import { logoutUser } from "../../Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MainHome = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, successMessage } = useSelector((state) => state.userSlice)

    const handleLogout = async () => {
        try {
            const response = await dispatch(logoutUser()).unwrap();
            if (response.success) {
                toast.success(response.message);
                navigate('/');
            }
        } catch (error) {
            console.log('Logout error:', error);
            toast.error(error?.message || "Logout failed. Please try again.");
        }
    };

    return (
        <div>
            <h1>Main Home Page</h1>
            <div>
                <button onClick={handleLogout} className='btn btn-primary btn-sm'>
                    {isLoading ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        </div>
    );
};

export default MainHome;
