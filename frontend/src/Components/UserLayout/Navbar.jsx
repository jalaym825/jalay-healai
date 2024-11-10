import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { Button } from "../../UIs/shadcn-ui/button";
import Global from "../../Utils/Global";
import { ProfileMenu } from "./ProfileMenu";
import { Heart } from "lucide-react";
import logo from '../../assets/logo.svg'

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <header>
                <nav className="inset-x-0 top-0 z-50 bg-white text-teal-600 shadow-sm dark:bg-gray-950/90">
                    <div className="w-full max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-14 items-center">
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="text-white hover:text-gray-200 focus:outline-none"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                                </button>
                            </div>

                            <div className="flex-1 flex justify-center md:justify-start">
                                <Link to="/" className="flex items-center justify-center space-x-2">
                                    <img src={logo} alt="logo" className="h-12 w-12" />
                                    <span className="text-2xl font-montserrat mt-2 font-bold">HealAI</span>
                                </Link>
                            </div>

                            <nav className="hidden md:flex flex-1 justify-center lg:justify-start lg:mr-14">
                                <div className="flex gap-4 font-dm-sans">
                                    <Link to='/home' className="font-medium p-2.5 flex items-center text-md transition-colors ">
                                        Home
                                    </Link>
                                    <Link to='/Chatbot' className="font-medium p-2.5 flex items-center text-md transition-colors ">
                                        Chatbot
                                    </Link>
                                    <Link to='/discussion' className="font-medium p-2.5 flex items-center text-md transition-colors ">
                                        Discussion
                                    </Link>
                                    <Link to='/dashboard' className="font-medium p-2.5 flex items-center text-md transition-colors ">
                                        Dashboard
                                    </Link>
                                    <Link to='/subscription' className="font-medium p-2.5 flex items-center text-md transition-colors ">
                                        Subscription
                                    </Link>
                                </div>
                            </nav>

                            <div className="flex items-center justify-end md:w-1/4">
                                {Global.user ? (
                                    <ProfileMenu
                                        trigger={
                                            <Button variant="ghost" size="icon" className="p-0">
                                                <CgProfile className="h-8 w-8 text-gray-800" />
                                            </Button>
                                        }
                                    />
                                ) : (
                                    <Link to="/login">
                                        <Button size="sm" className='bg-teal-100 border border-teal-600 text-teal-600 px-4 py-2 w-24 font-dm-sans rounded-lg font-medium hover:bg-teal-100'>
                                            Login
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {isOpen && (
                            <div className="md:hidden flex flex-col items-center gap-4 mt-4 mb-8">
                                <Link to="#" className="font-medium flex items-center text-lg transition-colors hover:underline" onClick={() => setIsOpen(false)}>
                                    Home
                                </Link>
                                <Link to="#" className="font-medium flex items-center text-lg transition-colors hover:underline" onClick={() => setIsOpen(false)}>
                                    About
                                </Link>
                                <Link to="#" className="font-medium flex items-center text-lg transition-colors hover:underline" onClick={() => setIsOpen(false)}>
                                    Services
                                </Link>
                                <Link to="#" className="font-medium flex items-center text-lg transition-colors hover:underline" onClick={() => setIsOpen(false)}>
                                    Contact
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
}

function MountainIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    );
}

function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
    );
}

function XIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
