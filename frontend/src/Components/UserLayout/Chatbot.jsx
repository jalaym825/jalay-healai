import {useEffect, useRef, useState} from 'react';
import {Stethoscope, X} from 'lucide-react';
import {FaMicrophone, FaPaperPlane} from "react-icons/fa";
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../../Utils/Global';
import {toast} from "sonner";

const Chatbot = () => {
    const [userInput, setUserInput] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState(null);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const messagesEndRef = useRef(null);
    const recognition = useRef(null);
    const synth = window.speechSynthesis;

    const doctorQueryPatterns = [
        // Direct requests for doctor suggestions
        /suggest(?:\s+me)?\s+doctors?/i,  // Added to catch "suggest me doctors"
        /doctor suggestions?/i,
        /suggest(?:ions? for)? doctors?/i,
        /recommend(?:ations? for)? doctors?/i,

        // Different ways to ask for suggestions
        /(?:show|tell|give)(?:\s+me)?\s+(?:some\s+)?doctors?/i,
        /(?:need|want)(?:\s+some)?\s+doctors?/i,
        /looking\s+for\s+(?:a\s+)?doctor/i,

        // Consultation related
        /(?:want|need|looking) to (?:see|consult|meet|visit) (?:a |the )?doctor/i,
        /(?:book|schedule|make) (?:a |an )?appointment/i,
        /(?:find|search for) (?:a |the )?doctor/i,

        // Health concerns
        /(?:medical|health) (?:advice|help|assistance)/i,
        /(?:feel|feeling) (?:sick|unwell|ill)/i,
        /(?:have|having) (?:health|medical) (?:issues?|problems?|concerns?)/i
    ];

// Function to check if input matches any medical query patterns
    function isDoctorQuery(userInput) {
        return doctorQueryPatterns.some(pattern => pattern.test(userInput));
    }

    useEffect(() => {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window) {
            recognition.current = new webkitSpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setUserInput(prev => prev + transcript);
                setIsListening(false);
            };

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }

        setSessionId(`session_${Date.now()}`);
        setMessages([{
            type: 'bot',
            content: "👋 Hello! I'm here to listen and support you. How are you feeling today?"
        }]);

        return () => {
            if (recognition.current) {
                recognition.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (recognition.current) {
            recognition.current.lang = selectedLanguage;
        }
    }, [selectedLanguage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const toggleListening = () => {
        if (!recognition.current) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }

        if (isListening) {
            recognition.current.stop();
            setIsListening(false);
        } else {
            recognition.current.start();
            setIsListening(true);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        try {
            setIsLoading(true);
            const userMessage = {
                type: 'user',
                content: userInput.trim()
            };
            setMessages(prev => [...prev, userMessage]);
            setUserInput('');

            if (isDoctorQuery(userMessage.content.trim())) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: "Here are our available doctors for consultation:",
                    isDoctorList: true
                }]);
                return;
            }

          const response = await axios.post(`${import.meta.env.VITE_CHATBOT_URL}/send_message`, {
                message: userMessage.content,
                session_id: sessionId,
                language: selectedLanguage
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const cleanedResponse = cleanMessageContent(response.data.response);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: cleanedResponse
            }]);

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: "Sorry, I couldn't process your message. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const cleanMessageContent = (content) => {
        return content.replace(/^\s*\*\s*/gm, ' ')
            .replace(/\s+\*\s+/g, '  ')
            .replace(/\*\*/g, '');
    };

    const toggleAudio = (messageIndex) => {
        const botMessage = messages[messageIndex];
        if (audioEnabled) {
            window.speechSynthesis.cancel();
        } else {
            speakText(botMessage.content);
        }
        setAudioEnabled(!audioEnabled);
    };

    const createWordSpans = (text) => {
        return text.split(' ').map((word, index) => (
            <span
                key={index}
                className={`tts-word ${highlightIndex === index && currentSpeakingIndex !== null ? 'highlighted' : ''}`}
            >
                {word}{' '}
            </span>
        ));
    };

    const speakText = (text, messageIndex) => {
        if (currentSpeakingIndex !== null) {
            synth.cancel();
            setCurrentSpeakingIndex(null);
            setHighlightIndex(0);
            setAudioEnabled(false);
            return;
        }

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = selectedLanguage;
        speech.rate = 1;
        speech.pitch = 1;

        // Word boundary event for highlighting
        speech.onboundary = (event) => {
            if (event.name === 'word') {
                setHighlightIndex(prev => prev + 1);
            }
        };

        speech.onend = () => {
            setCurrentSpeakingIndex(null);
            setHighlightIndex(0);
            setAudioEnabled(false);
        };

        setCurrentSpeakingIndex(messageIndex);
        setHighlightIndex(0);
        setAudioEnabled(true);
        synth.speak(speech);
    };

    const Message = ({message, index}) => {
        const isUser = message.type === 'user';
        const isError = message.type === 'error';
        const isSpeaking = currentSpeakingIndex === index;
        const [doctorsData, setDoctorsData] = useState(null);

        const createAppointment = async (doctorEmail) => {
            try {
                if(!Global.user){
                    toast.error("Please login to book an appointment");
                    return;
                }
                if(Global.user.subscription === 'FREE'){
                    toast.error("Please upgrade to premium to book an appointment");
                    return;
                }
                const response = await Global.httpPost('/appointment/createAppointment', {
                    time: new Date(doctorsData.nextAvailableTime),
                    hosted_by: doctorEmail,
                    attended_by: Global.user.email
                });

                console.log("Appointment created:", response);

                window.location.href = 'meetings/' + response.meeting_id;
            } catch (error) {
                console.error('Error creating appointment:', error);
                setMessages(prev => [...prev, {
                    type: 'error',
                    content: "Sorry, there was an error scheduling your appointment. Please try again."
                }]);
            }
        };


        useEffect(() => {
            // Fetch doctors data when message is a doctor list
            const fetchDoctors = async () => {
                if (message.isDoctorList) {
                    try {
                        const response = await Global.httpGet('/appointment/getAvailableDoctors');
                        console.log(response)
                        setDoctorsData(response.data);
                    } catch (error) {
                        console.error('Error fetching doctors:', error);
                    }
                }
            };

            fetchDoctors();
        }, [message.isDoctorList]);

        if (message.isDoctorList && doctorsData) {
            return (
                <div className="flex justify-start mb-4">
                    <div className="max-w-[70%] p-3 rounded-lg bg-gray-100 text-gray-800">
                        <strong>HealAI:</strong>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                Next available appointment: {new Date(doctorsData.nextAvailableTime).toLocaleString()}
                            </p>
                            <div className="space-y-2 mt-3">
                                {doctorsData.availableDoctors.map((doctor, idx) => (
                                    <div key={idx} className="p-3 bg-white rounded-lg shadow-sm">
                                        <p className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</p>
                                        <p className="text-sm text-gray-600">{doctor.email}</p>
                                        <button
                                            onClick={() => createAppointment(doctor.email)}
                                            className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                                        >
                                            Schedule Appointment
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                    isUser ? 'bg-teal-600 text-white' :
                        isError ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-800'
                }`}>
                    <strong>{isUser ? 'You' : 'HealAI'}:</strong>{' '}
                    {isUser ? (
                        message.content
                    ) : (
                        <div className="relative">
                            {createWordSpans(message.content)}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-[91vh]">
            <div className="h-full font-dm-sans bg-white/90 backdrop-blur-lg border-teal-100">
                <div className="flex justify-center p-4 items-center h-full bg-gradient-to-r from-gray-100 to-gray-200">
                    <div className="flex flex-col w-full max-w-4xl bg-white rounded-2xl shadow-md h-full">
                        {/* Header */}
                        <div
                            className="flex items-center rounded-t-xl justify-between p-6 bg-gradient-to-r from-teal-500 to-teal-600">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                                    <Stethoscope className="w-6 h-6 text-teal-600"/>
                                </div>
                                <div>
                                    <span className="text-white font-bold text-lg">
                                        Health Assistant
                                    </span>
                                    <p className="text-teal-100 text-sm">
                                        A safe space to talk and get support
                                    </p>
                                </div>
                            </div>
                            <Link to='/'>
                                <button
                                    className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                                    <X className="w-5 h-5"/>
                                </button>
                            </Link>
                        </div>

                        {/* Language Selector */}
                        <div className="flex justify-center items-center my-3">
                            <label htmlFor="language-select" className="mr-2 font-bold">
                                Choose Language:
                            </label>
                            <select
                                id="language-select"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                                <option value="en-US">English</option>
                                <option value="hi-IN">Hindi</option>
                                <option value="mr-IN">Marathi</option>
                                <option value="gu-IN">Gujarati</option>
                            </select>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-grow overflow-y-auto p-5 space-y-4">
                            {messages.map((message, index) => (
                                <Message key={index} message={message} index={index}/>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <span className="animate-pulse">Typing...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef}/>
                        </div>

                        {/* Listen Button Below the Messages */}
                        {messages.length > 0 && messages[messages.length - 1].type !== 'user' && (
                            <div className="p-5 flex justify-center">
                                <button
                                    onClick={() => toggleAudio(messages.length - 1)}
                                    className="p-2 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-md"
                                >
                                    {audioEnabled ? "Turn Off Audio" : "Listen"}
                                </button>
                            </div>
                        )}

                        <div className="p-5 border-t border-gray-300 flex items-end gap-3">
                            <textarea
                                id="user-input"
                                className="flex-grow p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                                placeholder="Type your message here..."
                                rows="1"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading || isListening}
                            />
                            <button
                                onClick={toggleListening}
                                className={`p-3 border rounded-lg transition ${isListening
                                    ? 'border-red-500 text-red-500 animate-pulse'
                                    : 'border-green-500 text-green-500 hover:bg-gray-100'
                                }`}
                                aria-label="Voice Input"
                                disabled={isLoading}
                            >
                                <FaMicrophone/>
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !userInput.trim()}
                                className={`p-3 rounded-lg transition ${isLoading || !userInput.trim()
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                                }`}
                                aria-label="Send Message"
                            >
                                <FaPaperPlane/>
                            </button>
                            <style jsx>{`
                                .tts-word {
                                    display: inline-block;
                                    color: #666;
                                    transition: all 0.2s ease-in-out;
                                    padding: 0 2px;
                                }

                                .tts-word.highlighted {
                                    color: #000;
                                    font-weight: 600;
                                    transform: scale(1.05);
                                }

                                @keyframes pulse {
                                    0% {
                                        opacity: 1;
                                    }
                                    50% {
                                        opacity: 0.5;
                                    }
                                    100% {
                                        opacity: 1;
                                    }
                                }

                                .speaking-indicator {
                                    animation: pulse 1.5s infinite;
                                }
                            `}</style>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
