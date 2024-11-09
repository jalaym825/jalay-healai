import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Stethoscope, Heart, Brain, Activity } from 'lucide-react';
import { FaHeart, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import Global from '@/Utils/Global';
import axios from 'axios';

const Chatbot = () => {
    const [userInput, setUserInput] = useState("");
    const [session_id, setSession_id] = useState("");

    useEffect(() => {
        setSession_id(`session_${Date.now()}`);
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSendMessage = async() => {
        const response = await axios.post('http://37.27.81.8:9001/send_message', JSON.stringify( { message: userInput, session_id }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        setUserInput('');
    };


    return (
        <div className='w-full h-[91vh]'>
                <div className="h-full font-dm-sans bg-white/90 backdrop-blur-lg  border-teal-100">
                    <div className="flex justify-center  p-4 items-center h-full bg-gradient-to-r from-gray-100 to-gray-200">
                        <div className="flex flex-col w-full max-w-4xl bg-white rounded-2xl shadow-md h-full">
                            <div className="flex items-center rounded-t-xl justify-between p-6 bg-gradient-to-r from-teal-500 to-teal-600">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                                        <Stethoscope className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <span
                                            className="text-white font-bold text-lg">
                                            Health Assistant
                                        </span>
                                        <p
                                            className="text-teal-100 text-sm">
                                            A safe space to talk and get support
                                        </p>
                                    </div>
                                </div>
                                <Link to='/'>
                                    <button
                                        className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </Link>
                            </div>

                            <div
                                className="flex justify-center items-center my-3">
                                <label htmlFor="language-select" className="mr-2 font-bold">
                                    Choose Language:
                                </label>
                                <select
                                    id="language-select"
                                    className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300">
                                    <option value="en-US">English</option>
                                    <option value="hi-IN">Hindi</option>
                                    <option value="mr-IN">Marathi</option>
                                    <option value="gu-IN">Gujarati</option>
                                </select>
                            </div>

                            <div
                                className="flex-grow overflow-y-auto p-5 space-y-4">
                                <div
                                    className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
                                    👋 Hello! I'm here to listen and support you. How are you feeling today?
                                </div>
                            </div>

                            <div
                                className="p-5 border-t border-gray-300 flex items-end gap-3">
                                <textarea
                                    id="user-input"
                                    className="flex-grow p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                                    placeholder="Type your message here..."
                                    rows="1"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                />
                                <button
                                    className="p-3 border border-green-500 text-green-500 rounded-lg hover:bg-gray-100 transition">
                                    <FaMicrophone />
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition" >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Chatbot;