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
import DoctorPrescription from './Pages/DoctorPrescription';
import Home from './Pages/Home';
import { Login } from './Pages/Login';
import Meeting from "./Pages/Meeting/index";
import { Profile } from './Pages/Profile';
import { Signup } from './Pages/SignUp';
import Dashboard from "./Pages/Dashboard";
import Global from './Utils/Global';
import Subscription from './Pages/BookAppointment/Subscription';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const loginRequiredRoutes = ["profile", "dashboard", "meetings"];
  useEffect(() => {
    async function fetchUser() {
      setTimeout(async () => {
        try {
          const user = await Global.getUser();
          Global.user = user;
        } finally {
          const page = window.location.pathname.split("/")[1];
          if (!Global.user && loginRequiredRoutes.includes(page)) {
            window.location.href = "/login";
          }
          setIsLoaded(true);
        }
      }, 1500);
    }
    fetchUser();
  }, []);


  return (
    <>
      {isLoaded ? (
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route path="" element={<Chatbot />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="discussion" element={<DiscussionForm />} />
            <Route path="services" element={<h1>Services</h1>} />
            <Route path="contact" element={<h1>Contact</h1>} />
            <Route path='home' element={<Home />} />
            <Route path='bookappointment' element={<BookAppointment />} />
            <Route path='profile' element={<Profile />} />
            <Route path="forum" element={<ForumComment />} />
            <Route path="forum/:id" element={<ForumComment />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='appointments/:id/prescription' element={<DoctorPrescription />} />
            <Route path="meetings/:meetingId" element={<Meeting />} />
            <Route path="subscription" element={<Subscription />} />
          </Route>
          <Route path="/" element={<LoginSignupLayout />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      ) : (
        <div className="flex h-[80vh] w-full justify-center items-center">
          <div className="w-[25vw] h-[25vh]">
            <LottieAnimation animationData={healthLoader} loop={true} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
