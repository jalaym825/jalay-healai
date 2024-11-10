import {
    CallControls,
    CallingState,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useNavigate } from 'react-router-dom';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './meeting.css';
import { useEffect, useState } from 'react';
import Global from '@/Utils/Global';
import { useParams } from 'react-router-dom';
import { LottieAnimation } from '@/Components/Lottie/LottieAnimation';
import healthLoader from '../../assets/healthLoader.json';

const apiKey = 'db7pgv2zjwk4';

export default function App() {
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [appointmentId, setAppointmentId] = useState(null); // Store appointment ID
    const { meetingId } = useParams();
    const navigate = useNavigate();

    const sanitizeUserId = (email) => {
        const rawId = email.split('@')[0];
        const sanitized = rawId
            .toLowerCase()
            .replace(/[^a-z0-9@_-]/g, '')
            .replace(/[@_-]+/g, '_');

        return sanitized
            .replace(/^[@_-]+/, '')
            .replace(/[@_-]+$/, '')
            || 'user';
    };

    useEffect(() => {
        let currentCall = null;

        const setupCall = async () => {
            try {
                const user = {
                    id: sanitizeUserId(Global.user.email),
                    name: Global.user.firstName + ' ' + Global.user.lastName,
                    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
                };

                // Fetch token and appointmentId
                const { token, appointmentId } = await Global.httpPost('/appointment/getToken', {
                    userId: sanitizeUserId(Global.user.email),
                    meetingId
                });


                setAppointmentId(appointmentId); // Set appointmentId from API response

                const videoClient = new StreamVideoClient({ apiKey, user, token });
                setClient(videoClient);

                currentCall = videoClient.call('default', meetingId);

                // Add event listeners for call state changes
                currentCall.on('call.ended', () => {
                    console.log('Call ended');
                    navigate('/'); // Or wherever you want to navigate
                });

                currentCall.on('call.disconnected', () => {
                    console.log('Call disconnected');
                    navigate('/'); // Or wherever you want to navigate
                });

                await currentCall.join({ create: true });
                setCall(currentCall);
            } catch (error) {
                console.error('Error setting up call:', error);
                navigate('/');
            }
        };

        setupCall();

        // Cleanup function
        return () => {
            if (currentCall) {
                // Remove event listeners first
                currentCall.off('call.ended');
                currentCall.off('call.disconnected');

                // Only try to leave if the call is active
                if (currentCall.state.callingState === CallingState.JOINED) {
                    currentCall.leave().catch(console.error);
                }
            }
            if (client) {
                client.disconnectUser().catch(console.error);
            }
        };
    }, [meetingId, navigate]);

    return (
        client && call &&
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyUILayout call={call} appointmentId={appointmentId} />
            </StreamCall>
        </StreamVideo>
    );
}

export const MyUILayout = ({ call, appointmentId }) => {
    const navigate = useNavigate();
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    useEffect(() => {
        if (callingState === CallingState.DISCONNECTED ||
            callingState === CallingState.ENDED ||
            callingState === CallingState.OFFLINE) {
            navigate('/'); // Or your desired fallback if disconnected
        }
    }, [callingState, navigate]);

    const handleLeaveCall = async () => {
        try {
            if (call && call.state.callingState === CallingState.JOINED) {
                await call.leave();
            }
            if (appointmentId && Global.user.role === 'DOCTOR') {
                navigate(`/appointments/${appointmentId}/prescription`); // Redirect to prescription page after leaving
            } else {
                navigate('/'); // Fallback if no appointmentId
            }
        } catch (error) {
            console.error('Error leaving call:', error);
            navigate('/'); // Fallback if an error occurs
        }
    };

    if (callingState !== CallingState.JOINED) {
        return <div className="flex h-[80vh] w-full justify-center items-center">
            <div className="w-[35vw] h-[35vh]">
                <LottieAnimation animationData={healthLoader} loop={true} />
            </div>
        </div>
    }

    return (
        <StreamTheme>
            <SpeakerLayout participantsBarPosition='bottom' />
            <CallControls onLeave={handleLeaveCall} />
        </StreamTheme>
    );
};
