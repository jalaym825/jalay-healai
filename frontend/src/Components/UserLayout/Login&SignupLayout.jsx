import React from 'react';
import { Outlet } from 'react-router-dom';

const LoginSignupLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 dark:from-teal-950 dark:via-teal-900 dark:to-teal-950">
      {/* Glass morphism container */}
      <div className="w-full max-w-[900px] h-[550px] rounded-3xl shadow-2xl flex overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-teal-950/90 border border-teal-100 dark:border-teal-800">
        {/* Content section */}
        <div className="w-[60%] p-6  relative bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/50 dark:to-teal-950/50">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-200 dark:bg-teal-600/20 rounded-full filter blur-3xl opacity-30 -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-100 dark:bg-teal-700/20 rounded-full filter blur-3xl opacity-30 translate-x-16 translate-y-16"></div>
          
          {/* Main content */}
          <div className="relative ">
            <Outlet />
          </div>
        </div>

        {/* Image section */}
        <div className="w-[40%] relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700 opacity-90"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 font-dm-sans flex flex-col items-center justify-center p-8 text-white">
            <div className="w-16 h-16 mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-center">Your Wellness Journey</h2>
            <p className="text-sm text-center text-white/90 max-w-xs">
              Take the first step towards better mental health with our supportive community
            </p>
          </div>

          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-40 h-40 bg-white rounded-full animate-float-slow top-[20%] left-[10%]" />
            <div className="absolute w-32 h-32 bg-white rounded-full animate-float-medium top-[50%] left-[60%]" />
            <div className="absolute w-24 h-24 bg-white rounded-full animate-float-fast top-[70%] left-[30%]" />
          </div>

          {/* Radial gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-teal-900/30"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupLayout;