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

import '@stream-io/video-react-sdk/dist/css/styles.css';
import './Meeting.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const apiKey = 'db7pgv2zjwk4';
const userId = 'Asajj_Ventress';
const callId = 'GiHaVsyJK5Pz';

const user = {
    id: userId,
    name: 'Oliver',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

export default function App() {
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);

    useEffect(() => {
        (async () => {
            const { data } = await axios.post('http://localhost:3001/api/get-token', {
                userId
            });
            console.log(data);
            const client = new StreamVideoClient({ apiKey, user, token: data.jwtToken });
            setClient(client);
            const call = client.call('default', callId);
            call.join({ create: true });
            setCall(call);
        })()
    }, [])
    return (
        client && call &&
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <MyUILayout />
            </StreamCall>
        </StreamVideo>
    );
}

export const MyUILayout = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) {
        return <div>Loading...</div>;
    }

    return (
        <StreamTheme>
            <SpeakerLayout participantsBarPosition='bottom' />
            <CallControls />
        </StreamTheme>
    );
};