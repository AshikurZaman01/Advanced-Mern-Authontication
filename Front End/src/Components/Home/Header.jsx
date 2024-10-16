import { Link } from "react-router-dom"

const Header = () => {
    return (
        <div>
            <div className="h-[12vh] shadow-md bg-red-400">
                <div className='w-[80%] mx-auto flex items-center justify-between h-full'>

                    <h1 className='text-3xl font-bold uppercase'>Logo</h1>

                    <Link to={"/mainHome"}><button className='btn btn-sm btn-secondary text-white'>Main Home</button></Link>

                    <Link to={"/register"}><button className='btn btn-sm bg-black text-white'>Register</button></Link>

                </div>
            </div>
        </div>
    )
}

export default Header