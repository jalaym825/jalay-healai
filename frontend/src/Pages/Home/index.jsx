import React from "react";
import Footer from "../../Components/UserLayout/Footer";
import {
  Heart,
  Calendar,
  User,
  Clock,
  Activity,
  Stethoscope,
  FileText,
  Truck,
  Syringe,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import healthsvg from "../../assets/healthsvg.svg";
import doctor from "../../assets/doctor.jpg";
import doctor1 from "../../assets/doctor1.jpg";
import doctor2 from "../../assets/doctor2.jpg";
import FAQs from "@/Components/UserLayout/FAQs";

const ServicesSection = () => {
  return (
    <div className="relative bg-gradient-to-b from-white to-teal-50 py-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-100/30 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-1/4 w-4 h-4 text-teal-200">+</div>
      <div className="absolute bottom-1/4 right-1/4 w-4 h-4 text-teal-200">
        +
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-montserrat text-teal-900 mb-4">
            Our Services
          </h2>
          <p className="text-teal-600 max-w-2xl mx-auto">
            Experience comprehensive healthcare with our wide range of medical
            services designed to meet all your health needs.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Emergency Care Card */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">Emergency Care</h3>
            <p className="text-teal-100">
              24/7 emergency medical services with rapid response and expert
              care.
            </p>
          </div>

          {/* Surgical Services Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="mb-6">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                <Syringe className="w-8 h-8 text-teal-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-teal-900 mb-3">
              Surgical Services
            </h3>
            <p className="text-teal-600">
              State-of-the-art surgical facilities with experienced surgeons.
            </p>
          </div>

          {/* Pharmacy Services Card */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">Pharmacy Services</h3>
            <p className="text-teal-100">
              Full-service pharmacy with prescription fulfillment and
              counseling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorSection = () => {
  const doctors = [
    {
      name: "Rufus Stewart",
      role: "Radiologist",
      social: "@reallygreatsite",
      image: doctor,
    },
    {
      name: "Daniel Gallego",
      role: "Surgeon",
      social: "@reallygreatsite",
      image: doctor2,
    },
    {
      name: "Juliana Silva",
      role: "Nutritionist",
      social: "@reallygreatsite",
      image: doctor1,
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 min-h-screen py-16 px-4">
      {/* Background Design Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 text-emerald-700/20 text-6xl">
          +
        </div>
        <div className="absolute bottom-10 right-10 text-emerald-700/20 text-6xl">
          +
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h1 className="text-white text-5xl font-bold mb-8">Doctor Team</h1>
          <div className="flex justify-center gap-2 mb-12">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {doctors.map((doctor, index) => (
            <div key={index} className="w-full">
              <div className="w-40 h-40 top-20 ml-20   absolute rounded-full overflow-hidden mx-auto border-4 border-white">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full   object-cover"
                />
              </div>
              <div className="bg-white border-[0.5px] border-gray-400 text-black h-[40vh] rounded-3xl p-6 text-center">
                <div className="relative h-[80px]"></div>
                <h3 className=" text-xl font-bold mb-2">
                  {doctor.name}
                </h3>
                <p className=" mb-4">{doctor.role}</p>
                <div className="bg-teal-400 rounded-full py-2 px-4 text-white text-sm">
                  {doctor.social}
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

const Home = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen bg-slate-50">
        <div className="relative bg-gradient-to-r h-[90vh] font-dm-sans from-teal-500 to-teal-700 text-white py-20">
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
                    width: 1.5,
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
          <div className="relative z-10 h-full max-w-6xl flex mx-auto px-4">
            <div className="md:w-[50%] h-full p-10">
              <h1 className="text-4xl font-montserrat md:text-5xl font-bold mb-6">
                Your Health, Our Priority
              </h1>
              <p className="text-lg font-dm-sans mb-8">
                Experience world-class healthcare with our team of expert
                doctors and modern facilities.
              </p>
              <Link
                to="/bookappointment"
                className="bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 mr-4"
              >
                Book Appointment
              </Link>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600">
                Emergency Care
              </button>
            </div>
            <div className="md:w-[50%] h-full flex justify-center items-center">
              <img src={healthsvg} alt="healthsvg" className="p-14" />
            </div>
          </div>
        </div>

      

        {/* Services Section */}
        <ServicesSection />
        <DoctorSection />
      </div>

      <Link
        to="/chatbot"
        className="fixed right-4 bottom-10 z-50 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full shadow-[0_8px_16px_rgba(20,184,166,0.3)] hover:shadow-[0_12px_24px_rgba(20,184,166,0.4)] hover:transform hover:scale-110 hover:transition-all hover:duration-900 hover:animate-bounce"
      >
        <div className="relative flex items-center justify-center">
          <Stethoscope className="w-8 h-8 text-white" />
          <div className="absolute inset-0 bg-white opacity-20 blur-sm rounded-full"></div>
        </div>
      </Link>
      <section className="bg-white py-24 relative overflow-hidden">
        <FAQs />
      </section>
      <Footer className="mt-auto" />
    </div>
  );
};

export default Home;