import Footer from "./footer";
import Header from "./header";

function Home() {
    return <div className="h-screen">
        <div className='sticky top-0 w-full'>
            <Header />
        </div>
        <img className="" src="/building_2.jpg" alt="college" />
        <div className='static bottom-0 w-full'>
            <Footer />
        </div>
    </div>
}

export default Home; 