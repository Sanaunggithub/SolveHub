import { Link } from 'react-router-dom';

export default function Welcome() {
    return(
        <section className="px-4 py-12 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold">Welcome To SolveHub</h1>
            <h5 className="text-lg font-light">
            Connect, discuss, and share knowledge with like-minded individuals
            </h5>

            <div className="flex justify-center space-x-4 mt-6">
            <Link 
                to="/discussions" 
                className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-200"
            >
                Join Discussion
            </Link>

            <Link 
                to="/discussions" 
                className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-200"
            >
                Browse Topics
            </Link>
            </div>
        </div>
        </section>
    )
}