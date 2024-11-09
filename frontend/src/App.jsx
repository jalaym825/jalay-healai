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
import BookAppointment from './Pages/BookAppointment';
import { Profile } from './Pages/Profile';
import DiscussionForm from './Pages/DiscussionForum';
import ForumComment from './Pages/DiscussionForum/Forum';
import Meeting from "./Pages/Meeting/index"
import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import UserLayout from "./Components/UserLayout/UserLayout";
import Home from "./Pages/Home";
import LoginSignupLayout from "./Components/UserLayout/Login&SignupLayout";
import { Signup } from "./Pages/SignUp";
import { Login } from "./Pages/Login";
import Global from "./Utils/Global";
import { LottieAnimation } from "./Components/Lottie/LottieAnimation";
import healthLoader from "./assets/healthLoader.json";
import Chatbot from "./Components/UserLayout/Chatbot";
import Dashboard from "./Pages/Dashboard";
import Doctordashboard from './Pages/DoctorDashboard'

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

  const loginRequiredRoutes = ["/profile"];

  return (
    <>
      {isLoaded ? (
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route path="" element={<Home />} />
            <Route path="/discussion" element={<DiscussionForm />} />
            <Route path="services" element={<h1>Services</h1>} />
            <Route path="contact" element={<h1>Contact</h1>} />
            <Route path='chatbot' element={<Chatbot />} />
            <Route path='bookappointment' element={<BookAppointment />} />
            <Route path='profile' element={<Profile />} />
            <Route path="forum" element={<ForumComment />} />
            <Route path="meeting/:meetingId" element={<Meeting />} />
          </Route>
          <Route path="/" element={<LoginSignupLayout />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      ) : (
        <div className="flex h-[80vh] w-full justify-center items-center">
          <div className="w-[35vw] h-[35vh]">
            <LottieAnimation animationData={healthLoader} loop={true} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
