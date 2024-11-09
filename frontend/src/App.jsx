import { useEffect, useState } from 'react';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import UserLayout from './Components/UserLayout/UserLayout';
import Home from './Pages/Home';
import LoginSignupLayout from './Components/UserLayout/Login&SignupLayout';
import { Signup } from './Pages/SignUp';
import { Login } from './Pages/Login';
import Global from './Utils/Global';
import { LottieAnimation } from './Components/Lottie/LottieAnimation';
import healthLoader from './assets/healthLoader.json'
import Chatbot from './Components/UserLayout/Chatbot';
import Meeting from "./Pages/Meeting/index"


function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    async function fetchUser() {
      setTimeout(async () => {
        try {
          const user = await Global.getUser();
          Global.user = user;
        } finally {
          setIsLoaded(true);
        }
      }, 1500);
    }
    fetchUser();
  }, []);

  const loginRequiredRoutes = [
    "/profile",
  ];

  return (
    <>
      {isLoaded ?
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route path="" element={<Home />} />
            <Route path="about" element={<h1>About</h1>} />
            <Route path="services" element={<h1>Services</h1>} />
            <Route path="contact" element={<h1>Contact</h1>} />
            <Route path='chatbot' element={<Chatbot />} />
          </Route>
          <Route path="/" element={<LoginSignupLayout />} >
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="meeting" element={<Meeting />} />
          </Route>
        </Routes>
        :
        <div className='flex h-[80vh] w-full justify-center items-center'>
          <div className='w-[35vw] h-[35vh]'>
            <LottieAnimation animationData={healthLoader} loop={true} />
          </div>
        </div>
      }
    </>
  )
}

export default App
