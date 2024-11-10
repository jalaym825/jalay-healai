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
import './meeting.css';
import { useEffect, useState } from 'react';
import Global from '@/Utils/Global';
import { useParams } from 'react-router-dom';

const apiKey = 'db7pgv2zjwk4';


export default function App() {
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const { meetingId } = useParams();
    useEffect(() => {
        (async () => {
            const user = {
                id: Global.user.email.split('@')[0],
                name: 'Oliver',
                image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
            };

            const { token } = await Global.httpPost('/appointment/getToken');
            const client = new StreamVideoClient({ apiKey, user, token });
            setClient(client);
            const call = client.call('default', meetingId);
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