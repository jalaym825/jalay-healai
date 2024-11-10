import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import healthLoader from './assets/healthLoader.json';
import { LottieAnimation } from './Components/Lottie/LottieAnimation';
import Chatbot from './Components/UserLayout/Chatbot';
import LoginSignupLayout from './Components/UserLayout/Login&SignupLayout';
import UserLayout from './Components/UserLayout/UserLayout';
import BookAppointment from './Pages/BookAppointment';
import DiscussionForm from './Pages/DiscussionForum';
import ForumComment from './Pages/DiscussionForum/Forum';
import Home from './Pages/Home';
import { Login } from './Pages/Login';
import Meeting from "./Pages/Meeting/index";
import { Profile } from './Pages/Profile';
import { Signup } from './Pages/SignUp';
import Global from './Utils/Global';
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
            <Route path="dashboard" element={<Dashboard />} />
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
