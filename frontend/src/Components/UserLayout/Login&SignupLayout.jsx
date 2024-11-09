import React from 'react';
import { Outlet } from 'react-router-dom';
import healthcare from '../../assets/healthcare.jpg'

const LoginSignupLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-200 to-teal-600 flex items-center justify-center p-4">
            <div className="w-full max-w-[900px] h-[500px] bg-white rounded-3xl shadow-xl flex overflow-hidden">
                <div className="w-[60%] p-12 flex flex-col bg-[#dcf2ee]">
                    <Outlet />
                </div>

                <div className="w-[40%] bg-gradient-to-br from-teal-500 to-teal-700  relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('/api/placeholder/400/600')] opacity-20 mix-blend-overlay"></div>
                    <img
                        src={healthcare} alt="Woman using tablet"
                        className="w-full h-full object-cover "
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginSignupLayout;