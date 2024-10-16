import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {

    const { user, isLoading, error } = useSelector((state) => state.userSlice)


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="text-9xl animate-spin" />
            </div>
        );
    }

    if (error) {
        return <Navigate to="/login" replace={true} />
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children;

}

export default PrivateRoute