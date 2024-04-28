import { useNavigate } from "react-router-dom";

function Header() {
    const navigator = useNavigate();

    return <header className="flex justify-between bg-[#0A1599] text-white  p-5">
        <p className="text-3xl">
            College Management System
        </p>
        <div className="flex space-x-4">

            <p className="text-2xl border-2 rounded-lg px-2 py-1 hover:bg-white hover:text-[#0A1599] cursor-pointer	"
                onClick={() => navigator('/about')}
            >
                About
            </p>
            <p className="text-2xl border-2 rounded-lg px-2 py-1 hover:bg-white hover:text-[#0A1599] cursor-pointer	"
                onClick={() => navigator('/login')}
            >
                Login
            </p>
        </div>

    </header>
}

export default Header; 