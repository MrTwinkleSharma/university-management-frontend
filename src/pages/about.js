import { useNavigate } from "react-router-dom";

function About() {
    const navigator = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#0A1599] text-white">
            <h1 className="text-5xl mb-8">About College Management System Project</h1>
            <p className="text-xl mb-4 px-8 text-center">
               This project was developed as a semester project for the BCA 3rd Year Course.
            </p>
            <p className="text-xl mb-4 px-8 text-center">
                It includes features like login for administration representative and see how many stuends are in various courses also to add other students.
            </p>

            <button
                className="text-2xl border-2 rounded-lg px-6 py-2 mt-8 hover:bg-white hover:text-[#0A1599] cursor-pointer"
                onClick={() => navigator('/')}
            >
                Go back to Home
            </button>
        </div>
    );
}

export default About;
