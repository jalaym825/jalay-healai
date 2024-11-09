import { useEffect, useState } from 'react';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import UserLayout from './Components/UserLayout/UserLayout';
import Home from './Pages/Home/inde';
import { Loader } from './Components/UserLayout/Loader';
import LoginSignupLayout from './Components/UserLayout/Login&SignupLayout';
import { Signup } from './Pages/SignUp';
import { Login } from './Pages/Login';
import Global from './Utils/Global';


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
          </Route>
          <Route path="/" element={<LoginSignupLayout />} >
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
        :
        <Loader />
      }
    </>
  )
}

export default App
