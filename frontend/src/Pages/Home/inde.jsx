import React from 'react';
import Footer from '../../Components/UserLayout/Footer';
import {
  Heart,
  Calendar,
  User,
  Clock,
  Activity,
  Stethoscope,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

const Home = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen bg-slate-50">
        <div className="relative bg-gradient-to-r h-[70vh] font-dm-sans from-teal-500 to-teal-700 text-white py-20">
          <div className="absolute inset-0">
            <Particles
              className="absolute inset-0"
              id="tsparticles"
              init={particlesInit}
              options={{
                background: {
                  color: {
                    value: "transparent",
                  },
                },
                fpsLimit: 120,
                particles: {
                  color: {
                    value: ["#99f6e4", "#ccfbf1", "#ffffff"],
                  },
                  links: {
                    color: "#99f6e4",
                    distance: 150,
                    enable: true,
                    opacity: 0.2,
                    width: 1,
                  },
                  move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                      default: "bounce",
                    },
                    random: false,
                    speed: 0.8,
                    straight: false,
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800,
                    },
                    value: 40, // Reduced number of particles
                  },
                  opacity: {
                    value: 0.2, // Reduced opacity
                  },
                  shape: {
                    type: "circle",
                  },
                  size: {
                    value: { min: 1, max: 2 }, // Smaller particles
                  },
                },
                detectRetina: true,
              }}
            />
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="md:w-2/3">
              <h1 className="text-4xl font-montserrat md:text-5xl font-bold mb-6">
                Your Health, Our Priority
              </h1>
              <p className="text-lg font-dm-sans mb-8">
                Experience world-class healthcare with our team of expert doctors and modern facilities.
              </p>
              <Link to='/bookappointment' className="bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 mr-4">
                Book Appointment
              </Link>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600">
                Emergency Care
              </button>
            </div>
          </div>
        </div>

        {/* Rest of the components remain unchanged */}
        {/* Features */}
        <div className="max-w-6xl font-dm-sans mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Online Booking</h3>
              <p className="text-gray-600">Schedule appointments easily with our online booking system.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Emergency</h3>
              <p className="text-gray-600">Round-the-clock emergency care services available.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
              <p className="text-gray-600">Access to highly qualified medical professionals.</p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl font-dm-sans mx-auto px-4">
            <h2 className="text-3xl font-bold font-montserrat text-center mb-12">Our Services</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {/* Service Cards */}
              <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold mb-2">Cardiology</h3>
              </div>

              <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold mb-2">Diagnostics</h3>
              </div>

              <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold mb-2">Pediatrics</h3>
              </div>

              <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold mb-2">Emergency</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default Home;