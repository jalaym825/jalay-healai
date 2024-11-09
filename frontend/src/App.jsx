import { useState } from 'react';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import UserLayout from './Components/UserLayout/UserLayout';
import Home from './Pages/Home/inde';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);


  return (
    <>
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route path="" element={<Home />} />
              <Route path="about" element={<h1>About</h1>} />
              <Route path="services" element={<h1>Services</h1>} />
              <Route path="contact" element={<h1>Contact</h1>} />
            </Route>
          </Routes>
    </>
  )
}

export default App
