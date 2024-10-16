import Header from "./Header";

const Home = () => {
    return (
        <div>
            <Header></Header>

            <div className='flex justify-center items-center gap-3 h-[88vh] bg-blue-400'>
                <h1 className='font-bold text-4xl'>Home</h1>
            </div>
        </div>
    );
}

export default Home;
